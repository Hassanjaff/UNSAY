import { GoogleGenAI, Type } from "@google/genai";
import { ValidationResponse, HintResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function validateUnsay(original: string, unsayed: string): Promise<ValidationResponse> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are the final arbiter for the game 'UNSAY'. 
The player transforms a sentence by deleting words.
Original: "${original}"
Result: "${unsayed}"

CRITICAL EVALUATION CRITERIA:
1. isLogical (BOOLEAN):
   - Does the result form a grammatically coherent English phrase or sentence?
   - It MUST have a clear, recognizable structure (e.g., Subject-Verb, or a common idiomatic fragment).
   - REJECT "word salad": even if the words are from the original, if they don't form a logical thought together, isLogical is FALSE.
   - Example 1: "I want to see you" -> "I see you" (TRUE)
   - Example 2: "I want to see you" -> "want see you" (TRUE - imperative/informal)
   - Example 3: "I want to see you" -> "to see you" (TRUE - infinitive phrase)
   - Example 4: "I want to see you" -> "I to you" (FALSE - no logical link)
   - Example 5: "The king is dead" -> "king dead" (TRUE - headline style or poetic)
   - Example 6: "The king is dead" -> "The is" (FALSE - incomplete logic)

2. meaningShift (0-10):
   - 0: No change / exactly same intent.
   - 3: Noticeable change in sentiment or scope (e.g., removing a "not", or an adjective like "bad").
   - 5: Moderate change (removes a key part of the message).
   - 8-10: Complete reversal of truth, irony, or total transformation of intent.

3. feedback (STRING):
   - A short, 1-sentence observation. 
   - If failed, precisely explain why (e.g., "The words don't form a clear thought" or "The meaning hasn't shifted enough").
   - If successful, celebrate the new truth.

STRICTNESS LEVEL: Logical consistency is mandatory, but allow for creative interpretation. If the resulting phrase is a common English construction, isLogical is TRUE.
If "You are not a bad person" becomes "You are a person", that IS a shift (meaningShift should be at least 4-5).
If it becomes "You are bad", that is a shift (meaningShift 8+).

Return ONLY JSON.`,
      config: {
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

    if (!response.text) throw new Error("No response from AI");
    return JSON.parse(response.text) as ValidationResponse;
  } catch (error) {
    console.error("AI Validation Error:", error);
    // Fallback logic
    return {
      isLogical: unsayed.length > 0 && unsayed !== original,
      meaningShift: unsayed !== original ? 5 : 0,
      feedback: "The magic is faint, but the words remain."
    };
  }
}

export async function generateNewSentence(difficulty: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a single pregnant, interesting sentence in English for a game. 
Difficulty: ${difficulty}
The sentence should have around 6-12 words.
Return only the sentence.`,
    });
    return response.text?.trim() || "The stars are shining brightly today.";
  } catch (error) {
    return "Once upon a time in a kingdom far away.";
  }
}

export async function getHint(original: string, requiredRemovals: number): Promise<HintResponse> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a helper for the game 'UNSAY'.
The player must delete exactly ${requiredRemovals} words from this sentence to change its meaning logicaly.
Sentence: "${original}"

Provide:
1. wordToReveal: A single word from the sentence that is a good candidate for deletion to shift the meaning.
2. suggestion: A full example of what the sentence COULD become after deleting ${requiredRemovals} words (it MUST be logical and have a different meaning).

Return ONLY JSON.`,
      config: {
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

    if (!response.text) throw new Error("No hint from AI");
    return JSON.parse(response.text) as HintResponse;
  } catch (error) {
    console.error("Hint Generation Error:", error);
    const words = original.split(' ');
    return {
      wordToReveal: words[0],
      suggestion: words.slice(1).join(' ')
    };
  }
}
