import { Pinecone } from "@pinecone-database/pinecone";
import { streamText, embed, generateText, LanguageModelV1 } from "ai";
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

    // Setup Google Gemini
    const google: GoogleGenerativeAIProvider = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });
    const model: LanguageModelV1 = google("gemini-1.5-flash");

    // Classify the message 
    const classificationPrompt = `
      Classify the user message into one of these categories:
      - General: For greetings, small talk, or generic conversation.
      - YOGA_QUERY: For questions specifically related to yoga, asanas, mudras, breathing, etc.

      Only respond with the label: General or YOGA_QUERY.

      User Message: "${latestMessage}"
`;

    const classificationResult = await generateText({
      model: model,
      prompt: classificationPrompt,
      temperature: 0,
      maxTokens: 10,
    });

    const label = classificationResult.text.trim().toUpperCase();
    console.log("Message classified as:", label);

    // Step 2: Handle General directly
    if (label === "General") {
      const chitchatPrompt = `You are GURU, a warm and wise yoga master.
        Respond naturally to the following casual message:
        "${latestMessage}"`;

      const stream = streamText({
        model: model,
        system: "You are GURU, a yoga master.",
        prompt: chitchatPrompt,
        temperature: 0.8,
        maxTokens: 1000,
      });

      return new Response(stream.toDataStream(), {
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }

    // Step 3: Otherwise, process as yoga query using RAG

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
      .filter((m) => (m.score ?? 0) > 0.75)
      .filter(
        (m) =>
          typeof m.metadata?.text === "string" && m.metadata.text.length > 50
      )
      .map((m) => m.metadata!.text as string)
      .join("\n---\n");


    const prompt = `You are GURU, a yoga master.
      You are a legendary and wise yoga master who has devoted lifetimes to the study, practice, and teaching of yoga. You possess deep knowledge of all aspects of yoga — including asanas (postures), pranayama (breath control), dhyana (meditation), philosophy, and Ayurvedic wellness.

      Use this context and ONLY answer based on the provided context:
      ${context}

      Question: ${latestMessage}`;

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
