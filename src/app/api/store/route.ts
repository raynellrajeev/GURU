import { Pinecone } from "@pinecone-database/pinecone";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { NextResponse } from "next/server";
import { embed } from "ai";
import { google } from "@ai-sdk/google";

export const runtime = "edge";
const BATCH_SIZE = 10;

export async function POST(request: Request) {
  try {
    // Initialize Pinecone
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });

    // Load and pre-process the book
    const loader = new PDFLoader("public/documents/yoga_guide.pdf");
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const docs = await splitter.splitDocuments(await loader.load());
    const yogaContent = docs.filter(
      (doc) =>
        !doc.pageContent.toLowerCase().includes("copyright") &&
        !doc.pageContent.toLowerCase().includes("all rights reserved")
    );

    // Batch processing
    const vectors = [];
    for (let i = 0; i < yogaContent.length; i += BATCH_SIZE) {
      const batch = yogaContent.slice(i, i + BATCH_SIZE);

      // Generate embeddings in parallel
      const batchEmbeddings = await Promise.all(
        batch.map(async (doc, idx) => {
          const { embedding } = await embed({
            model: google.textEmbeddingModel("text-embedding-004", {
              taskType: "RETRIEVAL_DOCUMENT",
            }),
            value: doc.pageContent,
          });
          //return object
          return {
            id: `vec-${Date.now()}-${i}-${idx}`,
            values: embedding,
            metadata: {
              text: doc.pageContent,
              source: "yoga_guide.pdf",
              chunk: i + idx,
              page: doc.metadata.loc?.pageNumber || 0,
            },
          };
        })
      );

      vectors.push(...batchEmbeddings);
      console.log(`Processed batch ${i / BATCH_SIZE + 1}`);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Rate limiting
    }

    // Upsert to Pinecone in batches
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
