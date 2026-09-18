import { describe, it, expect, vi, beforeEach } from "vitest";
import { aiLabService } from "@/ai/lab/ai-lab-service";
import { BASELINE_AI_LAB_DEMOS } from "@/ai/lab/baseline-demos";

vi.mock("@/lib/db/client", () => ({
  db: {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockResolvedValue([]),
        where: vi.fn().mockResolvedValue([]),
      }),
    }),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        onConflictDoNothing: vi.fn().mockResolvedValue([]),
      }),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]),
        }),
      }),
    }),
  },
}));

describe("AiLabService (F035)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    aiLabService.invalidateCache();
  });

  it("lists all baseline demos with proper metadata", async () => {
    const demos = await aiLabService.listDemos({ publishedOnly: false });
    expect(demos.length).toBe(BASELINE_AI_LAB_DEMOS.length);
    expect(demos[0]?.slug).toBe("hybrid-search");
    expect(demos[0]?.title).toBe("Hybrid Search Explorer");
  });

  it("returns Arabic localized titles and descriptions when requested", async () => {
    const demosAr = await aiLabService.listDemos({ publishedOnly: false, locale: "ar" });
    expect(demosAr.length).toBeGreaterThan(0);
    expect(demosAr[0]?.title).toBe("مستكشف البحث الهجين");
    expect(demosAr[0]?.description).toContain("دمج تفاعلي");
  });

  it("retrieves single demo config by slug", async () => {
    const demo = await aiLabService.getDemoBySlug("reranking");
    expect(demo).not.toBeNull();
    expect(demo?.slug).toBe("reranking");
    expect(demo?.type).toBe("reranking");
    expect(demo?.timeoutMs).toBe(10000);
  });

  it("executes hybrid search demo with authentic metrics and rankings", async () => {
    const result = await aiLabService.executeDemo({
      demoSlug: "hybrid-search",
      params: {
        query: "Production RAG architecture with vector search",
        denseWeight: 0.6,
        topK: 5,
      },
    });

    expect(result.demoSlug).toBe("hybrid-search");
    expect(result.type).toBe("hybrid_search");
    expect(result.telemetry.realExecution).toBe(true);
    expect(result.telemetry.latencyMs).toBeGreaterThanOrEqual(0);

    const data = result.data as {
      query: string;
      denseWeight: number;
      sparseWeight: number;
      topK: number;
      results: Array<{
        rank: number;
        title: string;
        score: number;
        denseRank: number;
        sparseRank: number;
      }>;
    };

    expect(data.query).toBe("Production RAG architecture with vector search");
    expect(data.denseWeight).toBe(0.6);
    expect(data.sparseWeight).toBe(0.4);
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results[0]?.rank).toBe(1);
    expect(data.results[0]?.score).toBeGreaterThan(0);
  });

  it("executes cross-encoder reranking demo and computes rank shift deltas", async () => {
    const result = await aiLabService.executeDemo({
      demoSlug: "reranking",
      params: {
        query: "Modern Next.js 15 App Router architecture with strict TypeScript",
        candidateCount: 6,
        topN: 3,
        threshold: 0.05,
      },
    });

    expect(result.demoSlug).toBe("reranking");
    expect(result.type).toBe("reranking");
    expect(result.telemetry.realExecution).toBe(true);

    const data = result.data as {
      preRerank: Array<{ initialRank: number; initialScore: number }>;
      postRerank: Array<{
        newRank: number;
        crossEncoderScore: number;
        rankDelta: number;
        passedThreshold: boolean;
      }>;
    };

    expect(data.preRerank.length).toBeGreaterThan(0);
    expect(data.postRerank.length).toBeGreaterThan(0);
    expect(data.postRerank[0]?.newRank).toBe(1);
    expect(data.postRerank[0]?.crossEncoderScore).toBeGreaterThan(0);
  });

  it("executes retrieval comparison benchmark side-by-side", async () => {
    const result = await aiLabService.executeDemo({
      demoSlug: "retrieval-comparison",
      params: {
        query: "PostgreSQL database optimization and vector similarity search",
        topK: 4,
      },
    });

    expect(result.demoSlug).toBe("retrieval-comparison");
    expect(result.type).toBe("retrieval_comparison");

    const data = result.data as {
      overlapCount: number;
      overlapPercentage: number;
      dense: { latencyMs: number; items: Array<{ rank: number }> };
      sparse: { latencyMs: number; items: Array<{ rank: number }> };
      hybrid: { latencyMs: number; items: Array<{ rank: number }> };
    };

    expect(data.dense.items.length).toBeGreaterThan(0);
    expect(data.sparse.items.length).toBeGreaterThan(0);
    expect(data.hybrid.items.length).toBeGreaterThan(0);
    expect(typeof data.overlapPercentage).toBe("number");
  });

  it("executes structured entity extraction with strict JSON validation", async () => {
    const result = await aiLabService.executeDemo({
      demoSlug: "structured-extraction",
      params: {
        text: "Anas architected an enterprise hybrid RAG pipeline with Qdrant vector database, BGE-M3 embeddings, Next.js 15, and strict TypeScript.",
        schemaType: "skills_and_technologies",
      },
    });

    expect(result.demoSlug).toBe("structured-extraction");
    expect(result.type).toBe("structured_extraction");
    expect(result.telemetry.tokensUsed).toBeGreaterThan(0);

    const data = result.data as {
      schemaType: string;
      isValid: boolean;
      extracted: { skills: string[]; primaryDomain: string };
      rawJson: string;
    };

    expect(data.isValid).toBe(true);
    expect(data.extracted.skills).toContain("Next.js");
    expect(data.extracted.skills).toContain("TypeScript");
    expect(data.extracted.skills).toContain("Qdrant");
    expect(data.rawJson).toContain("Next.js");
  });

  it("executes citation verification detecting grounded and ungrounded claims", async () => {
    // 1. Supported claim
    const supportedRes = await aiLabService.executeDemo({
      demoSlug: "citation-verification",
      params: {
        claim: "Anas implemented a hybrid RAG retrieval pipeline combining BGE-M3 with BM25.",
      },
    });

    const supData = supportedRes.data as {
      status: string;
      confidenceScore: number;
      verifiedCitations: Array<{ matchScore: number }>;
    };
    expect(supData.status).toBe("supported");
    expect(supData.confidenceScore).toBeGreaterThanOrEqual(0.5);

    // 2. Unsupported / hallucinated claim
    const unsupportedRes = await aiLabService.executeDemo({
      demoSlug: "citation-verification",
      params: {
        claim: "Anas published quantum superconductor fusion reactor designs in 2018.",
      },
    });

    const unsupData = unsupportedRes.data as {
      status: string;
      confidenceScore: number;
    };
    expect(unsupData.status).toBe("unsupported");
    expect(unsupData.confidenceScore).toBeLessThan(0.35);
  });

  it("throws error for unknown demo slug or unpublished demo", async () => {
    await expect(
      aiLabService.executeDemo({
        demoSlug: "non-existent-demo",
        params: {},
      }),
    ).rejects.toThrow("Unknown AI Lab demo");
  });

  it("updates demo configuration parameters", async () => {
    const updated = await aiLabService.updateDemo(
      "demo-hybrid-search-001",
      {
        rateLimitRpm: 120,
        timeoutMs: 15000,
      },
      "admin-test-user",
    );

    expect(updated.rateLimitRpm).toBe(120);
    expect(updated.timeoutMs).toBe(15000);
  });
});
