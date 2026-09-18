import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST as rerankTestRoute } from "@/app/api/admin/ai/rerank/test/route";
import * as serverAuth from "@/modules/auth/infrastructure/server-auth";
import * as rerankerFactory from "@/ai/reranker/factory";

describe("Admin AI Reranker Test Route (/api/admin/ai/rerank/test)", () => {
  const adminHeaders = new Headers({
    authorization: "Bearer admin-mock-token",
  });

  const adminAuthContext: serverAuth.AuthenticatedContext = {
    user: {
      id: "admin-uuid",
      email: "admin@example.com",
      name: "Admin",
    },
    role: "ADMIN",
    session: {
      id: "sess-rerank-test",
      userId: "admin-uuid",
      token: "tok-rerank-test",
      expiresAt: new Date(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects unauthenticated requests with 401", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockRejectedValueOnce(
      new serverAuth.UnauthorizedError("Unauthorized"),
    );

    const req = new NextRequest("http://localhost/api/admin/ai/rerank/test", {
      method: "POST",
      body: JSON.stringify({ query: "test", candidates: [] }),
    });

    const res = await rerankTestRoute(req);
    expect(res.status).toBe(401);
  });

  it("rejects non-admin users with 403", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockRejectedValueOnce(
      new serverAuth.ForbiddenError("Forbidden: Admin role required"),
    );

    const req = new NextRequest("http://localhost/api/admin/ai/rerank/test", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({ query: "test", candidates: [] }),
    });

    const res = await rerankTestRoute(req);
    expect(res.status).toBe(403);
  });

  it("rejects invalid input with 400", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

    const req = new NextRequest("http://localhost/api/admin/ai/rerank/test", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({ query: "" }), // empty query and missing candidates
    });

    const res = await rerankTestRoute(req);
    expect(res.status).toBe(400);
  });

  it("successfully executes reranking on valid candidates", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

    const mockReranker = {
      modelName: "mock-bge-reranker",
      rerank: vi.fn().mockResolvedValue({
        candidates: [
          {
            id: "cand-1",
            documentId: "doc-1",
            citationId: "cite-1",
            content: "Anas built an advanced RAG platform.",
            score: 0.6,
            sourceType: "project",
            sourceId: "proj-1",
            title: "RAG System",
            locale: "en",
            headingHierarchy: ["Overview"],
            tags: ["ai"],
            rerankScore: 0.94,
            rerankRank: 1,
            previousRank: 1,
          },
        ],
        telemetry: {
          inputCandidateCount: 1,
          outputCandidateCount: 1,
          rerankerModel: "mock-bge-reranker",
          provider: "mock_provider",
          strategy: "bge_remote",
          latencyMs: 12,
          fallbackApplied: false,
          topScore: 0.94,
          minScore: 0.94,
        },
      }),
      healthCheck: vi.fn(),
    };

    vi.spyOn(rerankerFactory, "getActiveRerankerAdapter").mockResolvedValue(mockReranker);

    const req = new NextRequest("http://localhost/api/admin/ai/rerank/test", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({
        query: "Anas RAG platform",
        candidates: [
          {
            id: "cand-1",
            content: "Anas built an advanced RAG platform.",
            score: 0.6,
            title: "RAG System",
            sourceType: "project",
          },
        ],
        topN: 5,
        minThreshold: 0.3,
      }),
    });

    const res = await rerankTestRoute(req);
    expect(res.status).toBe(200);

    const body = (await res.json()) as { success: boolean; result: { candidates: unknown[] } };
    expect(body.success).toBe(true);
    expect(body.result.candidates.length).toBe(1);
    expect(mockReranker.rerank).toHaveBeenCalledWith(
      "Anas RAG platform",
      expect.any(Array),
      expect.objectContaining({ topN: 5, minThreshold: 0.3 }),
    );
  });
});
