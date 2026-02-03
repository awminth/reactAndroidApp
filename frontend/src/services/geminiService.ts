import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize the Gemini Client
// The API key must be obtained from VITE_GEMINI_API_KEY
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.error("VITE_GEMINI_API_KEY is not set!");
}
const ai = new GoogleGenAI({ apiKey: apiKey || "dummy-key-to-prevent-crash" });

export const sendMessageToGemini = async (
  prompt: string,
  history: { role: string; parts: { text: string }[] }[] = []
): Promise<string> => {
  try {
    const modelId = 'gemini-3-flash-preview';
    
    // Construct the chat session
    // We only use the last few messages to keep context window manageable for this demo
    // but in production, you might manage full history.
    const chat = ai.chats.create({
      model: modelId,
      history: history.length > 0 ? history : undefined,
      config: {
        systemInstruction: "You are Nebula, a helpful, concise, and intelligent AI assistant. Keep responses brief and formatted nicely for mobile reading.",
      }
    });

    const result: GenerateContentResponse = await chat.sendMessage({ message: prompt });
    
    return result.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to communicate with Nebula.");
  }
};