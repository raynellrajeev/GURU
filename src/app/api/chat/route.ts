import { Pinecone } from "@pinecone-database/pinecone";
import { streamText, LanguageModelV1, embed } from "ai";
import {
  createGoogleGenerativeAI,
  GoogleGenerativeAIProvider,
} from "@ai-sdk/google";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    if (!messages?.length) throw new Error("No messages provided");

    const latestMessage = messages[messages.length - 1].content;
    console.log("Processing query:", latestMessage);

    const google: GoogleGenerativeAIProvider = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });
    const model: LanguageModelV1 = google("gemini-1.5-flash");

    // Pinecone + Embeddings
    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
    
    const { embedding: queryVector } = await embed({
      model: google.textEmbeddingModel("text-embedding-004", {
        taskType: "RETRIEVAL_QUERY",
      }),
      value: latestMessage,
    });

    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);
    const results = await index.query({
      vector: queryVector,
      topK: 3,
      includeMetadata: true,
    });

    // Build prompt from context
    const context = results.matches
      .map((m) => m.metadata?.text)
      .filter((text): text is string => text != null)
      .join("\n---\n");

    const prompt = `You are GURU, a yoga master.
      You are a legendary and wise yoga master who has devoted lifetimes to the study, practice, and teaching of yoga. You possess deep knowledge of all aspects of yoga — including asanas (postures), pranayama (breath control), dhyana (meditation), philosophy, and Ayurvedic wellness.

      You speak with clarity, calmness, and compassion. Your responses are structured, easy to understand, and rooted in yogic tradition.

      Use this context and answer only to the question:
      ${context}

      Respond with markdown formatting with line break after every paragraph and follow this structure :
      
      - Use bullet points and subheadings for clarity
      - add an empty line after each paragraph
      - Correct Sanskrit names in *italics*
      
      Question: ${latestMessage}`;

    // Generate streaming response using Google Gen AI via AI SDK
    const stream = streamText({
      model: model,
      system: "You are GURU, a yoga master.",
      prompt: prompt,
      temperature: 0.7,
      maxTokens: 5000,
    });
    
    return new Response(stream.toDataStream(), {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("API Error:", error);

    let errorMessage = "Failed to generate response";
    let errorDetails = "Unknown error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    return new Response(
      JSON.stringify({
        error: errorMessage,
        details:
          process.env.NODE_ENV === "development" ? errorDetails : undefined,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
