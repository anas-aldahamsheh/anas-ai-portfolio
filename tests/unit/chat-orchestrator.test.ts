import { describe, it, expect, vi, beforeEach } from "vitest";
import { ChatOrchestrator } from "@/ai/orchestration/chat-orchestrator";
import { languageResolver } from "@/ai/language";
import { queryRouter } from "@/ai/router";
import { queryRewriter } from "@/ai/query-rewrite";
import { hybridRetriever } from "@/ai/retrieval";
import { contextBuilder } from "@/ai/context";
import { groundedGenerator } from "@/ai/generation";
import * as rerankerModule from "@/ai/reranker";

describe("ChatOrchestrator (F031)", () => {
  let orchestrator: ChatOrchestrator;

  beforeEach(() => {
    orchestrator = new ChatOrchestrator();
    vi.restoreAllMocks();

    vi.spyOn(rerankerModule, "getActiveRerankerAdapter").mockResolvedValue({
      modelName: "BAAI/bge-reranker-v2-m3",
      healthCheck: vi.fn().mockResolvedValue(true),
      rerank: vi.fn().mockImplementation(async (_query, candidates) => ({
        candidates,
        telemetry: {
          inputCount: candidates.length,
          outputCount: candidates.length,
          modelUsed: "bge-reranker-v2-m3",
          latencyMs: 5,
        },
      })),
    });
  });

  it("successfully orchestrates end-to-end RAG chat pipeline with citations and telemetry", async () => {
    vi.spyOn(languageResolver, "resolveLanguage").mockResolvedValue({
      language: "en",
      direction: "ltr",
      confidence: 0.95,
      strategy: "script_heuristic",
      hasExplicitOverride: false,
      reason: "English script",
    });

    vi.spyOn(queryRouter, "route").mockResolvedValue({
      route_id: "project",
      confidence: 0.9,
      entity_hints: ["search"],
      needs_rewrite: true,
      retrieval_policy_id: "policy-project",
    });

    vi.spyOn(queryRewriter, "rewrite").mockResolvedValue({
      originalQuery: "Tell me about Anas's search project",
      rewrittenQueries: ["Tell me about Anas's search project", "Anas vector search architecture"],
      wasRewritten: true,
      strategy: "llm",
      latencyMs: 10,
    });

    vi.spyOn(hybridRetriever, "retrieve").mockResolvedValue({
      candidates: [
        {
          id: "chunk-1",
          documentId: "doc-1",
          citationId: "proj_search:c1",
          sourceId: "proj-search",
          sourceType: "project",
          title: "Semantic Vector Search",
          locale: "en",
          content: "Anas built a production vector search platform with Qdrant.",
          score: 0.92,
          headingHierarchy: [],
          tags: [],
          retrieverType: "hybrid",
          rank: 1,
        },
      ],
      telemetry: {
        denseCandidateCount: 1,
        sparseCandidateCount: 1,
        fusedCandidateCount: 1,
        denseLatencyMs: 5,
        sparseLatencyMs: 3,
        fusionLatencyMs: 2,
        totalLatencyMs: 10,
      },
    });

    vi.spyOn(contextBuilder, "buildContext").mockResolvedValue({
      formattedContext: "<retrieved_context>...</retrieved_context>",
      chunks: [
        {
          id: "chunk-1",
          documentId: "doc-1",
          citationId: "proj_search:c1",
          sourceId: "proj-search",
          sourceType: "project",
          title: "Semantic Vector Search",
          locale: "en",
          content: "Anas built a production vector search platform with Qdrant.",
          score: 0.92,
          estimatedTokens: 25,
          rank: 1,
        },
      ],
      availableCitations: [
        {
          citationId: "proj_search:c1",
          sourceId: "proj-search",
          sourceType: "project",
          title: "Semantic Vector Search",
          locale: "en",
        },
      ],
      telemetry: {
        inputCandidatesCount: 1,
        selectedChunksCount: 1,
        deduplicatedCount: 0,
        perSourceCappedCount: 0,
        budgetExceededCount: 0,
        totalEstimatedTokens: 25,
        maxTokenBudget: 3000,
        uniqueSourcesCount: 1,
        latencyMs: 2,
      },
    });

    vi.spyOn(groundedGenerator, "generate").mockResolvedValue({
      content:
        "Based on verified evidence, Anas built an enterprise vector search platform using Qdrant [cit:proj_search:c1].",
      rawContent: "raw answer",
      language: "en",
      conversationMode: "technical",
      citations: [
        {
          citationId: "proj_search:c1",
          sourceId: "proj-search",
          sourceType: "project",
          title: "Semantic Vector Search",
          locale: "en",
          occurrences: 1,
        },
      ],
      validation: {
        isValid: true,
        citedIds: ["proj_search:c1"],
        validCitedIds: ["proj_search:c1"],
        invalidCitedIds: [],
        missingRequiredCitations: false,
        cleanedText: "cleaned answer",
        citations: [],
        languageConsistent: true,
      },
      hasInsufficientEvidence: false,
      telemetry: {
        modelUsed: "gpt-4o-mini",
        providerType: "openai_compatible",
        promptTokens: 100,
        completionTokens: 30,
        totalTokens: 130,
        latencyMs: 15,
        citedSourcesCount: 1,
        hasInsufficientEvidence: false,
        strategy: "llm",
      },
    });

    const result = await orchestrator.processChat({
      message: "Tell me about Anas's search project",
      conversationMode: "technical",
    });

    expect(result.answer).toContain("[cit:proj_search:c1]");
    expect(result.language).toBe("en");
    expect(result.direction).toBe("ltr");
    expect(result.conversationMode).toBe("technical");
    expect(result.citations).toHaveLength(1);
    expect(result.hasInsufficientEvidence).toBe(false);
    expect(result.telemetry.routeId).toBe("project");
    expect(result.telemetry.rewriteCount).toBe(2);
    expect(result.telemetry.retrievedCount).toBeGreaterThan(0);
  });

  it("returns localized insufficient evidence when no context chunks are found", async () => {
    vi.spyOn(languageResolver, "resolveLanguage").mockResolvedValue({
      language: "ar",
      direction: "rtl",
      confidence: 1.0,
      strategy: "script_heuristic",
      hasExplicitOverride: false,
      reason: "Arabic script",
    });

    vi.spyOn(queryRouter, "route").mockResolvedValue({
      route_id: "broad_portfolio",
      confidence: 0.5,
      entity_hints: [],
      needs_rewrite: false,
      retrieval_policy_id: "policy-broad",
    });

    vi.spyOn(hybridRetriever, "retrieve").mockResolvedValue({
      candidates: [],
      telemetry: {
        denseCandidateCount: 0,
        sparseCandidateCount: 0,
        fusedCandidateCount: 0,
        denseLatencyMs: 1,
        sparseLatencyMs: 1,
        fusionLatencyMs: 1,
        totalLatencyMs: 3,
      },
    });

    vi.spyOn(contextBuilder, "buildContext").mockResolvedValue({
      formattedContext: "",
      chunks: [],
      availableCitations: [],
      telemetry: {
        inputCandidatesCount: 0,
        selectedChunksCount: 0,
        deduplicatedCount: 0,
        perSourceCappedCount: 0,
        budgetExceededCount: 0,
        totalEstimatedTokens: 0,
        maxTokenBudget: 3000,
        uniqueSourcesCount: 0,
        latencyMs: 1,
      },
    });

    vi.spyOn(groundedGenerator, "generate").mockResolvedValue({
      content:
        "لا تحتوي قاعدة معارف ملف الأعمال على معلومات موثقة كافية للإجابة على هذا الاستفسار.",
      rawContent:
        "لا تحتوي قاعدة معارف ملف الأعمال على معلومات موثقة كافية للإجابة على هذا الاستفسار.",
      language: "ar",
      conversationMode: "general",
      citations: [],
      validation: {
        isValid: true,
        citedIds: [],
        validCitedIds: [],
        invalidCitedIds: [],
        missingRequiredCitations: false,
        cleanedText:
          "لا تحتوي قاعدة معارف ملف الأعمال على معلومات موثقة كافية للإجابة على هذا الاستفسار.",
        citations: [],
        languageConsistent: true,
      },
      hasInsufficientEvidence: true,
      telemetry: {
        modelUsed: "grounding-policy",
        providerType: "deterministic_policy",
        promptTokens: 0,
        completionTokens: 20,
        totalTokens: 20,
        latencyMs: 0,
        citedSourcesCount: 0,
        hasInsufficientEvidence: true,
        strategy: "insufficient_evidence",
      },
    });

    const result = await orchestrator.processChat({
      message: "هل يمتلك أنس خبرة في فيزياء الكم؟",
      conversationLocale: "ar",
    });

    expect(result.hasInsufficientEvidence).toBe(true);
    expect(result.language).toBe("ar");
    expect(result.direction).toBe("rtl");
    expect(result.citations).toEqual([]);
    expect(result.answer).toContain("لا تحتوي قاعدة معارف ملف الأعمال");
  });
});
