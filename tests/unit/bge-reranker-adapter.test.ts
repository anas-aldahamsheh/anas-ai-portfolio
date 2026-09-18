import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { BgeRerankerAdapter, calibrateRerankScore } from "@/ai/reranker/bge-reranker-adapter";
import { ScoredCandidate } from "@/ai/contracts/retrieval";

describe("BgeRerankerAdapter (F027)", () => {
  const mockCandidates: ScoredCandidate[] = [
    {
      id: "chunk-a",
      documentId: "doc-a",
      citationId: "cite-a",
      content: "Anas implemented modular RAG with hybrid search and reranking.",
      score: 0.5,
      sourceType: "project",
      sourceId: "proj-a",
      title: "RAG System",
      locale: "en",
      headingHierarchy: ["AI Architecture"],
      tags: ["rag", "ai"],
      retrieverType: "hybrid",
      rank: 1,
    },
    {
      id: "chunk-b",
      documentId: "doc-b",
      citationId: "cite-b",
      content: "Next.js dynamic routes with React Server Components.",
      score: 0.6,
      sourceType: "project",
      sourceId: "proj-b",
      title: "Web Architecture",
      locale: "en",
      headingHierarchy: ["Frontend"],
      tags: ["nextjs"],
      retrieverType: "hybrid",
      rank: 2,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Score Calibration", () => {
    it("calibrates logits via sigmoid accurately", () => {
      expect(calibrateRerankScore(0, "sigmoid")).toBe(0.5);
      expect(calibrateRerankScore(2.0, "sigmoid")).toBeCloseTo(0.8808, 2);
      expect(calibrateRerankScore(-2.0, "sigmoid")).toBeCloseTo(0.1192, 2);
    });

    it("supports raw and min_max calibration methods", () => {
      expect(calibrateRerankScore(3.5, "raw")).toBe(3.5);
      expect(calibrateRerankScore(-1.5, "min_max")).toBe(0.0);
      expect(calibrateRerankScore(1.5, "min_max")).toBe(1.0);
    });
  });

  describe("Reranking Flow & Response Formats", () => {
    it("handles empty candidate arrays without making network calls", async () => {
      const adapter = new BgeRerankerAdapter({
        endpointUrl: "https://reranker.internal/rerank",
        preferOfflineFallback: false,
      });

      const result = await adapter.rerank("query", []);
      expect(result.candidates).toEqual([]);
      expect(result.telemetry.outputCandidateCount).toBe(0);
      expect(result.telemetry.fallbackApplied).toBe(false);
    });

    it("parses standard TEI response payload and calibrates scores", async () => {
      const originalFetch = global.fetch;
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { index: 0, score: 3.2 },
          { index: 1, score: -1.5 },
        ],
      } as Response);

      const adapter = new BgeRerankerAdapter({
        endpointUrl: "https://reranker.internal/rerank",
        preferOfflineFallback: false,
      });

      const result = await adapter.rerank("modular RAG pipeline", mockCandidates);

      global.fetch = originalFetch;

      expect(result.candidates.length).toBe(2);
      // chunk-a has score 3.2 (sigmoid ~0.9608), chunk-b has -1.5 (sigmoid ~0.1824)
      expect(result.candidates[0]?.id).toBe("chunk-a");
      expect(result.candidates[0]?.rerankScore).toBeGreaterThan(0.9);
      expect(result.candidates[1]?.id).toBe("chunk-b");
      expect(result.candidates[1]?.rerankScore).toBeLessThan(0.3);
      expect(result.telemetry.fallbackApplied).toBe(false);
      expect(result.telemetry.strategy).toBe("bge_remote");
    });

    it("parses Cohere/OpenAI-compatible results structure", async () => {
      const originalFetch = global.fetch;
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            { index: 1, relevance_score: 2.8 },
            { index: 0, relevance_score: 0.5 },
          ],
        }),
      } as Response);

      const adapter = new BgeRerankerAdapter({
        endpointUrl: "https://api.rerank.internal/v1/rerank",
        preferOfflineFallback: false,
      });

      const result = await adapter.rerank("dynamic routes", mockCandidates);

      global.fetch = originalFetch;

      expect(result.candidates.length).toBe(2);
      // Candidate index 1 (chunk-b) scored 2.8, so it should rank first
      expect(result.candidates[0]?.id).toBe("chunk-b");
      expect(result.candidates[0]?.rerankRank).toBe(1);
      expect(result.candidates[0]?.previousRank).toBe(2);
    });

    it("parses raw number array response format", async () => {
      const originalFetch = global.fetch;
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => [4.1, 0.2],
      } as Response);

      const adapter = new BgeRerankerAdapter({
        endpointUrl: "https://hf-model.internal/rerank",
        preferOfflineFallback: false,
      });

      const result = await adapter.rerank("hybrid search", mockCandidates);

      global.fetch = originalFetch;

      expect(result.candidates.length).toBe(2);
      expect(result.candidates[0]?.id).toBe("chunk-a");
    });
  });

  describe("Failure Modes and Fallbacks", () => {
    it("falls back to heuristic ordering when remote inference fails under degrade_to_fused_ordering policy", async () => {
      const originalFetch = global.fetch;
      global.fetch = vi.fn().mockRejectedValue(new Error("Connection refused"));

      const adapter = new BgeRerankerAdapter({
        endpointUrl: "https://unreachable.reranker.internal/rerank",
        preferOfflineFallback: false,
        maxRetries: 0,
        defaultFallbackPolicy: "degrade_to_fused_ordering",
      });

      const result = await adapter.rerank("modular RAG", mockCandidates);

      global.fetch = originalFetch;

      expect(result.telemetry.fallbackApplied).toBe(true);
      expect(result.telemetry.fallbackReason).toContain("remote_failure");
      expect(result.candidates.length).toBeGreaterThan(0);
    });

    it("returns empty candidate list when fail_safely policy is specified and remote fails", async () => {
      const originalFetch = global.fetch;
      global.fetch = vi.fn().mockRejectedValue(new Error("Timeout error"));

      const adapter = new BgeRerankerAdapter({
        endpointUrl: "https://timeout.reranker.internal/rerank",
        preferOfflineFallback: false,
        maxRetries: 0,
      });

      const result = await adapter.rerank("any query", mockCandidates, {
        fallbackPolicy: "fail_safely",
      });

      global.fetch = originalFetch;

      expect(result.candidates).toEqual([]);
      expect(result.telemetry.fallbackApplied).toBe(true);
      expect(result.telemetry.strategy).toBe("fused_fallback");
    });

    it("handles health check accurately", async () => {
      const adapter = new BgeRerankerAdapter({
        preferOfflineFallback: true,
      });

      const health = await adapter.healthCheck();
      expect(health.healthy).toBe(true);
      expect(health.model).toBe("BAAI/bge-reranker-v2-m3");
      expect(health.latencyMs).toBeGreaterThanOrEqual(0);
    });
  });
});
