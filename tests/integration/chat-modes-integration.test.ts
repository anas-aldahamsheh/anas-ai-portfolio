import { describe, it, expect, vi, beforeEach } from "vitest";
import { ChatOrchestrator } from "@/ai/orchestration/chat-orchestrator";
import { languageResolver } from "@/ai/language";
import { queryRouter } from "@/ai/router";
import { hybridRetriever } from "@/ai/retrieval";
import { contextBuilder } from "@/ai/context";
import { groundedGenerator } from "@/ai/generation";
import { ConversationMode } from "@/ai/contracts";
import * as rerankerModule from "@/ai/reranker";

describe("Chat Modes Integration (F032)", () => {
  let orchestrator: ChatOrchestrator;

  beforeEach(() => {
    orchestrator = new ChatOrchestrator();
    vi.restoreAllMocks();

    vi.spyOn(languageResolver, "resolveLanguage").mockResolvedValue({
      language: "en",
      direction: "ltr",
      confidence: 1.0,
      strategy: "script_heuristic",
      hasExplicitOverride: false,
      reason: "English",
    });

    vi.spyOn(queryRouter, "route").mockResolvedValue({
      route_id: "profile",
      confidence: 0.9,
      entity_hints: [],
      needs_rewrite: false,
      retrieval_policy_id: "policy-profile",
    });

    vi.spyOn(hybridRetriever, "retrieve").mockResolvedValue({
      candidates: [
        {
          id: "chunk-1",
          documentId: "doc-1",
          citationId: "cv_eng:c1",
          sourceId: "cv",
          sourceType: "cv",
          title: "Principal Engineer Experience",
          locale: "en",
          content: "Anas led engineering teams and architected distributed RAG platforms.",
          score: 0.9,
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
        denseLatencyMs: 1,
        sparseLatencyMs: 1,
        fusionLatencyMs: 1,
        totalLatencyMs: 3,
      },
    });

    vi.spyOn(rerankerModule, "getActiveRerankerAdapter").mockResolvedValue({
      modelName: "BAAI/bge-reranker-v2-m3",
      healthCheck: vi.fn().mockResolvedValue(true),
      rerank: vi.fn().mockImplementation(async (_q, c) => ({
        candidates: c,
        telemetry: {
          inputCount: c.length,
          outputCount: c.length,
          modelUsed: "bge-reranker-v2-m3",
          latencyMs: 2,
        },
      })),
    });

    vi.spyOn(contextBuilder, "buildContext").mockResolvedValue({
      formattedContext: "context",
      chunks: [
        {
          id: "chunk-1",
          documentId: "doc-1",
          citationId: "cv_eng:c1",
          sourceId: "cv",
          sourceType: "cv",
          title: "Principal Engineer Experience",
          locale: "en",
          content: "Anas led engineering teams and architected distributed RAG platforms.",
          score: 0.9,
          estimatedTokens: 20,
          rank: 1,
        },
      ],
      availableCitations: [
        {
          citationId: "cv_eng:c1",
          sourceId: "cv",
          sourceType: "cv",
          title: "Principal Engineer Experience",
          locale: "en",
        },
      ],
      telemetry: {
        inputCandidatesCount: 1,
        selectedChunksCount: 1,
        deduplicatedCount: 0,
        perSourceCappedCount: 0,
        budgetExceededCount: 0,
        totalEstimatedTokens: 20,
        maxTokenBudget: 3000,
        uniqueSourcesCount: 1,
        latencyMs: 1,
      },
    });
  });

  it("sanitizes invalid or unknown conversation modes to general", async () => {
    const generateSpy = vi.spyOn(groundedGenerator, "generate").mockResolvedValue({
      content: "General overview answer [cit:cv_eng:c1]",
      rawContent: "raw",
      language: "en",
      conversationMode: "general",
      citations: [
        {
          citationId: "cv_eng:c1",
          sourceId: "cv",
          sourceType: "cv",
          title: "Principal Engineer Experience",
          locale: "en",
          occurrences: 1,
        },
      ],
      validation: {
        isValid: true,
        citedIds: ["cv_eng:c1"],
        validCitedIds: ["cv_eng:c1"],
        invalidCitedIds: [],
        missingRequiredCitations: false,
        cleanedText: "General overview answer",
        citations: [],
        languageConsistent: true,
      },
      hasInsufficientEvidence: false,
      telemetry: {
        modelUsed: "heuristic",
        providerType: "heuristic",
        promptTokens: 50,
        completionTokens: 20,
        totalTokens: 70,
        latencyMs: 1,
        citedSourcesCount: 1,
        hasInsufficientEvidence: false,
        strategy: "fallback",
      },
    });

    const result = await orchestrator.processChat({
      message: "Tell me about Anas",
      conversationMode: "invalid_unsupported_mode" as unknown as ConversationMode,
    });

    expect(result.conversationMode).toBe("general");
    expect(generateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        conversationMode: "general",
      }),
    );
  });

  it("applies recruiter mode and verifies mode validity", async () => {
    const generateSpy = vi.spyOn(groundedGenerator, "generate").mockResolvedValue({
      content: "Based on Anas's verified deliverables: [cit:cv_eng:c1]",
      rawContent: "raw",
      language: "en",
      conversationMode: "recruiter",
      citations: [
        {
          citationId: "cv_eng:c1",
          sourceId: "cv",
          sourceType: "cv",
          title: "Principal Engineer Experience",
          locale: "en",
          occurrences: 1,
        },
      ],
      validation: {
        isValid: true,
        citedIds: ["cv_eng:c1"],
        validCitedIds: ["cv_eng:c1"],
        invalidCitedIds: [],
        missingRequiredCitations: false,
        cleanedText: "Based on Anas's verified deliverables",
        citations: [],
        languageConsistent: true,
      },
      hasInsufficientEvidence: false,
      telemetry: {
        modelUsed: "heuristic",
        providerType: "heuristic",
        promptTokens: 50,
        completionTokens: 20,
        totalTokens: 70,
        latencyMs: 1,
        citedSourcesCount: 1,
        hasInsufficientEvidence: false,
        strategy: "fallback",
      },
    });

    const result = await orchestrator.processChat({
      message: "What is Anas's experience leading teams?",
      conversationMode: "recruiter",
    });

    expect(result.conversationMode).toBe("recruiter");
    expect(generateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        conversationMode: "recruiter",
      }),
    );
  });

  it("applies technical mode for deep architectural inquiries", async () => {
    const generateSpy = vi.spyOn(groundedGenerator, "generate").mockResolvedValue({
      content: "According to verified architectural specifications: [cit:cv_eng:c1]",
      rawContent: "raw",
      language: "en",
      conversationMode: "technical",
      citations: [
        {
          citationId: "cv_eng:c1",
          sourceId: "cv",
          sourceType: "cv",
          title: "Principal Engineer Experience",
          locale: "en",
          occurrences: 1,
        },
      ],
      validation: {
        isValid: true,
        citedIds: ["cv_eng:c1"],
        validCitedIds: ["cv_eng:c1"],
        invalidCitedIds: [],
        missingRequiredCitations: false,
        cleanedText: "According to verified architectural specifications",
        citations: [],
        languageConsistent: true,
      },
      hasInsufficientEvidence: false,
      telemetry: {
        modelUsed: "heuristic",
        providerType: "heuristic",
        promptTokens: 50,
        completionTokens: 20,
        totalTokens: 70,
        latencyMs: 1,
        citedSourcesCount: 1,
        hasInsufficientEvidence: false,
        strategy: "fallback",
      },
    });

    const result = await orchestrator.processChat({
      message: "Explain the RAG architectural trade-offs",
      conversationMode: "technical",
    });

    expect(result.conversationMode).toBe("technical");
    expect(generateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        conversationMode: "technical",
      }),
    );
  });
});
