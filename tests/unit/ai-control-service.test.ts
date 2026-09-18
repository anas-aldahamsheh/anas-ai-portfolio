import { describe, it, expect, vi, beforeEach } from "vitest";
import { AiControlService } from "@/modules/admin/infrastructure/ai-control-service";

describe("AiControlService (F040)", () => {
  let service: AiControlService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AiControlService();
  });

  it("getOverview returns comprehensive subsystem health and active bindings", async () => {
    const overview = await service.getOverview();

    expect(overview).toBeDefined();
    expect(overview.subsystems).toBeDefined();
    expect(overview.subsystemHealth).toHaveLength(5);
    expect(overview.activeBindings).toHaveLength(6);

    const capabilities = overview.activeBindings.map((b) => b.capability);
    expect(capabilities).toContain("generation");
    expect(capabilities).toContain("embedding");
    expect(capabilities).toContain("reranking");
    expect(capabilities).toContain("router");
    expect(capabilities).toContain("rewrite");
    expect(capabilities).toContain("evaluator");

    expect(overview.ragConfig.chunkSize).toBeGreaterThan(0);
    expect(overview.embeddingCompatibility).toBeDefined();
  });

  it("validateChange enforces required fields for assignment updates", async () => {
    const res = await service.validateChange({
      changeType: "assignment",
    });

    expect(res.isValid).toBe(false);
    expect(res.errors.length).toBeGreaterThan(0);
    expect(res.errors[0]).toContain("Capability is required");
  });

  it("validateChange flags reindex requirement when embedding model assignment changes", async () => {
    const res = await service.validateChange({
      changeType: "assignment",
      capability: "embedding",
      modelId: "mod-bge-m3-1",
    });

    expect(res.requiresReindex).toBe(true);
    expect(res.recommendedGateSuite).toBe("retrieval");
    expect(res.warnings.some((w) => w.includes("reindexing"))).toBe(true);
  });

  it("validateChange validates generation models and recommends generation gate suite", async () => {
    const res = await service.validateChange({
      changeType: "assignment",
      capability: "generation",
      modelId: "mod-gpt4o-1",
    });

    expect(res.recommendedGateSuite).toBe("generation");
  });

  it("validateChange catches chunk overlap greater than or equal to chunk size", async () => {
    const res = await service.validateChange({
      changeType: "rag_config",
      ragConfig: {
        chunkSize: 256,
        chunkOverlap: 256,
      },
    });

    expect(res.isValid).toBe(false);
    expect(res.errors.some((e) => e.includes("must be strictly less than"))).toBe(true);
  });

  it("validateChange flags reindex recommendation when chunk size or overlap is updated", async () => {
    const res = await service.validateChange({
      changeType: "rag_config",
      ragConfig: {
        chunkSize: 1024,
        chunkOverlap: 128,
      },
    });

    expect(res.isValid).toBe(true);
    expect(res.requiresReindex).toBe(true);
    expect(res.recommendedGateSuite).toBe("retrieval");
  });

  it("validateChange validates runtime policy parameters and recommends full gate suite", async () => {
    const res = await service.validateChange({
      changeType: "runtime_policy",
      runtimePolicy: {
        defaultTimeoutMs: 500, // under 1000ms warning
      },
    });

    expect(res.isValid).toBe(true);
    expect(res.recommendedGateSuite).toBe("full");
    expect(res.warnings.some((w) => w.includes("timeout"))).toBe(true);
  });
});
