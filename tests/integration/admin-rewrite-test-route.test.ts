import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST as rewriteTestRoute } from "@/app/api/admin/ai/rewrite/test/route";
import * as serverAuth from "@/modules/auth/infrastructure/server-auth";
import { queryRewriter } from "@/ai/query-rewrite";

vi.mock("@/ai/query-rewrite", () => ({
  queryRewriter: {
    rewrite: vi.fn(),
  },
}));

describe("Admin AI Query Rewrite Test Route (/api/admin/ai/rewrite/test)", () => {
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
      id: "sess-rewrite-test",
      userId: "admin-uuid",
      token: "tok-rewrite-test",
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

    const req = new NextRequest("http://localhost/api/admin/ai/rewrite/test", {
      method: "POST",
      body: JSON.stringify({ userMessage: "test" }),
    });

    const res = await rewriteTestRoute(req);
    expect(res.status).toBe(401);
  });

  it("rejects non-admin users with 403", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockRejectedValueOnce(
      new serverAuth.ForbiddenError("Forbidden: Admin role required"),
    );

    const req = new NextRequest("http://localhost/api/admin/ai/rewrite/test", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({ userMessage: "test" }),
    });

    const res = await rewriteTestRoute(req);
    expect(res.status).toBe(403);
  });

  it("rejects invalid input with 400", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

    const req = new NextRequest("http://localhost/api/admin/ai/rewrite/test", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({ userMessage: "" }), // empty user message
    });

    const res = await rewriteTestRoute(req);
    expect(res.status).toBe(400);
  });

  it("processes query rewrite successfully and returns results", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);
    vi.mocked(queryRewriter.rewrite).mockResolvedValueOnce({
      originalQuery: "What AI projects did Anas build with Qdrant?",
      rewrittenQueries: [
        "What AI projects did Anas build with Qdrant?",
        "Anas Qdrant projects",
        "Qdrant vector database portfolio",
      ],
      wasRewritten: true,
      strategy: "llm",
      latencyMs: 12,
    });

    const req = new NextRequest("http://localhost/api/admin/ai/rewrite/test", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({
        userMessage: "What AI projects did Anas build with Qdrant?",
        language: "en",
        currentScope: "portfolio",
        maxQueries: 3,
      }),
    });

    const res = await rewriteTestRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.result).toBeDefined();
    expect(data.result.originalQuery).toBe("What AI projects did Anas build with Qdrant?");
    expect(data.result.rewrittenQueries).toBeInstanceOf(Array);
    expect(data.result.rewrittenQueries.length).toBeGreaterThan(0);
  });
});
