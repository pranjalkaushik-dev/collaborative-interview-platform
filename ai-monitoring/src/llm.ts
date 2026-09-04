import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in .env");
}

export const llm = new ChatGoogleGenerativeAI({
  apiKey,
  model: "gemini-3.5-flash-lite",
  temperature: 0.2,
});