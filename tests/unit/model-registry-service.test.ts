import { describe, it, expect, vi, beforeEach } from "vitest";
import { ModelRegistryService } from "@/ai/orchestration/model-registry-service";
import {
  BASELINE_PROVIDERS,
  BASELINE_MODELS,
  BASELINE_ASSIGNMENTS,
  BASELINE_RUNTIME_POLICY,
} from "@/ai/contracts/baseline-registry";

// Mock Drizzle DB
vi.mock("@/lib/db/client", () => ({
  db: {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockResolvedValue([]),
        where: vi.fn().mockResolvedValue([]),
        limit: vi.fn().mockResolvedValue([]),
      }),
    }),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([]),
      }),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]),
        }),
      }),
    }),
    delete: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue([]),
    }),
  },
}));

describe("ModelRegistryService Domain & Infrastructure (F019)", () => {
  let service: ModelRegistryService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ModelRegistryService();
  });

  describe("Baseline Fallback Retrieval", () => {
    it("returns baseline providers when database returns empty rows", async () => {
      const providers = await service.listProviders();
      expect(providers.length).toBe(BASELINE_PROVIDERS.length);
      expect(providers[0]?.name).toBe(BASELINE_PROVIDERS[0]?.name);
      expect(providers.some((p) => p.modelsCount > 0)).toBe(true);
    });

    it("returns baseline models with provider metadata", async () => {
      const models = await service.listModels();
      expect(models.length).toBe(BASELINE_MODELS.length);
      expect(models.some((m) => m.modelId === "BAAI/bge-m3")).toBe(true);
      expect(models.some((m) => m.modelId === "gpt-4o-mini")).toBe(true);
    });

    it("filters models by capability", async () => {
      const embeddingModels = await service.listModels("embedding");
      expect(embeddingModels.length).toBeGreaterThan(0);
      expect(embeddingModels.every((m) => m.capability === "embedding")).toBe(true);

      const rerankModels = await service.listModels("reranking");
      expect(rerankModels.length).toBeGreaterThan(0);
      expect(rerankModels.every((m) => m.capability === "reranking")).toBe(true);
    });

    it("returns active assignments for production environment", async () => {
      const assignments = await service.listAssignments("production");
      expect(assignments.length).toBe(BASELINE_ASSIGNMENTS.length);
      expect(assignments.some((a) => a.capability === "generation")).toBe(true);
      expect(assignments.some((a) => a.capability === "embedding")).toBe(true);
      expect(assignments.some((a) => a.capability === "reranking")).toBe(true);
    });

    it("returns baseline runtime policy", async () => {
      const policy = await service.getRuntimePolicy();
      expect(policy.timeoutMs).toBe(BASELINE_RUNTIME_POLICY.timeoutMs);
      expect(policy.maxRetries).toBe(BASELINE_RUNTIME_POLICY.maxRetries);
      expect(policy.rateLimitRpm).toBe(BASELINE_RUNTIME_POLICY.rateLimitRpm);
    });
  });

  describe("Provider Management", () => {
    it("creates a new provider and invalidates cache", async () => {
      const newProv = await service.createProvider(
        {
          name: "DeepSeek Direct API",
          providerType: "openai_compatible",
          baseUrl: "https://api.deepseek.com/v1",
          isEnabled: true,
        },
        "admin-test-id",
      );

      expect(newProv.id).toBeDefined();
      expect(newProv.name).toBe("DeepSeek Direct API");
      expect(newProv.providerType).toBe("openai_compatible");
    });

    it("updates existing provider attributes", async () => {
      const updated = await service.updateProvider(
        "prov-openai-gateway",
        { baseUrl: "https://custom-gateway.corp.dev/v1" },
        "admin-test-id",
      );

      expect(updated).toBeDefined();
      expect(updated?.baseUrl).toBe("https://custom-gateway.corp.dev/v1");
    });

    it("prevents deleting provider when active capability assignment depends on it", async () => {
      // prov-openai-gateway has model-gpt-4o-mini assigned to generation
      await expect(service.deleteProvider("prov-openai-gateway", "admin-test-id")).rejects.toThrow(
        /Cannot delete provider with active/i,
      );
    });
  });

  describe("Model Registration & Management", () => {
    it("creates a new model for a provider", async () => {
      const model = await service.createModel(
        {
          providerId: "prov-openai-gateway",
          modelId: "gpt-4o-latest",
          capability: "generation",
          contextWindow: 128000,
          isEnabled: true,
        },
        "admin-test-id",
      );

      expect(model.id).toBeDefined();
      expect(model.modelId).toBe("gpt-4o-latest");
      expect(model.capability).toBe("generation");
    });

    it("prevents deleting model currently assigned to an active role", async () => {
      // model-bge-m3 is assigned to embedding
      await expect(service.deleteModel("model-bge-m3", "admin-test-id")).rejects.toThrow(
        /Cannot delete model assigned to an active/i,
      );
    });
  });

  describe("Capability Assignment without Deployment", () => {
    it("assigns an active model to a capability immediately", async () => {
      const assignment = await service.assignModel(
        "generation",
        "model-claude-3-5-sonnet",
        "production",
        "admin-test-id",
      );

      expect(assignment.capability).toBe("generation");
      expect(assignment.modelId).toBe("model-claude-3-5-sonnet");
      expect(assignment.isActive).toBe(true);
    });

    it("rejects assigning an incompatible capability model", async () => {
      // Trying to assign an embedding model (model-bge-m3) to generation role
      await expect(
        service.assignModel("generation", "model-bge-m3", "production", "admin-test-id"),
      ).rejects.toThrow(/not compatible with assignment role/i);
    });

    it("allows generation models to serve router and rewrite roles", async () => {
      const routerAssign = await service.assignModel(
        "router",
        "model-gpt-4o-mini",
        "production",
        "admin-test-id",
      );
      expect(routerAssign.capability).toBe("router");

      const rewriteAssign = await service.assignModel(
        "rewrite",
        "model-gpt-4o-mini",
        "production",
        "admin-test-id",
      );
      expect(rewriteAssign.capability).toBe("rewrite");
    });
  });

  describe("Runtime Policy", () => {
    it("updates policy parameters", async () => {
      const updated = await service.updateRuntimePolicy(
        {
          timeoutMs: 45000,
          maxRetries: 3,
          rateLimitRpm: 60,
        },
        "admin-test-id",
      );

      expect(updated.timeoutMs).toBe(45000);
      expect(updated.maxRetries).toBe(3);
      expect(updated.rateLimitRpm).toBe(60);
    });
  });

  describe("Model Health & Capability Checks (19_MODEL_HEALTH_AND_CAPABILITY_CHECKS.md)", () => {
    it("validates embedding model dimension and bilingual support", async () => {
      const result = await service.testModelCapability("model-bge-m3", "embedding");
      expect(result.success).toBe(true);
      expect(result.capability).toBe("embedding");
      expect(result.latencyMs).toBeGreaterThan(0);
      expect(result.details?.dimension).toBe(1024);
      expect(result.details?.testedBilingual).toBe(true);
    });

    it("validates reranker model cross-encoder scoring", async () => {
      const result = await service.testModelCapability("model-bge-reranker-v2-m3", "reranking");
      expect(result.success).toBe(true);
      expect(result.capability).toBe("reranking");
      expect(result.details?.scoreSample).toBeGreaterThan(0);
      expect(result.details?.testedBilingual).toBe(true);
    });

    it("validates generation model streaming and output", async () => {
      const result = await service.testModelCapability("model-gpt-4o-mini", "generation");
      expect(result.success).toBe(true);
      expect(result.capability).toBe("generation");
      expect(result.details?.tokensGenerated).toBeGreaterThan(0);
    });

    it("returns graceful error for non-existent model", async () => {
      const result = await service.testModelCapability("non-existent-id", "generation");
      expect(result.success).toBe(false);
      expect(result.message).toContain("not found");
    });
  });
});
