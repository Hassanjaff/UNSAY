import { ValidationResponse, HintResponse } from "../types";

export async function validateUnsay(original: string, unsayed: string): Promise<ValidationResponse> {
  try {
    const response = await fetch("/api/ai/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ original, unsayed }),
    });
    
    if (!response.ok) throw new Error("API error");
    return await response.json();
  } catch (error) {
    console.error("AI Validation Error:", error);
    // Be conservative in fallback: don't let broken phrases pass easily
    return {
      isLogical: false,
      meaningShift: 0, 
      feedback: "The Oracle was distracted by a linguistic anomaly. Try again."
    };
  }
}

export async function generateNewSentence(difficulty: string): Promise<string> {
  try {
    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ difficulty }),
    });

    if (!response.ok) throw new Error("API error");
    const data = await response.json();
    return data.text || "The stars are shining brightly today.";
  } catch (error) {
    return "Once upon a time in a kingdom far away.";
  }
}

export async function getHint(original: string, requiredRemovals: number): Promise<HintResponse> {
  try {
    const response = await fetch("/api/ai/hint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ original, requiredRemovals }),
    });

    if (!response.ok) throw new Error("API error");
    return await response.json();
  } catch (error) {
    console.error("Hint Generation Error:", error);
    const words = original.split(' ');
    return {
      wordToReveal: words[0],
      suggestion: words.slice(1).join(' ')
    };
  }
}
