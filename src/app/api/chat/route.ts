import { Pinecone } from "@pinecone-database/pinecone";
import {
  streamText,
  embed,
  generateText,
  type LanguageModelV1,
  smoothStream,
  Message,
} from "ai";
import {
  createGoogleGenerativeAI,
  GoogleGenerativeAIProvider,
} from "@ai-sdk/google";
import summarizeMessages from "@/lib/summarizeMessages";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    if (!messages?.length) throw new Error("No messages provided");

    // logging the latest message
    const latestMessage = messages[messages.length - 1].content;
    console.log("Processing query:", latestMessage);

    // summarize chat history
    let chatHistory = messages;
    // If the conversation is too long, summarize the first N messages
    if (messages.length > 20) {
      const summary = await summarizeMessages(messages.slice(0, -10)); // summarize older ones
      chatHistory = [
        {
          role: "system",
          content: `Summary of earlier conversation: ${summary}`,
        },
        ...messages.slice(-10), // keep latest intact
      ];
    }

    // Setup Google Gemini
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

    // Classify the latest message
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

    // Handle General directly
    if (label === "General") {
      const generalPrompt = `
      Respond naturally to the following casual message in context of the full conversation :
      
      Conversation so far:
      ${chatHistory
        .map((m: Message) => `${m.role.toUpperCase()}: ${m.content}`)
        .join("\n")}
      
      Question: ${latestMessage}
      `;

      const stream = streamText({
        model: model,
        system:
          "You are GURU, a warm and wise yoga master. You are a legendary and wise yoga master who has devoted lifetimes to the study, practice, and teaching of yoga. You possess deep knowledge of all aspects of yoga.",
        prompt: generalPrompt,
        experimental_transform: smoothStream({
          delayInMs: 50, // optional: defaults to 10ms
        }),
        temperature: 0.7,
        maxTokens: 5000,
        maxRetries: 3,
      });

      return new Response(stream.toDataStream(), {
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }

    // Otherwise, process as yoga query using RAG

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
    // log top retrieved matches
    console.log(
      "Top Matches:",
      results.matches.map((m) => ({
        score: m.score,
        text: (m.metadata?.text as string)?.slice(0, 100),
      }))
    );

    // Build prompt from context
    const context = results.matches
      .filter((m) => (m.score ?? 0) > 0.3)
      .filter(
        (m) =>
          typeof m.metadata?.text === "string" && m.metadata.text.length > 50
      )
      .map((m) => m.metadata!.text as string)
      .join("\n---\n");

    const prompt = `
      Answer the question using the knowledge shared below, as naturally as possible. Speak like you're sharing wisdom, not quoting a textbook. If you do not find the answer there, simply say you do not know:

      Relevent Yoga Knowledge:
      ${context}

      Conversation so far:
      ${chatHistory
        .map((m: Message) => `${m.role.toUpperCase()}: ${m.content}`)
        .join("\n")}
        
      Respond to the question in context of the full conversation and the retrieved knowledge:
      
      Question: ${latestMessage}`;

    let stream;
    try {
      stream = streamText({
        model: model,
        system: "You are GURU, a warm and wise yoga master. You are a legendary and wise yoga master who has devoted lifetimes to the study, practice, and teaching of yoga. You possess deep knowledge of all aspects of yoga.",
        prompt: prompt,
        experimental_transform: smoothStream({
          delayInMs: 50, // optional: defaults to 10ms
        }),
        temperature: 0.7,
        maxTokens: 5000,
        maxRetries: 3,
      });
    } catch (err) {
      console.error("Gemini API Timeout or Error:", err);
      return new Response(
        "GURU is meditating right now and cannot respond. Please try again shortly.",
        {
          status: 503,
          headers: { "Content-Type": "text/plain" },
        }
      );
    }

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
