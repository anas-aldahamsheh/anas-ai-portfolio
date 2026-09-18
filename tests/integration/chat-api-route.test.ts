import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST as chatRoute } from "@/app/api/chat/route";
import { chatOrchestrator } from "@/ai/orchestration/chat-orchestrator";

vi.mock("@/ai/orchestration/chat-orchestrator", () => ({
  chatOrchestrator: {
    processChat: vi.fn(),
  },
}));

describe("Public Chat API Route (/api/chat)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects invalid request with 400 when message is missing or empty", async () => {
    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: "" }),
    });

    const res = await chatRoute(req);
    expect(res.status).toBe(400);

    const json = (await res.json()) as { error: string };
    expect(json.error).toBe("Invalid request payload");
  });

  it("successfully processes JSON chat request and returns structured answer", async () => {
    vi.spyOn(chatOrchestrator, "processChat").mockResolvedValueOnce({
      answer: "Anas is an AI and full-stack software engineer [cit:proj_1:c1].",
      language: "en",
      direction: "ltr",
      conversationMode: "general",
      citations: [
        {
          citationId: "proj_1:c1",
          sourceId: "proj-1",
          sourceType: "project",
          title: "AI Portfolio Platform",
          locale: "en",
          occurrences: 1,
        },
      ],
      hasInsufficientEvidence: false,
      telemetry: {
        routeId: "profile",
        routeLabel: "General Portfolio Inquiry",
        language: "en",
        direction: "ltr",
        conversationMode: "general",
        rewriteCount: 1,
        retrievalMethod: "hybrid",
        retrievedCount: 5,
        rerankedCount: 3,
        selectedChunksCount: 2,
        tokenCount: 150,
        modelId: "gpt-4o-mini",
        providerType: "openai_compatible",
        latencies: {
          routingMs: 2,
          rewriteMs: 3,
          retrievalMs: 5,
          rerankingMs: 5,
          contextMs: 2,
          generationMs: 20,
          totalMs: 35,
        },
        sources: [],
        validationState: {
          isValid: true,
          citationsCount: 1,
          ungroundedCount: 0,
        },
        isAdminView: false,
        generationLatencyMs: 20,
        totalLatencyMs: 35,
        strategy: "llm",
        isScopedRetrieval: false,
      },
    });

    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({
        message: "Tell me about Anas's background",
        mode: "general",
        stream: false,
      }),
    });

    const res = await chatRoute(req);
    expect(res.status).toBe(200);

    const json = (await res.json()) as {
      success: boolean;
      result: {
        answer: string;
        citations: Array<{ citationId: string }>;
        telemetry: { routeId: string };
      };
    };

    expect(json.success).toBe(true);
    expect(json.result.answer).toContain("[cit:proj_1:c1]");
    expect(json.result.citations).toHaveLength(1);
    expect(json.result.telemetry.routeId).toBe("profile");
  });

  it("handles SSE streaming requests returning text/event-stream content type", async () => {
    vi.spyOn(chatOrchestrator, "processChat").mockResolvedValueOnce({
      answer: "Streamed answer chunk test.",
      language: "en",
      direction: "ltr",
      conversationMode: "general",
      citations: [],
      hasInsufficientEvidence: false,
      telemetry: {
        routeId: "broad_portfolio",
        routeLabel: "General Portfolio Inquiry",
        language: "en",
        direction: "ltr",
        conversationMode: "general",
        rewriteCount: 0,
        retrievalMethod: "hybrid",
        retrievedCount: 1,
        rerankedCount: 1,
        selectedChunksCount: 1,
        tokenCount: 50,
        modelId: "gpt-4o-mini",
        providerType: "openai_compatible",
        latencies: {
          routingMs: 1,
          rewriteMs: 1,
          retrievalMs: 3,
          rerankingMs: 2,
          contextMs: 1,
          generationMs: 10,
          totalMs: 20,
        },
        sources: [],
        validationState: {
          isValid: true,
          citationsCount: 0,
          ungroundedCount: 0,
        },
        isAdminView: false,
        generationLatencyMs: 10,
        totalLatencyMs: 20,
        strategy: "fallback",
        isScopedRetrieval: false,
      },
    });

    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({
        message: "Stream this answer",
        stream: true,
      }),
    });

    const res = await chatRoute(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/event-stream");

    const text = await res.text();
    expect(text).toContain("event: meta");
    expect(text).toContain("event: token");
    expect(text).toContain("event: citations");
    expect(text).toContain("event: done");
  });
});
