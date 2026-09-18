import { describe, it, expect, vi, beforeEach } from "vitest";
import { jobFitService } from "@/ai/job-fit/job-fit-service";
import { hybridRetriever } from "@/ai/retrieval";
import { modelRegistryService } from "@/ai/orchestration/model-registry-service";
import { promptService } from "@/ai/prompts/prompt-service";
import { ScoredCandidate } from "@/ai/contracts/retrieval";

describe("JobFitService (F034)", () => {
  const mockChunks: ScoredCandidate[] = [
    {
      id: "chunk-1",
      documentId: "doc-1",
      sourceId: "proj-vector-search",
      sourceType: "project",
      locale: "en",
      title: "Enterprise Vector Search Platform",
      content:
        "Engineered a distributed hybrid vector search engine using BGE-M3 embeddings, Qdrant, and BM25 sparse recall with sub-50ms p95 latency.",
      headingHierarchy: ["Architecture", "Hybrid Retrieval"],
      tags: ["Vector Search", "Qdrant", "BGE-M3"],
      score: 0.95,
      rawDenseScore: 0.92,
      rawSparseScore: 0.88,
      citationId: "proj-vector-search:c1",
      retrieverType: "hybrid",
    },
    {
      id: "chunk-2",
      documentId: "doc-2",
      sourceId: "proj-ai-gateway",
      sourceType: "project",
      locale: "en",
      title: "Resilient Multi-Provider AI Gateway",
      content:
        "Built multi-provider fallback and rate-limiting gateway orchestrating OpenAI, Anthropic, and local models with zero downtime failover.",
      headingHierarchy: ["Design", "Reliability"],
      tags: ["AI Gateway", "Resilience", "TypeScript"],
      score: 0.89,
      rawDenseScore: 0.86,
      rawSparseScore: 0.82,
      citationId: "proj-ai-gateway:c1",
      retrieverType: "hybrid",
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(hybridRetriever, "retrieve").mockResolvedValue({
      candidates: mockChunks,
      telemetry: {
        denseCandidateCount: 2,
        sparseCandidateCount: 2,
        fusedCandidateCount: 2,
        denseLatencyMs: 5,
        sparseLatencyMs: 5,
        fusionLatencyMs: 2,
        totalLatencyMs: 12,
      },
    });
    vi.spyOn(promptService, "renderPrompt").mockResolvedValue({
      systemPrompt: "System prompt for job fit",
      userPrompt: "User prompt for job fit",
      missingVariables: [],
      versionNumber: 1,
    });
    vi.spyOn(modelRegistryService, "listAssignments").mockResolvedValue([
      {
        id: "assign-1",
        capability: "generation",
        modelId: "gpt-4o",
        environment: "production",
        isActive: true,
        providerId: "prov-openai",
        modelName: "GPT-4o",
        providerName: "OpenAI",
        providerType: "openai_compatible",
        updatedAt: new Date().toISOString(),
      },
    ]);
    vi.spyOn(modelRegistryService, "listProviders").mockResolvedValue([
      {
        id: "prov-openai",
        name: "OpenAI",
        providerType: "openai_compatible",
        baseUrl: "https://api.openai.com/v1",
        isEnabled: true,
        hasApiKey: false,
        modelsCount: 1,
        activeModelsCount: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
    vi.spyOn(modelRegistryService, "getRuntimePolicy").mockResolvedValue({
      id: "policy-1",
      timeoutMs: 5000,
      maxRetries: 1,
      rateLimitRpm: 60,
      updatedAt: new Date().toISOString(),
    });
  });

  it("successfully parses LLM JSON output, validates citations, and computes match statistics", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                overview:
                  "Strong alignment with core distributed systems and vector search requirements.",
                strengths: ["Hybrid vector search with BGE-M3", "Resilient AI provider failover"],
                gapsOrConsiderations: ["No explicit Kubernetes cluster administration documented"],
                requirements: [
                  {
                    requirement: "Experience with vector search and hybrid embeddings",
                    status: "supported",
                    confidence: 0.98,
                    explanation: "Demonstrated through Enterprise Vector Search Platform.",
                    citations: ["proj-vector-search:c1"],
                  },
                  {
                    requirement: "Multi-provider LLM failover architecture",
                    status: "supported",
                    confidence: 0.95,
                    explanation: "Documented in Resilient Multi-Provider AI Gateway.",
                    citations: ["proj-ai-gateway:c1"],
                  },
                  {
                    requirement: "Kubernetes cluster administration",
                    status: "not_found",
                    confidence: 0.9,
                    explanation: "No direct evidence of K8s cluster operations in portfolio.",
                    citations: [],
                  },
                ],
              }),
            },
          },
        ],
        usage: { total_tokens: 320 },
      }),
    } as unknown as Response);

    const result = await jobFitService.analyze({
      jobDescription:
        "We are looking for an AI engineer with expertise in vector search, hybrid embeddings, multi-provider failover, and Kubernetes.",
      locale: "en",
    });

    expect(result.summary.totalRequirements).toBe(3);
    expect(result.summary.supportedCount).toBe(2);
    expect(result.summary.partiallySupportedCount).toBe(0);
    expect(result.summary.notFoundCount).toBe(1);
    // (2 * 1.0 + 0) / 3 * 100 = 67%
    expect(result.summary.matchScore).toBe(67);
    expect(result.summary.strengths).toHaveLength(2);
    expect(result.summary.gapsOrConsiderations).toHaveLength(1);

    expect(result.requirements).toHaveLength(3);
    expect(result.requirements[0]?.status).toBe("supported");
    expect(result.requirements[0]?.citations).toHaveLength(1);
    expect(result.requirements[0]?.citations[0]?.title).toBe("Enterprise Vector Search Platform");

    expect(result.requirements[2]?.status).toBe("not_found");
    expect(result.requirements[2]?.citations).toHaveLength(0);
  });

  it("falls back to heuristic analysis when LLM API returns invalid JSON or fails", async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network timeout"));

    const result = await jobFitService.analyze({
      jobDescription:
        "Seeking an engineer with expertise in vector search, AI Gateway, and high-performance TypeScript web systems.",
      locale: "en",
    });

    expect(result.summary.totalRequirements).toBeGreaterThan(0);
    expect(result.summary.matchScore).toBeGreaterThanOrEqual(0);
    expect(result.summary.matchScore).toBeLessThanOrEqual(100);
    expect(result.requirements.length).toBeGreaterThan(0);
    expect(result.telemetry.retrievedCount).toBe(2);
  });

  it("handles Arabic job descriptions and sets Arabic language telemetry", async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error("Offline"));

    const result = await jobFitService.analyze({
      jobDescription:
        "مطلوب مهندس ذكاء اصطناعي متخصص في بناء محركات البحث المتجهي والأنظمة الموزعة عالية الأداء.",
      locale: "ar",
    });

    expect(result.telemetry.language).toBe("ar");
    expect(result.summary.overview).toContain("تحليل");
  });

  it("enforces grounding integrity by not allowing unsupported citations", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                requirements: [
                  {
                    requirement: "Fictional tool experience",
                    status: "supported",
                    citations: ["fictional-fake-id-999"], // Not in retrieved chunks
                  },
                ],
              }),
            },
          },
        ],
      }),
    } as unknown as Response);

    const result = await jobFitService.analyze({
      jobDescription: "Requires 10 years experience with Fictional tool in production.",
      locale: "en",
    });

    expect(result.requirements).toHaveLength(1);
    // Fake citation filtered out
    const fakeCit = result.requirements[0]?.citations.find(
      (c) => c.sourceId === "fictional-fake-id-999",
    );
    expect(fakeCit).toBeUndefined();
  });
});
