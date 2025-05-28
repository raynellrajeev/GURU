import { Pinecone } from "@pinecone-database/pinecone";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { NextResponse } from "next/server";
import { embedMany } from "ai";
import {
  createGoogleGenerativeAI,
  GoogleGenerativeAIProvider,
} from "@ai-sdk/google";

export const runtime = "nodejs";
const BATCH_SIZE = 10;

export async function POST(request: Request) {
  try {
    // Initialize Pinecone
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });

    //initialise google gen ai
    const google: GoogleGenerativeAIProvider = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });

    // Load and split the document
    const loader = new PDFLoader("public/documents/yoga_guide.pdf");
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const yogaContent = await splitter.splitDocuments(await loader.load());

    // Filter unwanted chunks
    // const yogaContent = docs.filter(
    //   (doc) =>
    //     !doc.pageContent.toLowerCase().includes("table of contents") &&
    //     !doc.pageContent.toLowerCase().includes("copyright")
    // );

    const vectors = [];

    // Batch embedding using embedMany
    for (let i = 0; i < yogaContent.length; i += BATCH_SIZE) {
      const batch = yogaContent.slice(i, i + BATCH_SIZE);
      const texts = batch.map((doc) => doc.pageContent);

      const { embeddings } = await embedMany({
        model: google.textEmbeddingModel("text-embedding-004", {
          taskType: "RETRIEVAL_DOCUMENT",
        }),
        values: texts,
      });

      const batchEmbeddings = embeddings.map((embedding, idx) => ({
        id: `vec-${Date.now()}-${i}-${idx}`,
        values: embedding,
        metadata: {
          text: batch[idx].pageContent,
          source: "yoga_guide.pdf",
          chunk: i + idx,
          page: batch[idx].metadata.loc?.pageNumber || 0,
        },
      }));

      vectors.push(...batchEmbeddings);
      console.log(`Processed batch ${i / BATCH_SIZE + 1}`);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Avoid rate limit
    }

    // Upsert vectors into Pinecone
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);
    for (let i = 0; i < vectors.length; i += 100) {
      await index.upsert(vectors.slice(i, i + 100));
    }

    return NextResponse.json({
      success: true,
      chunks: yogaContent.length,
      vectors: vectors.length,
    });
  } catch (error) {
    console.error("Ingestion error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Ingestion failed" },
      { status: 500 }
    );
  }
}
