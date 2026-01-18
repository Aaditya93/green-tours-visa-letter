import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!API_KEY) {
  throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not defined");
}

export const genAI = new GoogleGenerativeAI(API_KEY);
export const fileManager = new GoogleAIFileManager(API_KEY);
export const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
