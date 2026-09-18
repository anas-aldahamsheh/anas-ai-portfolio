import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { QueryRewriter } from "@/ai/query-rewrite/query-rewriter";
import { modelRegistryService } from "@/ai/orchestration/model-registry-service";

describe("QueryRewriter Service (F026)", () => {
  let rewriter: QueryRewriter;

  beforeEach(() => {
    rewriter = new QueryRewriter();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns noop when query rewriting is explicitly disabled", async () => {
    const result = await rewriter.rewrite(
      {
        userMessage: "What are your skills?",
        language: "en",
      },
      { enabled: false },
    );

    expect(result.wasRewritten).toBe(false);
    expect(result.strategy).toBe("noop");
    expect(result.rewrittenQueries).toEqual(["What are your skills?"]);
  });

  it("uses heuristic fallback when no rewrite model is available in registry", async () => {
    vi.spyOn(modelRegistryService, "listAssignments").mockResolvedValue([]);
    vi.spyOn(modelRegistryService, "listProviders").mockResolvedValue([]);

    const result = await rewriter.rewrite({
      userMessage: "Tell me about Qdrant and RAG",
      language: "en",
      entityHints: ["bge-m3"],
    });

    expect(result.strategy).toBe("heuristic");
    expect(result.rewrittenQueries.length).toBeGreaterThan(1);
    expect(result.originalQuery).toBe("Tell me about Qdrant and RAG");
  });

  it("handles blank or whitespace-only messages gracefully", async () => {
    const result = await rewriter.rewrite({
      userMessage: "   \n\t ",
      language: "en",
    });

    expect(result.originalQuery).toBe("");
    expect(result.rewrittenQueries).toEqual([]);
    expect(result.strategy).toBe("noop");
  });

  it("successfully invokes active LLM model and parses JSON query array", async () => {
    vi.spyOn(modelRegistryService, "listAssignments").mockResolvedValue([
      {
        id: "assign-rewrite-1",
        capability: "rewrite",
        modelId: "gpt-4o-mini",
        modelName: "GPT-4o Mini",
        providerId: "prov-openai",
        providerName: "OpenAI",
        providerType: "openai_compatible",
        environment: "production",
        isActive: true,
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
        modelsCount: 1,
        activeModelsCount: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    // Mock fetch for chat completions
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: '["What are Anas\'s skills in AI?", "AI Engineering tech stack"]',
            },
          },
        ],
      }),
    } as Response);

    const result = await rewriter.rewrite({
      userMessage: "Skills in AI",
      language: "en",
    });

    global.fetch = originalFetch;

    expect(result.strategy).toBe("llm");
    expect(result.wasRewritten).toBe(true);
    expect(result.modelUsed).toBe("gpt-4o-mini");
    expect(result.rewrittenQueries).toContain("Skills in AI");
  });
});
