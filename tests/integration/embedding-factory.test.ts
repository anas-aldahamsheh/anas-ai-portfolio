import { describe, it, expect, vi, beforeEach } from "vitest";
import { getActiveEmbeddingAdapter } from "@/ai/embeddings/factory";
import { modelRegistryService } from "@/ai/orchestration/model-registry-service";
import { secretsService } from "@/lib/security/secrets-service";

describe("Active Embedding Adapter Factory (F023)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("resolves active embedding adapter from model registry and decrypts API key", async () => {
    vi.spyOn(modelRegistryService, "listAssignments").mockResolvedValueOnce([
      {
        id: "assign-embed-1",
        capability: "embedding",
        modelId: "model-bge-m3",
        providerId: "prov-tei-1",
        environment: "production",
        isActive: true,
        modelName: "BAAI/bge-m3",
        providerName: "HuggingFace TEI",
        providerType: "custom_http",
        updatedAt: new Date().toISOString(),
      },
    ]);

    vi.spyOn(modelRegistryService, "listProviders").mockResolvedValueOnce([
      {
        id: "prov-tei-1",
        name: "HuggingFace TEI",
        providerType: "custom_http",
        baseUrl: "https://tei.example.com/embed",
        isEnabled: true,
        hasApiKey: true,
        modelsCount: 1,
        activeModelsCount: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    vi.spyOn(modelRegistryService, "getRuntimePolicy").mockResolvedValueOnce({
      id: "policy-1",
      timeoutMs: 8000,
      maxRetries: 3,
      rateLimitRpm: 60,
      updatedAt: new Date().toISOString(),
    });

    vi.spyOn(secretsService, "getSecret").mockResolvedValueOnce("super-secret-tei-token");

    const adapter = await getActiveEmbeddingAdapter();
    expect(adapter).toBeDefined();
    expect(adapter.dimension).toBe(1024);
    expect(adapter.modelName).toBe("BAAI/bge-m3");
    expect(secretsService.getSecret).toHaveBeenCalledWith("ai_provider_prov-tei-1_api_key");
  });

  it("safely falls back to default adapter when registry returns no active assignment", async () => {
    vi.spyOn(modelRegistryService, "listAssignments").mockResolvedValueOnce([]);
    vi.spyOn(modelRegistryService, "listProviders").mockResolvedValueOnce([]);
    vi.spyOn(modelRegistryService, "getRuntimePolicy").mockResolvedValueOnce({
      id: "policy-1",
      timeoutMs: 5000,
      maxRetries: 2,
      rateLimitRpm: 30,
      updatedAt: new Date().toISOString(),
    });

    const adapter = await getActiveEmbeddingAdapter();
    expect(adapter).toBeDefined();
    expect(adapter.dimension).toBe(1024);
  });

  it("handles registry error gracefully by returning baseline adapter", async () => {
    vi.spyOn(modelRegistryService, "listAssignments").mockRejectedValueOnce(
      new Error("Database unavailable"),
    );

    const adapter = await getActiveEmbeddingAdapter();
    expect(adapter).toBeDefined();
    expect(adapter.dimension).toBe(1024);
  });
});
