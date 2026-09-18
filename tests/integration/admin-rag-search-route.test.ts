import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST as searchRoute } from "@/app/api/admin/rag/search/route";
import { hybridRetriever } from "@/ai/retrieval";
import * as serverAuth from "@/modules/auth/infrastructure/server-auth";
import type { HybridRetrievalResult } from "@/ai/contracts/retrieval";

vi.mock("@/ai/retrieval", () => ({
  hybridRetriever: {
    retrieve: vi.fn(),
  },
}));

describe("Admin RAG Search Route (/api/admin/rag/search)", () => {
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
      id: "sess-rag-search",
      userId: "admin-uuid",
      token: "tok-rag-search",
      expiresAt: new Date(),
    },
  };

  const mockRetrievalResult: HybridRetrievalResult = {
    candidates: [
      {
        id: "chunk-1",
        documentId: "doc-1",
        citationId: "cit:project:proj-1:0",
        content: "High performance AI platform",
        score: 0.032,
        sourceType: "project",
        sourceId: "proj-1",
        title: "AI Platform",
        locale: "en",
        headingHierarchy: [],
        tags: ["ai"],
        retrieverType: "hybrid",
        rank: 1,
      },
    ],
    telemetry: {
      denseCandidateCount: 5,
      sparseCandidateCount: 5,
      fusedCandidateCount: 1,
      denseLatencyMs: 12,
      sparseLatencyMs: 8,
      fusionLatencyMs: 2,
      totalLatencyMs: 22,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects unauthorized requests with 401", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockRejectedValueOnce(
      new serverAuth.UnauthorizedError("Unauthorized"),
    );

    const req = new NextRequest("http://localhost/api/admin/rag/search", {
      method: "POST",
      body: JSON.stringify({ query: "test" }),
    });

    const res = await searchRoute(req);
    expect(res.status).toBe(401);
  });

  it("rejects non-admin users with 403", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockRejectedValueOnce(
      new serverAuth.ForbiddenError("Forbidden: Admin role required"),
    );

    const req = new NextRequest("http://localhost/api/admin/rag/search", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({ query: "test" }),
    });

    const res = await searchRoute(req);
    expect(res.status).toBe(403);
  });

  it("rejects invalid search payloads with 400", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

    const req = new NextRequest("http://localhost/api/admin/rag/search", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({ query: "" }), // empty query
    });

    const res = await searchRoute(req);
    expect(res.status).toBe(400);
  });

  it("executes hybrid search and returns candidates and telemetry", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);
    vi.mocked(hybridRetriever.retrieve).mockResolvedValue(mockRetrievalResult);

    const req = new NextRequest("http://localhost/api/admin/rag/search", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({
        query: "What are Anas's projects?",
        mode: "hybrid",
        locale: "en",
        topK: 10,
      }),
    });

    const res = await searchRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.query).toBe("What are Anas's projects?");
    expect(data.mode).toBe("hybrid");
    expect(data.candidates).toHaveLength(1);
    expect(data.telemetry.fusedCandidateCount).toBe(1);
  });
});
