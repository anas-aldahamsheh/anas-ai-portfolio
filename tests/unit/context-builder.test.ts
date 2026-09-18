import { describe, it, expect } from "vitest";
import { ContextBuilder } from "@/ai/context/context-builder";
import { ContextInputCandidate } from "@/ai/contracts/context-builder";

describe("ContextBuilder Service (F028)", () => {
  const builder = new ContextBuilder();

  const mockCandidates: ContextInputCandidate[] = [
    {
      id: "chunk-1",
      documentId: "doc-1",
      citationId: "cite-1",
      content: "Anas developed a hybrid RAG system using Qdrant vector database and BM25.",
      score: 0.7,
      rerankScore: 0.95,
      sourceType: "project",
      sourceId: "proj-rag",
      title: "RAG System",
      locale: "en",
      headingHierarchy: ["Overview"],
      tags: ["rag"],
      retrieverType: "hybrid",
    },
    {
      id: "chunk-2",
      documentId: "doc-1",
      citationId: "cite-2",
      content: "Detailed benchmarks show 45ms end-to-end retrieval latency in production.",
      score: 0.65,
      rerankScore: 0.9,
      sourceType: "project",
      sourceId: "proj-rag",
      title: "RAG System",
      locale: "en",
      headingHierarchy: ["Benchmarks"],
      tags: ["latency"],
      retrieverType: "hybrid",
    },
    {
      id: "chunk-3",
      documentId: "doc-1",
      citationId: "cite-3",
      content: "Third chunk from the same project to test per-source capping threshold.",
      score: 0.6,
      rerankScore: 0.85,
      sourceType: "project",
      sourceId: "proj-rag",
      title: "RAG System",
      locale: "en",
      headingHierarchy: ["Details"],
      tags: ["rag"],
      retrieverType: "hybrid",
    },
    {
      id: "chunk-4",
      documentId: "doc-2",
      citationId: "cite-4",
      content: "CV Overview: Anas has 6+ years of software and AI engineering experience.",
      score: 0.8,
      rerankScore: 0.88,
      sourceType: "cv",
      sourceId: "cv-v1",
      title: "Curriculum Vitae",
      locale: "en",
      headingHierarchy: ["Summary"],
      tags: ["cv"],
      retrieverType: "hybrid",
    },
    {
      id: "chunk-5",
      documentId: "doc-1",
      citationId: "cite-5",
      content: "Anas developed a hybrid RAG system using Qdrant vector database and BM25.", // Exact duplicate of chunk-1
      score: 0.75,
      rerankScore: 0.94,
      sourceType: "project",
      sourceId: "proj-rag-dup",
      title: "Duplicate RAG",
      locale: "en",
      headingHierarchy: ["Overview"],
      tags: ["rag"],
      retrieverType: "hybrid",
    },
  ];

  it("handles empty candidate arrays gracefully", async () => {
    const result = await builder.buildContext([]);
    expect(result.chunks).toEqual([]);
    expect(result.availableCitations).toEqual([]);
    expect(result.telemetry.selectedChunksCount).toBe(0);
    expect(result.formattedContext).toContain("No matching reference documents");
  });

  it("prioritizes candidates by rerankScore over raw score", async () => {
    const result = await builder.buildContext(mockCandidates, {
      maxChunks: 5,
      perSourceCap: 5,
      deduplicate: false,
    });

    expect(result.chunks.length).toBeGreaterThan(0);
    // Highest rerankScore is chunk-1 (0.95), second is chunk-5 (0.94)
    expect(result.chunks[0]?.id).toBe("chunk-1");
    expect(result.chunks[0]?.rerankScore).toBe(0.95);
  });

  it("enforces perSourceCap strictly", async () => {
    const result = await builder.buildContext(mockCandidates, {
      perSourceCap: 1,
      deduplicate: false,
    });

    // proj-rag has chunks 1, 2, 3. With perSourceCap: 1, only 1 chunk from proj-rag should be accepted
    const projRagChunks = result.chunks.filter((c) => c.sourceId === "proj-rag");
    expect(projRagChunks.length).toBe(1);
    expect(result.telemetry.perSourceCappedCount).toBeGreaterThan(0);
  });

  it("deduplicates identical and near-duplicate chunks", async () => {
    const result = await builder.buildContext(mockCandidates, {
      deduplicate: true,
      perSourceCap: 5,
    });

    // chunk-5 is identical in content to chunk-1, should be deduplicated
    const chunk5Included = result.chunks.some((c) => c.id === "chunk-5");
    expect(chunk5Included).toBe(false);
    expect(result.telemetry.deduplicatedCount).toBeGreaterThan(0);
  });

  it("respects maxTokens budget constraint and stops packing when exceeded", async () => {
    // Tiny token budget of 25 tokens can only fit 1 chunk
    const result = await builder.buildContext(mockCandidates, {
      maxTokens: 25,
      deduplicate: false,
      perSourceCap: 5,
    });

    expect(result.chunks.length).toBe(1);
    expect(result.telemetry.budgetExceededCount).toBeGreaterThan(0);
    expect(result.telemetry.totalEstimatedTokens).toBeLessThanOrEqual(25);
  });

  it("emits complete citation references matching accepted chunks", async () => {
    const result = await builder.buildContext(mockCandidates, {
      maxChunks: 3,
    });

    expect(result.availableCitations.length).toBe(result.chunks.length);
    for (let i = 0; i < result.chunks.length; i++) {
      expect(result.availableCitations[i]?.citationId).toBe(result.chunks[i]?.citationId);
      expect(result.availableCitations[i]?.sourceId).toBe(result.chunks[i]?.sourceId);
    }
  });
});
