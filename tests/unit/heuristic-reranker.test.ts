import { describe, it, expect } from "vitest";
import { HeuristicReranker } from "@/ai/reranker/heuristic-reranker";
import { ScoredCandidate } from "@/ai/contracts/retrieval";

describe("HeuristicReranker (F027)", () => {
  const reranker = new HeuristicReranker();

  const mockCandidates: ScoredCandidate[] = [
    {
      id: "chunk-1",
      documentId: "doc-1",
      citationId: "cite-1",
      content: "Anas built a high-throughput vector search pipeline using Qdrant and Docker.",
      score: 0.6,
      sourceType: "project",
      sourceId: "proj-1",
      title: "Vector Search System",
      locale: "en",
      headingHierarchy: ["Architecture", "Storage"],
      tags: ["qdrant", "vector"],
      retrieverType: "hybrid",
      rank: 1,
    },
    {
      id: "chunk-2",
      documentId: "doc-2",
      citationId: "cite-2",
      content: "Frontend user interface implemented in Next.js with Tailwind and motion tokens.",
      score: 0.7,
      sourceType: "project",
      sourceId: "proj-2",
      title: "Portfolio Website",
      locale: "en",
      headingHierarchy: ["Frontend"],
      tags: ["nextjs", "css"],
      retrieverType: "hybrid",
      rank: 2,
    },
    {
      id: "chunk-3",
      documentId: "doc-3",
      citationId: "cite-3",
      content: "قام أنس بتطوير نظام استرجاع هجين يدعم محرك Qdrant وخوارزميات BM25 باللغة العربية.",
      score: 0.65,
      sourceType: "project",
      sourceId: "proj-3",
      title: "محرك البحث الهجين",
      locale: "ar",
      headingHierarchy: ["الاسترجاع الهجين"],
      tags: ["qdrant", "bm25"],
      retrieverType: "hybrid",
      rank: 3,
    },
  ];

  it("handles empty candidate arrays gracefully", () => {
    const result = reranker.rerank("any query", []);
    expect(result.candidates).toEqual([]);
    expect(result.telemetry.inputCandidateCount).toBe(0);
    expect(result.telemetry.outputCandidateCount).toBe(0);
    expect(result.telemetry.fallbackApplied).toBe(true);
  });

  it("promotes candidate with higher query token overlap and heading match in English", () => {
    const result = reranker.rerank("Qdrant vector search architecture", mockCandidates);

    expect(result.candidates.length).toBeGreaterThan(0);
    // chunk-1 has Qdrant, vector, search, architecture
    expect(result.candidates[0]?.id).toBe("chunk-1");
    expect(result.candidates[0]?.rerankScore).toBeGreaterThan(0.5);
    expect(result.candidates[0]?.rerankRank).toBe(1);
    expect(result.candidates[0]?.previousRank).toBe(1);
  });

  it("promotes candidate with Arabic keywords and matching Arabic title/heading", () => {
    const result = reranker.rerank("محرك بحث هجين وخوارزمية Qdrant", mockCandidates);

    expect(result.candidates.length).toBeGreaterThan(0);
    // chunk-3 matches Arabic search terms and Qdrant
    expect(result.candidates[0]?.id).toBe("chunk-3");
    expect(result.candidates[0]?.locale).toBe("ar");
  });

  it("enforces topN truncation strictly", () => {
    const result = reranker.rerank("pipeline", mockCandidates, { topN: 2 });
    expect(result.candidates.length).toBeLessThanOrEqual(2);
  });

  it("filters out candidates below minThreshold", () => {
    // Very high threshold that only very strong matches can pass
    const result = reranker.rerank("unrelated quantum computing theory", mockCandidates, {
      minThreshold: 0.85,
    });

    expect(result.candidates.length).toBe(0);
  });

  it("produces comprehensive telemetry", () => {
    const result = reranker.rerank("Qdrant pipeline", mockCandidates);

    expect(result.telemetry.strategy).toBe("lexical_calibrated");
    expect(result.telemetry.inputCandidateCount).toBe(3);
    expect(result.telemetry.outputCandidateCount).toBe(result.candidates.length);
    expect(result.telemetry.latencyMs).toBeGreaterThanOrEqual(0);
    expect(typeof result.telemetry.topScore).toBe("number");
  });
});
