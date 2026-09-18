import { describe, it, expect, vi, beforeEach } from "vitest";
import { RagDebugRequestSchema, RagDebugTelemetry } from "@/ai/contracts/rag-debug";
import { ChatOrchestrator } from "@/ai/orchestration/chat-orchestrator";
import { languageResolver } from "@/ai/language";
import { queryRouter } from "@/ai/router";
import { queryRewriter } from "@/ai/query-rewrite";
import { hybridRetriever } from "@/ai/retrieval";
import { contextBuilder } from "@/ai/context";
import { groundedGenerator } from "@/ai/generation";
import * as rerankerModule from "@/ai/reranker";

describe("RAG Debug Contracts & Telemetry Unit Tests (F036)", () => {
  describe("RagDebugRequestSchema validation", () => {
    it("validates valid query and defaults mode and locale", () => {
      const parsed = RagDebugRequestSchema.safeParse({
        query: "What is your experience with Next.js and TypeScript?",
      });
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.query).toBe("What is your experience with Next.js and TypeScript?");
        expect(parsed.data.mode).toBe("general");
        expect(parsed.data.locale).toBe("en");
        expect(parsed.data.projectScopeId).toBeUndefined();
      }
    });

    it("accepts custom mode, locale, and projectScopeId", () => {
      const parsed = RagDebugRequestSchema.safeParse({
        query: "كيف يعمل البحث الهجين؟",
        mode: "technical",
        locale: "ar",
        projectScopeId: "proj-123",
      });
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.query).toBe("كيف يعمل البحث الهجين؟");
        expect(parsed.data.mode).toBe("technical");
        expect(parsed.data.locale).toBe("ar");
        expect(parsed.data.projectScopeId).toBe("proj-123");
      }
    });

    it("rejects empty or whitespace query", () => {
      const parsed = RagDebugRequestSchema.safeParse({
        query: "",
      });
      expect(parsed.success).toBe(false);
    });

    it("rejects query exceeding 1000 characters", () => {
      const parsed = RagDebugRequestSchema.safeParse({
        query: "a".repeat(1001),
      });
      expect(parsed.success).toBe(false);
    });

    it("rejects invalid conversation mode", () => {
      const parsed = RagDebugRequestSchema.safeParse({
        query: "test query",
        mode: "invalid_mode" as unknown as "general",
      });
      expect(parsed.success).toBe(false);
    });
  });

  describe("ChatOrchestrator Telemetry Generation", () => {
    let orchestrator: ChatOrchestrator;

    beforeEach(() => {
      orchestrator = new ChatOrchestrator();
      vi.restoreAllMocks();

      vi.spyOn(languageResolver, "resolveLanguage").mockResolvedValue({
        language: "en",
        direction: "ltr",
        confidence: 0.95,
        strategy: "script_heuristic",
        hasExplicitOverride: false,
        reason: "English",
      });

      vi.spyOn(queryRouter, "route").mockResolvedValue({
        route_id: "broad_portfolio",
        confidence: 0.9,
        entity_hints: [],
        needs_rewrite: true,
        retrieval_policy_id: "policy-broad",
      });

      vi.spyOn(queryRewriter, "rewrite").mockResolvedValue({
        originalQuery: "Tell me about your portfolio architecture",
        rewrittenQueries: ["Tell me about your portfolio architecture", "Portfolio technical stack"],
        wasRewritten: true,
        strategy: "heuristic",
        latencyMs: 5,
      });

      vi.spyOn(hybridRetriever, "retrieve").mockResolvedValue({
        candidates: [
          {
            id: "chunk-1",
            documentId: "doc-1",
            citationId: "cit:proj-arch:c1",
            sourceId: "proj-arch",
            sourceType: "project",
            title: "Portfolio Architecture",
            locale: "en",
            content: "Modular Next.js and Drizzle ORM architecture with high performance.",
            score: 0.92,
            headingHierarchy: [],
            tags: ["architecture"],
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

      vi.spyOn(contextBuilder, "buildContext").mockResolvedValue({
        formattedContext: "<retrieved_context>...</retrieved_context>",
        chunks: [
          {
            id: "chunk-1",
            documentId: "doc-1",
            citationId: "cit:proj-arch:c1",
            sourceId: "proj-arch",
            sourceType: "project",
            title: "Portfolio Architecture",
            locale: "en",
            content: "Modular Next.js and Drizzle ORM architecture with high performance.",
            score: 0.92,
            estimatedTokens: 30,
            rank: 1,
          },
        ],
        availableCitations: [
          {
            citationId: "cit:proj-arch:c1",
            sourceId: "proj-arch",
            sourceType: "project",
            title: "Portfolio Architecture",
            locale: "en",
          },
        ],
        telemetry: {
          inputCandidatesCount: 1,
          selectedChunksCount: 1,
          deduplicatedCount: 0,
          perSourceCappedCount: 0,
          budgetExceededCount: 0,
          totalEstimatedTokens: 30,
          maxTokenBudget: 3000,
          uniqueSourcesCount: 1,
          latencyMs: 2,
        },
      });

      vi.spyOn(groundedGenerator, "generate").mockResolvedValue({
        content: "The portfolio is built with Next.js and TypeScript [cit:cit:proj-arch:c1].",
        rawContent: "The portfolio is built with Next.js and TypeScript [cit:cit:proj-arch:c1].",
        language: "en",
        conversationMode: "general",
        citations: [
          {
            citationId: "cit:proj-arch:c1",
            sourceId: "proj-arch",
            sourceType: "project",
            title: "Portfolio Architecture",
            locale: "en",
            occurrences: 1,
          },
        ],
        validation: {
          isValid: true,
          citedIds: ["cit:proj-arch:c1"],
          validCitedIds: ["cit:proj-arch:c1"],
          invalidCitedIds: [],
          missingRequiredCitations: false,
          cleanedText: "The portfolio is built with Next.js and TypeScript.",
          citations: [],
          languageConsistent: true,
        },
        hasInsufficientEvidence: false,
        telemetry: {
          modelUsed: "gpt-4o-mini",
          providerType: "openai_compatible",
          promptTokens: 100,
          completionTokens: 25,
          totalTokens: 125,
          latencyMs: 15,
          citedSourcesCount: 1,
          hasInsufficientEvidence: false,
          strategy: "llm",
        },
      });
    });

    it("generates comprehensive telemetry with positive stage latencies", async () => {
      const result = await orchestrator.processChat({
        message: "Tell me about your portfolio architecture",
        conversationMode: "general",
        conversationLocale: "en",
        isAdmin: false,
      });

      expect(result).toBeDefined();
      expect(result.telemetry).toBeDefined();

      const telemetry: RagDebugTelemetry = result.telemetry;
      expect(telemetry.routeId).toBe("broad_portfolio");
      expect(telemetry.routeLabel).toBe("General Portfolio Inquiry");
      expect(telemetry.language).toBe("en");
      expect(telemetry.direction).toBe("ltr");
      expect(telemetry.conversationMode).toBe("general");
      expect(telemetry.retrievalMethod).toBe("hybrid");
      expect(typeof telemetry.retrievedCount).toBe("number");
      expect(typeof telemetry.rerankedCount).toBe("number");
      expect(typeof telemetry.selectedChunksCount).toBe("number");
      expect(typeof telemetry.tokenCount).toBe("number");
      expect(telemetry.modelId).toBe("gpt-4o-mini");
      expect(telemetry.providerType).toBe("openai_compatible");

      // Latency waterfall checks
      expect(telemetry.latencies).toBeDefined();
      expect(telemetry.latencies.routingMs).toBeGreaterThanOrEqual(0);
      expect(telemetry.latencies.rewriteMs).toBeGreaterThanOrEqual(0);
      expect(telemetry.latencies.retrievalMs).toBeGreaterThanOrEqual(0);
      expect(telemetry.latencies.rerankingMs).toBeGreaterThanOrEqual(0);
      expect(telemetry.latencies.contextMs).toBeGreaterThanOrEqual(0);
      expect(telemetry.latencies.generationMs).toBeGreaterThanOrEqual(0);
      expect(telemetry.latencies.totalMs).toBeGreaterThanOrEqual(0);

      // Sources & validation state
      expect(Array.isArray(telemetry.sources)).toBe(true);
      expect(telemetry.sources.length).toBe(1);
      expect(telemetry.sources[0]?.id).toBe("chunk-1");
      expect(telemetry.sources[0]?.title).toBe("Portfolio Architecture");
      expect(telemetry.validationState).toBeDefined();
      expect(telemetry.validationState.isValid).toBe(true);
      expect(telemetry.validationState.citationsCount).toBe(1);
      expect(telemetry.validationState.ungroundedCount).toBe(0);

      // Non-admin view by default
      expect(telemetry.isAdminView).toBe(false);
    });

    it("correctly sets isAdminView flag for admin requests", async () => {
      const result = await orchestrator.processChat({
        message: "Admin verification query",
        conversationMode: "technical",
        conversationLocale: "en",
        isAdmin: true,
      });

      expect(result.telemetry.isAdminView).toBe(true);
      expect(result.telemetry.conversationMode).toBe("technical");
    });

    it("guarantees zero secret leakage and zero CoT exposure in telemetry", async () => {
      const result = await orchestrator.processChat({
        message: "Explain the security of API keys and embeddings",
        conversationMode: "general",
        conversationLocale: "en",
      });

      const serializedTelemetry = JSON.stringify(result.telemetry);

      // Verify no secret patterns in telemetry
      expect(serializedTelemetry).not.toMatch(/sk-[a-zA-Z0-9]{15,}/);
      expect(serializedTelemetry).not.toMatch(/Bearer\s+[a-zA-Z0-9_-]+/i);
      expect(serializedTelemetry).not.toMatch(/system_prompt/i);
      expect(serializedTelemetry).not.toMatch(/api_key/i);

      // Verify no chain-of-thought tokens
      expect(serializedTelemetry).not.toContain("<think>");
      expect(serializedTelemetry).not.toContain("</think>");

      // Verify snippet lengths are safely bound
      for (const src of result.telemetry.sources) {
        if (src.snippet) {
          expect(src.snippet.length).toBeLessThanOrEqual(200);
        }
      }
    });

    it("correctly formats project-scoped telemetry", async () => {
      vi.spyOn(queryRouter, "route").mockResolvedValue({
        route_id: "project",
        confidence: 1.0,
        entity_hints: [],
        needs_rewrite: false,
        retrieval_policy_id: "policy-project",
      });

      const result = await orchestrator.processChat({
        message: "What tech stack does this project use?",
        conversationMode: "technical",
        conversationLocale: "en",
        projectScopeId: "proj-ecommerce",
        projectScopeTitle: "E-Commerce System",
      });

      expect(result.telemetry.isScopedRetrieval).toBe(true);
      expect(result.telemetry.projectScopeId).toBe("proj-ecommerce");
      expect(result.telemetry.routeId).toBe("project");
      expect(result.telemetry.routeLabel).toContain("Project Scope");
    });
  });
});
