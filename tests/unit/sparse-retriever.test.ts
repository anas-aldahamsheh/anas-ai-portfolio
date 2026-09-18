import { describe, it, expect, beforeEach } from "vitest";
import { SparseRetriever } from "@/ai/retrieval/sparse/sparse-retriever";
import { QdrantVectorStore } from "@/lib/qdrant/vector-store";

describe("SparseRetriever (BM25)", () => {
  let store: QdrantVectorStore;
  let retriever: SparseRetriever;
  const collection = "test_sparse_retrieval";

  beforeEach(async () => {
    store = new QdrantVectorStore({ forceInMemory: true });
    store.clearInMemoryStore();

    await store.createCollectionIfNotExists(collection, 4);

    await store.upsertPoints(collection, [
      {
        id: "chunk-en-1",
        vector: [0, 0, 0, 0],
        payload: {
          documentId: "doc-1",
          sourceType: "project",
          sourceId: "proj-1",
          title: "Next.js AI Portfolio",
          locale: "en",
          citationId: "cit:project:proj-1:0",
          content:
            "Built high-performance full-stack web application with Next.js and Qdrant vector database.",
          tags: ["nextjs", "qdrant"],
        },
      },
      {
        id: "chunk-en-2",
        vector: [0, 0, 0, 0],
        payload: {
          documentId: "doc-2",
          sourceType: "cv",
          sourceId: "cv-anas",
          title: "Anas Resume Experience",
          locale: "en",
          citationId: "cit:cv:cv-anas:0",
          content:
            "Senior AI Engineer specializing in LLM evaluation, RAG pipelines, and cloud systems.",
          tags: ["resume", "experience"],
        },
      },
      {
        id: "chunk-ar-1",
        vector: [0, 0, 0, 0],
        payload: {
          documentId: "doc-3",
          sourceType: "project",
          sourceId: "proj-ar-1",
          title: "منصة التحليل الذكي للوظائف",
          locale: "ar",
          citationId: "cit:project:proj-ar-1:0",
          content:
            "تطبيق ذكي لتحليل متطلبات الوظائف وربطها بالخبرات البرمجية المعتمدة باستخدام نماذج الذكاء الاصطناعي.",
          tags: ["وظائف", "ذكاء_اصطناعي"],
        },
      },
    ]);

    retriever = new SparseRetriever({
      vectorStore: store,
      collectionName: collection,
    });
  });

  it("retrieves and scores relevant English chunks via BM25", async () => {
    const results = await retriever.retrieve({ text: "Qdrant vector database" });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.id).toBe("chunk-en-1");
    expect(results[0]?.retrieverType).toBe("sparse");
    expect(results[0]?.score).toBeGreaterThan(0);
    expect(results[0]?.sparseRank).toBe(1);
  });

  it("retrieves and scores relevant Arabic chunks with diacritics and letter normalization", async () => {
    // Query with tatweel and tashkeel: "مَشْــرُوعُ الذَّكَــاءِ"
    const results = await retriever.retrieve({ text: "تطبيق ذكي لتحليل متطلبات الوظائف" });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.id).toBe("chunk-ar-1");
    expect(results[0]?.locale).toBe("ar");
    expect(results[0]?.score).toBeGreaterThan(0);
  });

  it("applies metadata filters strictly", async () => {
    // Both chunk-en-1 and chunk-en-2 are English, but one is "project" and one is "cv"
    const results = await retriever.retrieve({
      text: "AI Engineer and systems",
      filter: { sourceType: "cv" },
    });

    expect(results.length).toBe(1);
    expect(results[0]?.id).toBe("chunk-en-2");
    expect(results[0]?.sourceType).toBe("cv");
  });

  it("returns empty array when query does not match any terms or is blank", async () => {
    const noMatch = await retriever.retrieve({ text: "completely unrelated terms xyz123" });
    const emptyQuery = await retriever.retrieve({ text: "" });

    expect(noMatch).toEqual([]);
    expect(emptyQuery).toEqual([]);
  });
});
