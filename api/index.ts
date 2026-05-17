import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Initialize Gemini with the modern SDK as per gemini-api skill
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const DEFAULT_MODEL = "gemini-3-flash-preview";

// Helper for retrying AI calls on transient errors
async function generateWithRetry(params: any, retries = 2) {
  let lastError;
  for (let i = 0; i <= retries; i++) {
    try {
      return await ai.models.generateContent(params);
    } catch (error: any) {
      lastError = error;
      // Retry on 503 (Service Unavailable)
      const isUnavailable = error.status === "UNAVAILABLE" || error.code === 503;
      // 429 is Resource Exhausted (Quota). Retrying immediately rarely helps but we do it once with longer wait.
      const isRateLimited = error.status === "RESOURCE_EXHAUSTED" || error.code === 429;
      
      if ((isUnavailable || isRateLimited) && i < retries) {
        const waitTime = isRateLimited ? 5000 * (i + 1) : 1000 * (i + 1);
        console.log(`Retrying AI call (attempt ${i + 1}/${retries}) due to ${error.status} after ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

// API Routes
app.post("/api/ai/validate", async (req, res) => {
  const { original, unsayed } = req.body;
  try {
    const response = await generateWithRetry({
      model: DEFAULT_MODEL,
      config: {
        systemInstruction: `You are the ultimate linguistic Arbiter for the game 'UNSAY'. 
The player transforms an original sentence by deleting words.
The result MUST be a perfectly grammatical, natural, and logical English sentence or a common idiomatic phrase.

STRICT EVALUATION CRITERIA:
1. isLogical (BOOLEAN):
   - MUST be a complete, natural-sounding English thought that stands ALONE.
   - REJECT fragments that rely on missing context.
   - "It is to win" is REJECTED. It is a severed fragment.
   - "The king is dead" is ACCEPTED.
   - "I am definitely to fail" is REJECTED (invalid structure).
   - "History is written" is ACCEPTED.
   - "Money buy happiness" is REJECTED (missing 'can' or 'buys').
   - "I want to see" is REJECTED.
   - "I want you" is ACCEPTED.
   - If the logic is "robotic" or "broken", isLogical MUST be FALSE.

2. meaningShift (NUMBER 0-10):
   - 0: Identical meaning.
   - 10: Complete reversal (e.g. "I love you" -> "I love").
   - If a negation (not, never, no, impossible) is removed, it is AUTOMATICALLY a 10.

3. feedback (STRING):
   - A short, witty observation (max 10 words). If you reject, explain exactly what part of the grammar is broken.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isLogical: { type: Type.BOOLEAN },
            meaningShift: { type: Type.NUMBER },
            feedback: { type: Type.STRING },
          },
          required: ["isLogical", "meaningShift", "feedback"]
        },
        temperature: 0,
      },
      contents: `Original: "${original}"\nPlayer's Result: "${unsayed}"`,
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error) {
    console.error("AI Validation Error:", error);
    res.status(500).json({ error: "Failed to validate" });
  }
});

app.post("/api/ai/generate", async (req, res) => {
  const { difficulty } = req.body;
  try {
    const response = await generateWithRetry({
      model: DEFAULT_MODEL,
      contents: `Generate a magical, whimsical sentence for the game 'UNSAY'.
Difficulty: ${difficulty}.
The sentence should be 6-12 words long and contain at least one negation or strong adjective that can be removed to significantly flip the meaning.
Example: "The stars never shine for the lonely heart."
Return ONLY the text of the sentence.`,
    });
    res.json({ text: (response.text || "").trim() });
  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ error: "Failed to generate" });
  }
});

app.post("/api/ai/hint", async (req, res) => {
  const { original, requiredRemovals } = req.body;
  try {
    const response = await generateWithRetry({
      model: DEFAULT_MODEL,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            wordToReveal: { type: Type.STRING },
            suggestion: { type: Type.STRING },
          },
          required: ["wordToReveal", "suggestion"]
        },
        temperature: 0.2,
      },
      contents: `Help a player in the game 'UNSAY'.
The player needs to remove ${requiredRemovals} words from: "${original}".
Suggest ONE word to remove to significantly change the meaning while keeping it logical.`,
    });
    res.json(JSON.parse(response.text || "{}"));
  } catch (error) {
    console.error("AI Hint Error:", error);
    res.status(500).json({ error: "Failed to get hint" });
  }
});

async function setupApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Correctly serve from dist when moved into api/
    const distPath = path.join(__dirname, "..", "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Only listen if not on Vercel
  if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    const PORT = 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  }
}

setupApp();

export default app;
