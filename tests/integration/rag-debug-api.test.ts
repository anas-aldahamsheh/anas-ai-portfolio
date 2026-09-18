import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST as ragDebugRoute } from "@/app/api/admin/rag/debug/route";
import * as serverAuth from "@/modules/auth/infrastructure/server-auth";
import { chatOrchestrator } from "@/ai/orchestration/chat-orchestrator";

describe("Admin RAG Debug API Route (/api/admin/rag/debug)", () => {
  const adminHeaders = new Headers({
    authorization: "Bearer admin-mock-token",
    "content-type": "application/json",
  });

  const adminAuthContext: serverAuth.AuthenticatedContext = {
    user: {
      id: "admin-uuid",
      email: "admin@example.com",
      name: "Admin",
    },
    role: "ADMIN",
    session: {
      id: "sess-rag-debug",
      userId: "admin-uuid",
      token: "tok-rag-debug",
      expiresAt: new Date(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects unauthorized requests with 401", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockRejectedValueOnce(
      new serverAuth.UnauthorizedError("Unauthorized"),
    );

    const req = new NextRequest("http://localhost/api/admin/rag/debug", {
      method: "POST",
      body: JSON.stringify({ query: "test query" }),
    });

    const res = await ragDebugRoute(req);
    expect(res.status).toBe(401);
  });

  it("rejects non-admin users with 403", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockRejectedValueOnce(
      new serverAuth.ForbiddenError("Forbidden: Admin role required"),
    );

    const req = new NextRequest("http://localhost/api/admin/rag/debug", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({ query: "test query" }),
    });

    const res = await ragDebugRoute(req);
    expect(res.status).toBe(403);
  });

  it("rejects invalid JSON request body with 400", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

    const req = new NextRequest("http://localhost/api/admin/rag/debug", {
      method: "POST",
      headers: adminHeaders,
      body: "invalid-json-body",
    });

    const res = await ragDebugRoute(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid JSON request body");
  });

  it("rejects invalid payload failing Zod validation with 400", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

    const req = new NextRequest("http://localhost/api/admin/rag/debug", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({ query: "" }), // empty query
    });

    const res = await ragDebugRoute(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Validation failed");
  });

  it("executes RAG debug trace with isAdmin=true and returns telemetry", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);
    const chatSpy = vi.spyOn(chatOrchestrator, "processChat").mockResolvedValueOnce({
      answer: "Anas deployed BGE-M3 and BAAI reranker.",
      language: "en",
      direction: "ltr",
      conversationMode: "technical",
      citations: [],
      hasInsufficientEvidence: false,
      telemetry: {
        routeId: "technical",
        routeLabel: "Deep Technical Deep Dive",
        language: "en",
        direction: "ltr",
        conversationMode: "technical",
        rewriteCount: 1,
        retrievalMethod: "hybrid",
        retrievedCount: 10,
        rerankedCount: 5,
        selectedChunksCount: 3,
        tokenCount: 1200,
        modelId: "gpt-4o-mini",
        providerType: "openai_compatible",
        latencies: {
          routingMs: 5,
          rewriteMs: 10,
          retrievalMs: 25,
          rerankingMs: 20,
          contextMs: 5,
          generationMs: 80,
          totalMs: 145,
        },
        sources: [
          {
            id: "src-1",
            title: "Deployed Models",
            sourceType: "project",
            score: 0.95,
            snippet: "BGE-M3 deployed for dense multilingual embeddings.",
          },
        ],
        validationState: {
          isValid: true,
          citationsCount: 0,
          ungroundedCount: 0,
        },
        isAdminView: true,
        generationLatencyMs: 80,
        totalLatencyMs: 145,
        strategy: "llm",
        isScopedRetrieval: false,
      },
    });

    const req = new NextRequest("http://localhost/api/admin/rag/debug", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({
        query: "What machine learning models are deployed?",
        mode: "technical",
        locale: "en",
      }),
    });

    const res = await ragDebugRoute(req);
    expect(res.status).toBe(200);

    expect(chatSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "What machine learning models are deployed?",
        conversationMode: "technical",
        conversationLocale: "en",
        isAdmin: true,
      }),
    );

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toBeDefined();
    expect(json.data.answer).toBe("Anas deployed BGE-M3 and BAAI reranker.");
    expect(json.data.telemetry).toBeDefined();
    expect(json.data.telemetry.isAdminView).toBe(true);
    expect(json.data.telemetry.conversationMode).toBe("technical");
    expect(json.data.telemetry.latencies).toBeDefined();
    expect(json.data.telemetry.latencies.totalMs).toBe(145);
    expect(Array.isArray(json.data.telemetry.sources)).toBe(true);
  });
});
