import { describe, it, expect, beforeEach } from "vitest";
import { DenseRetriever } from "@/ai/retrieval/dense/dense-retriever";
import { QdrantVectorStore } from "@/lib/qdrant/vector-store";
import { EmbeddingPort } from "@/ai/contracts/ingestion";

class MockEmbeddingPort implements EmbeddingPort {
  readonly dimension = 4;
  readonly modelName = "mock-model";

  async embed(texts: string[]): Promise<number[][]> {
    return texts.map((text) => {
      // Deterministic 4-dim unit vector based on text length
      const len = text.length;
      return [len % 2, (len + 1) % 2, 0.5, 0.5];
    });
  }
}

describe("DenseRetriever", () => {
  let store: QdrantVectorStore;
  let retriever: DenseRetriever;
  const collection = "test_dense_retrieval";

  beforeEach(async () => {
    store = new QdrantVectorStore({ forceInMemory: true });
    store.clearInMemoryStore();

    await store.createCollectionIfNotExists(collection, 4);

    // Seed test vector points
    await store.upsertPoints(collection, [
      {
        id: "pt-1",
        vector: [1, 0, 0.5, 0.5],
        payload: {
          documentId: "doc-1",
          sourceType: "project",
          sourceId: "proj-1",
          title: "AI Chatbot",
          locale: "en",
          citationId: "cit:project:proj-1:0",
          content: "Intelligent chatbot with Qdrant retrieval",
          headingHierarchy: ["Overview"],
          tags: ["ai", "chatbot"],
        },
      },
      {
        id: "pt-2",
        vector: [0, 1, 0.5, 0.5],
        payload: {
          documentId: "doc-2",
          sourceType: "project",
          sourceId: "proj-2",
          title: "مشروع وكيل الذكاء الاصطناعي",
          locale: "ar",
          citationId: "cit:project:proj-2:0",
          content: "بناء وكيل ذكي متعدد المهام",
          headingHierarchy: ["نبذة"],
          tags: ["ذكاء_اصطناعي"],
        },
      },
    ]);

    retriever = new DenseRetriever({
      embeddingPort: new MockEmbeddingPort(),
      vectorStore: store,
      collectionName: collection,
    });
  });

  it("retrieves and ranks dense candidates based on cosine similarity", async () => {
    // "AI Chat" has length 7 -> [7%2, 8%2, 0.5, 0.5] = [1, 0, 0.5, 0.5] which matches pt-1 exactly!
    const results = await retriever.retrieve({ text: "AI Chat" }, { topK: 5 });

    expect(results.length).toBe(2);
    expect(results[0]?.id).toBe("pt-1");
    expect(results[0]?.title).toBe("AI Chatbot");
    expect(results[0]?.retrieverType).toBe("dense");
    expect(results[0]?.score).toBeGreaterThan(0.9);
    expect(results[0]?.citationId).toBe("cit:project:proj-1:0");
    expect(results[0]?.denseRank).toBe(1);
  });

  it("filters candidates by metadata", async () => {
    const results = await retriever.retrieve({
      text: "AI Chat",
      filter: { locale: "ar" },
    });

    expect(results.length).toBe(1);
    expect(results[0]?.id).toBe("pt-2");
    expect(results[0]?.locale).toBe("ar");
  });

  it("returns empty array for empty or blank query", async () => {
    const emptyRes = await retriever.retrieve({ text: "" });
    const blankRes = await retriever.retrieve({ text: "   \n\t  " });

    expect(emptyRes).toEqual([]);
    expect(blankRes).toEqual([]);
  });

  it("handles embedding error gracefully without crashing", async () => {
    const failingRetriever = new DenseRetriever({
      embeddingPort: {
        dimension: 4,
        modelName: "failing",
        embed: async () => {
          throw new Error("API rate limit exceeded");
        },
      },
      vectorStore: store,
      collectionName: collection,
    });

    const results = await failingRetriever.retrieve({ text: "test query" });
    expect(results).toEqual([]);
  });
});
