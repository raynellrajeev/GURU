import {
  generateText,
  type LanguageModelV1,
  Message,
} from "ai";
import {
  createGoogleGenerativeAI,
  GoogleGenerativeAIProvider,
} from "@ai-sdk/google";

//function to summarize past messages
export default async function summarizeMessages(messages: Message[]) {
  const google: GoogleGenerativeAIProvider = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY!,
    baseURL: "https://generativelanguage.googleapis.com/v1beta",
  });
  const model: LanguageModelV1 = google("gemini-1.5-flash", {
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_LOW_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_LOW_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_LOW_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_LOW_AND_ABOVE",
      },
    ],
  });
  const prompt = `Summarize the following conversation briefly, preserving important context:\n\n${messages
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n")}`;

  const result = await generateText({
    model: model,
    prompt,
  });

  return result.text;
}
