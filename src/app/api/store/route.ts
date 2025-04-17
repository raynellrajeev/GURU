import { Pinecone } from "@pinecone-database/pinecone";
import { pipeline } from "@xenova/transformers";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
      {
        quantized: true,
      }
    );
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

    const embeddings = await Promise.all(
      yogaContent.map(async (doc) => {
        const output = await embedder(doc.pageContent, {
          pooling: "mean",
          normalize: true,
        });
        return Array.from(output.data);
      })
    );

    const vectors = yogaContent.map((doc, idx) => ({
      id: `vec-${Date.now()}-${idx}`,
      values: embeddings[idx],
      metadata: {
        text: doc.pageContent,
        source: "yoga_guide.pdf",
        chunk: idx,
      },
    }));

    await pinecone.Index(process.env.PINECONE_INDEX_NAME!).upsert(vectors);

    return NextResponse.json({
      success: true,
      chunks: docs.length,
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
