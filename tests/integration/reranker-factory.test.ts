import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getActiveRerankerAdapter } from "@/ai/reranker/factory";
import { modelRegistryService } from "@/ai/orchestration/model-registry-service";
import { secretsService } from "@/lib/security/secrets-service";

describe("Active Reranker Adapter Factory (F027)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("dynamically resolves reranker adapter with active assignment and decrypted secret", async () => {
    vi.spyOn(modelRegistryService, "listAssignments").mockResolvedValue([
      {
        id: "assign-rerank-1",
        capability: "reranking",
        modelId: "model-bge-reranker-v2-m3",
        modelName: "BAAI/bge-reranker-v2-m3",
        providerId: "prov-bge-tei",
        providerName: "BGE TEI Dedicated",
        providerType: "custom_http",
        environment: "production",
        isActive: true,
        updatedAt: new Date().toISOString(),
      },
    ]);

    vi.spyOn(modelRegistryService, "listProviders").mockResolvedValue([
      {
        id: "prov-bge-tei",
        name: "BGE TEI Dedicated",
        providerType: "custom_http",
        baseUrl: "https://tei.internal.anas-ai.dev/rerank",
        isEnabled: true,
        hasApiKey: true,
        modelsCount: 1,
        activeModelsCount: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    vi.spyOn(modelRegistryService, "getRuntimePolicy").mockResolvedValue({
      id: "policy-prod",
      timeoutMs: 4500,
      maxRetries: 3,
      rateLimitRpm: 60,
      updatedAt: new Date().toISOString(),
    });

    vi.spyOn(secretsService, "getSecret").mockResolvedValue("test-secret-tei-token");

    const adapter = await getActiveRerankerAdapter();

    expect(adapter).toBeDefined();
    expect(adapter.modelName).toBe("BAAI/bge-reranker-v2-m3");
  });

  it("handles registry error gracefully by returning baseline adapter", async () => {
    vi.spyOn(modelRegistryService, "listAssignments").mockRejectedValue(
      new Error("Database unavailable"),
    );

    const adapter = await getActiveRerankerAdapter();

    expect(adapter).toBeDefined();
    expect(adapter.modelName).toBe("BAAI/bge-reranker-v2-m3");
  });
});
