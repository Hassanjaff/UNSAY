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

// Initialize Gemini
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

// API Routes
app.post("/api/ai/validate", async (req, res) => {
  const { original, unsayed } = req.body;
  try {
    const response = await model.generateContent({
      contents: [{
        role: "user",
        parts: [{
          text: `You are the final arbiter for the game 'UNSAY'. 
The player transforms a sentence by deleting words.
Original: "${original}"
Result: "${unsayed}"

CRITICAL EVALUATION CRITERIA:
1. isLogical (BOOLEAN):
   - Does the result form a grammatically coherent English phrase or sentence?
   - It MUST have a clear, recognizable structure (e.g., Subject-Verb, or a common idiomatic fragment).
2. meaningShift (0-10):
   - 0: No change / exactly same intent.
   - 3: Noticeable change in sentiment or scope.
   - 5: Moderate change.
   - 8-10: Complete reversal of truth or total transformation of intent.
3. feedback (STRING):
   - A short, 1-sentence observation. 

Return ONLY JSON.`,
        }],
      }],
      generationConfig: {
        temperature: 0.1,
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
      },
    });

    const text = response.response.text();
    res.json(JSON.parse(text));
  } catch (error) {
    console.error("AI Validation Error:", error);
    res.status(500).json({ error: "Failed to validate" });
  }
});

app.post("/api/ai/generate", async (req, res) => {
  const { difficulty } = req.body;
  try {
    const response = await model.generateContent({
      contents: [{
        role: "user",
        parts: [{
          text: `Generate a single pregnant, interesting sentence in English for a game. 
Difficulty: ${difficulty}
The sentence should have around 6-12 words.
Return only the sentence.`,
        }],
      }],
    });
    res.json({ text: response.response.text().trim() });
  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ error: "Failed to generate" });
  }
});

app.post("/api/ai/hint", async (req, res) => {
  const { original, requiredRemovals } = req.body;
  try {
    const response = await model.generateContent({
      contents: [{
        role: "user",
        parts: [{
          text: `You are a helper for the game 'UNSAY'.
The player must delete exactly ${requiredRemovals} words from this sentence to change its meaning logicaly.
Sentence: "${original}"

Provide:
1. wordToReveal: A single word from the sentence that is a good candidate for deletion to shift the meaning.
2. suggestion: A full example of what the sentence COULD become after deleting ${requiredRemovals} words.

Return ONLY JSON.`,
        }],
      }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            wordToReveal: { type: Type.STRING },
            suggestion: { type: Type.STRING },
          },
          required: ["wordToReveal", "suggestion"]
        },
      },
    });
    res.json(JSON.parse(response.response.text()));
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
