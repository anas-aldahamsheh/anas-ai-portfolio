import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  BgeM3EmbeddingAdapter,
  l2Normalize,
} from "@/ai/embeddings/adapters/bge-m3-embedding-adapter";

describe("BGE-M3 Embedding Adapter (F023)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("l2Normalize", () => {
    it("normalizes arbitrary non-zero vectors to unit length (norm = 1.0)", () => {
      const vec = [3, 4];
      const normalized = l2Normalize(vec);
      expect(normalized[0]).toBeCloseTo(0.6, 4);
      expect(normalized[1]).toBeCloseTo(0.8, 4);

      const sumSq = normalized.reduce((acc, v) => acc + v * v, 0);
      expect(Math.sqrt(sumSq)).toBeCloseTo(1.0, 4);
    });

    it("returns zero vector unchanged", () => {
      const vec = [0, 0, 0];
      const normalized = l2Normalize(vec);
      expect(normalized).toEqual([0, 0, 0]);
    });
  });

  describe("Adapter Configuration", () => {
    it("has 1024 dense dimension and BAAI/bge-m3 model name", () => {
      const adapter = new BgeM3EmbeddingAdapter();
      expect(adapter.dimension).toBe(1024);
      expect(adapter.modelName).toBe("BAAI/bge-m3");
      expect(adapter.maxInputTokens).toBe(8192);
    });
  });

  describe("Offline & Fallback Embeddings", () => {
    it("generates deterministic 1024-d embeddings in offline mode", async () => {
      const adapter = new BgeM3EmbeddingAdapter({ preferOfflineFallback: true });
      const texts = [
        "AI Engineering Portfolio and Grounded RAG",
        "محفظة مهندس الذكاء الاصطناعي وهندسة البرمجيات",
      ];

      const vectors = await adapter.embed(texts);
      expect(vectors).toHaveLength(2);

      expect(vectors[0]).toHaveLength(1024);
      expect(vectors[1]).toHaveLength(1024);

      // Verify unit norm
      const norm0 = Math.sqrt(vectors[0]!.reduce((acc, v) => acc + v * v, 0));
      expect(norm0).toBeCloseTo(1.0, 3);

      const norm1 = Math.sqrt(vectors[1]!.reduce((acc, v) => acc + v * v, 0));
      expect(norm1).toBeCloseTo(1.0, 3);
    });

    it("returns empty array when given empty texts array", async () => {
      const adapter = new BgeM3EmbeddingAdapter({ preferOfflineFallback: true });
      const vectors = await adapter.embed([]);
      expect(vectors).toEqual([]);
    });
  });

  describe("Remote Inference (TEI & OpenAI Formats)", () => {
    it("handles TEI format HTTP responses correctly", async () => {
      const fakeVectors = [new Array(1024).fill(0.1), new Array(1024).fill(0.2)];

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(fakeVectors),
      });

      const adapter = new BgeM3EmbeddingAdapter({
        endpointUrl: "http://localhost:8080/embed",
        apiKey: "tei-secret-key",
        preferOfflineFallback: false,
      });

      const texts = ["Hello world", "Arabic text مرحبا"];
      const vectors = await adapter.embed(texts);

      expect(vectors).toHaveLength(2);
      expect(vectors[0]).toHaveLength(1024);
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8080/embed",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer tei-secret-key",
          }),
        }),
      );
    });

    it("handles OpenAI format HTTP responses correctly", async () => {
      const fakeVectors = [
        { index: 0, embedding: new Array(1024).fill(0.15) },
        { index: 1, embedding: new Array(1024).fill(0.25) },
      ];

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: fakeVectors }),
      });

      const adapter = new BgeM3EmbeddingAdapter({
        endpointUrl: "https://api.openai.com/v1/embeddings",
        apiKey: "sk-openai-key",
        preferOfflineFallback: false,
      });

      const texts = ["Text A", "Text B"];
      const vectors = await adapter.embed(texts);

      expect(vectors).toHaveLength(2);
      expect(vectors[0]).toHaveLength(1024);
    });

    it("retries on network error and falls back gracefully", async () => {
      // Mock fetch failure
      global.fetch = vi.fn().mockRejectedValue(new Error("Connection refused"));

      const adapter = new BgeM3EmbeddingAdapter({
        endpointUrl: "http://unreachable-host:8080/embed",
        preferOfflineFallback: false,
        maxRetries: 1,
        timeoutMs: 50,
      });

      // Should not throw, should fall back to deterministic embeddings
      const vectors = await adapter.embed(["Test retry failure"]);
      expect(vectors).toHaveLength(1);
      expect(vectors[0]).toHaveLength(1024);
    });
  });

  describe("Health Check", () => {
    it("returns healthy status and 1024 dimension", async () => {
      const adapter = new BgeM3EmbeddingAdapter({ preferOfflineFallback: true });
      const health = await adapter.healthCheck();

      expect(health.healthy).toBe(true);
      expect(health.dimension).toBe(1024);
      expect(health.latencyMs).toBeGreaterThanOrEqual(0);
      expect(health.error).toBeUndefined();
    });
  });
});
