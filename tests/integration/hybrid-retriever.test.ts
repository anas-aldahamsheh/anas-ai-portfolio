import { describe, it, expect, beforeEach } from "vitest";
import { HybridRetriever } from "@/ai/retrieval/hybrid/hybrid-retriever";
import { DenseRetriever } from "@/ai/retrieval/dense/dense-retriever";
import { SparseRetriever } from "@/ai/retrieval/sparse/sparse-retriever";
import { QdrantVectorStore } from "@/lib/qdrant/vector-store";
import { EmbeddingPort } from "@/ai/contracts/ingestion";
import { createProjectScopeFilter } from "@/ai/retrieval/filters/filter-builder";

class MockEmbeddingPort implements EmbeddingPort {
  readonly dimension = 4;
  readonly modelName = "mock-model";

  async embed(texts: string[]): Promise<number[][]> {
    return texts.map((text) => {
      const len = text.length;
      return [len % 2, (len + 1) % 2, 0.5, 0.5];
    });
  }
}

describe("HybridRetriever Integration", () => {
  let store: QdrantVectorStore;
  let hybrid: HybridRetriever;
  const collection = "test_hybrid_retrieval";

  beforeEach(async () => {
    store = new QdrantVectorStore({ forceInMemory: true });
    store.clearInMemoryStore();

    await store.createCollectionIfNotExists(collection, 4);

    await store.upsertPoints(collection, [
      {
        id: "chunk-proj-rag",
        vector: [1, 0, 0.5, 0.5],
        payload: {
          documentId: "doc-rag",
          sourceType: "project",
          sourceId: "proj-rag",
          title: "Autonomous RAG Agent",
          locale: "en",
          citationId: "cit:project:proj-rag:0",
          content:
            "Autonomous multi-agent system utilizing hybrid search, RRF fusion, and Qdrant database.",
          tags: ["rag", "agent"],
        },
      },
      {
        id: "chunk-proj-eval",
        vector: [0, 1, 0.5, 0.5],
        payload: {
          documentId: "doc-eval",
          sourceType: "project",
          sourceId: "proj-eval",
          title: "LLM Evaluation Suite",
          locale: "en",
          citationId: "cit:project:proj-eval:0",
          content:
            "Comprehensive automated evaluation harness measuring hallucination, precision, and recall.",
          tags: ["eval", "metrics"],
        },
      },
      {
        id: "chunk-cv-anas",
        vector: [1, 0, 0.5, 0.5],
        payload: {
          documentId: "doc-cv",
          sourceType: "cv",
          sourceId: "cv-anas",
          title: "Anas Curriculum Vitae",
          locale: "en",
          citationId: "cit:cv:cv-anas:0",
          content:
            "Lead AI Engineer specializing in production hybrid retrieval, embedding models, and Next.js.",
          tags: ["cv"],
        },
      },
      {
        id: "chunk-ar-project",
        vector: [0, 1, 0.5, 0.5],
        payload: {
          documentId: "doc-ar",
          sourceType: "project",
          sourceId: "proj-ar-hub",
          title: "منصة الذكاء الاصطناعي العربية",
          locale: "ar",
          citationId: "cit:project:proj-ar-hub:0",
          content: "بناء أنظمة استرجاع متقدمة تدعم اللغة العربية والتشكيل مع محركات البحث الدلالي.",
          tags: ["ذكاء_اصطناعي", "عربي"],
        },
      },
    ]);

    const denseRetriever = new DenseRetriever({
      embeddingPort: new MockEmbeddingPort(),
      vectorStore: store,
      collectionName: collection,
    });

    const sparseRetriever = new SparseRetriever({
      vectorStore: store,
      collectionName: collection,
    });

    hybrid = new HybridRetriever({
      denseRetriever,
      sparseRetriever,
    });
  });

  it("performs hybrid retrieval combining dense and sparse with RRF fusion and telemetry", async () => {
    // "Autonomous multi-agent" matches chunk-proj-rag both semantically and lexically
    const result = await hybrid.retrieve(
      { text: "Autonomous multi-agent RAG system" },
      {
        denseEnabled: true,
        sparseEnabled: true,
        denseTopK: 5,
        sparseTopK: 5,
        rrfK: 60,
      },
    );

    expect(result.candidates.length).toBeGreaterThan(0);
    expect(result.candidates[0]?.id).toBe("chunk-proj-rag");
    expect(result.candidates[0]?.retrieverType).toBe("hybrid");
    expect(result.candidates[0]?.rank).toBe(1);

    // Verify telemetry
    expect(result.telemetry.denseCandidateCount).toBeGreaterThan(0);
    expect(result.telemetry.sparseCandidateCount).toBeGreaterThan(0);
    expect(result.telemetry.fusedCandidateCount).toBe(result.candidates.length);
    expect(result.telemetry.totalLatencyMs).toBeGreaterThanOrEqual(0);
  });

  it("applies project scope filter correctly", async () => {
    const projectFilter = createProjectScopeFilter("proj-eval", "en");

    const result = await hybrid.retrieve(
      {
        text: "LLM evaluation harness precision",
        filter: projectFilter,
      },
      {
        denseTopK: 5,
        sparseTopK: 5,
      },
    );

    expect(result.candidates.length).toBe(1);
    expect(result.candidates[0]?.id).toBe("chunk-proj-eval");
    expect(result.candidates[0]?.sourceId).toBe("proj-eval");
    expect(result.candidates[0]?.sourceType).toBe("project");
  });

  it("allows dense-only or sparse-only retrieval modes", async () => {
    const denseOnly = await hybrid.retrieve(
      { text: "Autonomous multi-agent" },
      {
        denseEnabled: true,
        sparseEnabled: false,
      },
    );

    expect(denseOnly.telemetry.sparseCandidateCount).toBe(0);
    expect(denseOnly.telemetry.denseCandidateCount).toBeGreaterThan(0);
    expect(denseOnly.candidates[0]?.retrieverType).toBe("dense");

    const sparseOnly = await hybrid.retrieve(
      { text: "Autonomous multi-agent" },
      {
        denseEnabled: false,
        sparseEnabled: true,
      },
    );

    expect(sparseOnly.telemetry.denseCandidateCount).toBe(0);
    expect(sparseOnly.telemetry.sparseCandidateCount).toBeGreaterThan(0);
    expect(sparseOnly.candidates[0]?.retrieverType).toBe("sparse");
  });
});
