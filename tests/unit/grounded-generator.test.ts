import { describe, it, expect, vi, beforeEach } from "vitest";
import { GroundedGenerator } from "@/ai/generation/grounded-generator";
import { ContextChunk } from "@/ai/contracts";
import { modelRegistryService } from "@/ai/orchestration/model-registry-service";
import { promptService } from "@/ai/prompts";

describe("GroundedGenerator", () => {
  let generator: GroundedGenerator;

  beforeEach(() => {
    generator = new GroundedGenerator();
    vi.restoreAllMocks();
  });

  const mockChunks: ContextChunk[] = [
    {
      id: "chunk-1",
      documentId: "doc-1",
      citationId: "proj_vector:c1",
      content:
        "Anas architected an enterprise hybrid search engine utilizing BGE-M3 and Qdrant vector database. The system delivers sub-50ms search latency.",
      score: 0.95,
      rerankScore: 0.98,
      sourceType: "project",
      sourceId: "proj-vector-search",
      title: "Enterprise Vector Search",
      locale: "en",
      estimatedTokens: 30,
      rank: 1,
      headingHierarchy: ["Architecture", "Performance"],
    },
    {
      id: "chunk-2",
      documentId: "doc-2",
      citationId: "skills_rag:c1",
      content:
        "Proficient in building production multilingual RAG pipelines with Arabic and English support.",
      score: 0.88,
      rerankScore: 0.91,
      sourceType: "knowledge_item",
      sourceId: "skill-rag",
      title: "Multilingual RAG",
      locale: "en",
      estimatedTokens: 20,
      rank: 2,
    },
  ];

  it("immediately returns insufficient evidence when context chunks are empty", async () => {
    const answer = await generator.generate({
      userMessage: "What is Anas's experience with quantum algorithms?",
      contextChunks: [],
      responseLanguage: "en",
    });

    expect(answer.hasInsufficientEvidence).toBe(true);
    expect(answer.content).toContain("does not contain verified information");
    expect(answer.citations).toEqual([]);
    expect(answer.telemetry.strategy).toBe("insufficient_evidence");
    expect(answer.telemetry.promptTokens).toBe(0);
    expect(answer.telemetry.latencyMs).toBeLessThan(50);
  });

  it("immediately returns Arabic insufficient evidence when context is empty and language is ar", async () => {
    const answer = await generator.generate({
      userMessage: "ما هي خبرة أنس في الخوارزميات الكمية؟",
      contextChunks: [],
      responseLanguage: "ar",
    });

    expect(answer.hasInsufficientEvidence).toBe(true);
    expect(answer.content).toContain("لا تحتوي قاعدة معارف ملف الأعمال");
    expect(answer.language).toBe("ar");
  });

  it("synthesizes grounded answer with valid citations using heuristic fallback when offline", async () => {
    vi.spyOn(modelRegistryService, "listAssignments").mockResolvedValue([]);
    vi.spyOn(modelRegistryService, "listProviders").mockResolvedValue([]);
    vi.spyOn(modelRegistryService, "getRuntimePolicy").mockResolvedValue({
      timeoutMs: 1000,
      maxRetries: 1,
    } as unknown as Awaited<ReturnType<typeof modelRegistryService.getRuntimePolicy>>);

    const answer = await generator.generate({
      userMessage: "Tell me about Anas's vector search architecture.",
      contextChunks: mockChunks,
      responseLanguage: "en",
      conversationMode: "technical",
    });

    expect(answer.hasInsufficientEvidence).toBe(false);
    expect(answer.conversationMode).toBe("technical");
    expect(answer.language).toBe("en");
    expect(answer.content).toContain("Enterprise Vector Search");
    expect(answer.content).toContain("[cit:proj_vector:c1]");
    expect(answer.citations.length).toBeGreaterThan(0);
    expect(answer.citations[0]?.sourceId).toBe("proj-vector-search");
    expect(answer.validation.isValid).toBe(true);
    expect(answer.telemetry.strategy).toBe("fallback");
  });

  it("handles LLM completion with chain-of-thought and strips <think> tags", async () => {
    vi.spyOn(modelRegistryService, "listAssignments").mockResolvedValue([
      {
        id: "assign-gen-1",
        capability: "generation",
        modelId: "gpt-4o-mini",
        modelName: "GPT-4o Mini",
        providerId: "prov-openai",
        providerName: "OpenAI",
        providerType: "openai_compatible",
        environment: "production",
        isActive: true,
        updatedAt: "",
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
        hasApiKey: false,
        maskedKey: null,
        createdAt: "",
        updatedAt: "",
      },
    ]);
    vi.spyOn(modelRegistryService, "getRuntimePolicy").mockResolvedValue({
      timeoutMs: 5000,
      maxRetries: 1,
    } as unknown as Awaited<ReturnType<typeof modelRegistryService.getRuntimePolicy>>);
    vi.spyOn(promptService, "renderPrompt").mockResolvedValue({
      systemPrompt: "System Prompt",
      userPrompt: "User Prompt",
      missingVariables: [],
      versionNumber: 1,
    });

    // Mock global fetch returning LLM response with chain of thought and citations
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: `<think>
I need to cite Enterprise Vector Search [cit:proj_vector:c1].
</think>
Anas engineered an enterprise hybrid search engine with sub-50ms latency [cit:proj_vector:c1].`,
            },
          },
        ],
        usage: {
          prompt_tokens: 150,
          completion_tokens: 45,
          total_tokens: 195,
        },
      }),
    });
    global.fetch = mockFetch;

    const answer = await generator.generate({
      userMessage: "What search engine did Anas build?",
      contextChunks: mockChunks,
      responseLanguage: "en",
    });

    expect(answer.content).not.toContain("<think>");
    expect(answer.content).toContain("[cit:proj_vector:c1]");
    expect(answer.validation.validCitedIds).toContain("proj_vector:c1");
    expect(answer.telemetry.strategy).toBe("llm");
    expect(answer.telemetry.promptTokens).toBe(150);
  });

  it("detects and strips hallucinated citation IDs from LLM output", async () => {
    vi.spyOn(modelRegistryService, "listAssignments").mockResolvedValue([
      {
        id: "assign-gen-1",
        capability: "generation",
        modelId: "gpt-4o-mini",
        modelName: "GPT-4o Mini",
        providerId: "prov-openai",
        providerName: "OpenAI",
        providerType: "openai_compatible",
        environment: "production",
        isActive: true,
        updatedAt: "",
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
        hasApiKey: false,
        maskedKey: null,
        createdAt: "",
        updatedAt: "",
      },
    ]);
    vi.spyOn(modelRegistryService, "getRuntimePolicy").mockResolvedValue({
      timeoutMs: 5000,
      maxRetries: 1,
    } as unknown as Awaited<ReturnType<typeof modelRegistryService.getRuntimePolicy>>);
    vi.spyOn(promptService, "renderPrompt").mockResolvedValue({
      systemPrompt: "System Prompt",
      userPrompt: "User Prompt",
      missingVariables: [],
      versionNumber: 1,
    });

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content:
                "Anas built a search engine [cit:proj_vector:c1] and a secret flying car [cit:fake_flying_car].",
            },
          },
        ],
        usage: { prompt_tokens: 100, completion_tokens: 30, total_tokens: 130 },
      }),
    });
    global.fetch = mockFetch;

    const answer = await generator.generate({
      userMessage: "Tell me about Anas's projects.",
      contextChunks: mockChunks,
      responseLanguage: "en",
    });

    expect(answer.content).toContain("[cit:proj_vector:c1]");
    expect(answer.content).not.toContain("[cit:fake_flying_car]");
    expect(answer.validation.invalidCitedIds).toContain("fake_flying_car");
    expect(answer.validation.isValid).toBe(false);
  });
});
