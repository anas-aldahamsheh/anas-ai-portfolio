import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST as contextTestRoute } from "@/app/api/admin/ai/context/test/route";
import * as serverAuth from "@/modules/auth/infrastructure/server-auth";

describe("Admin AI Context Builder Test Route (/api/admin/ai/context/test)", () => {
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
      id: "sess-ctx-test",
      userId: "admin-uuid",
      token: "tok-ctx-test",
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

    const req = new NextRequest("http://localhost/api/admin/ai/context/test", {
      method: "POST",
      body: JSON.stringify({ candidates: [] }),
    });

    const res = await contextTestRoute(req);
    expect(res.status).toBe(401);
  });

  it("rejects non-admin users with 403", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockRejectedValueOnce(
      new serverAuth.ForbiddenError("Forbidden: Admin role required"),
    );

    const req = new NextRequest("http://localhost/api/admin/ai/context/test", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({ candidates: [] }),
    });

    const res = await contextTestRoute(req);
    expect(res.status).toBe(403);
  });

  it("rejects invalid input with 400", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

    const req = new NextRequest("http://localhost/api/admin/ai/context/test", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({ candidates: [] }), // min(1) required
    });

    const res = await contextTestRoute(req);
    expect(res.status).toBe(400);
  });

  it("successfully builds context and returns formatted result for admin", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

    const req = new NextRequest("http://localhost/api/admin/ai/context/test", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({
        candidates: [
          {
            id: "cand-1",
            content: "Anas is an expert in RAG and Agentic AI workflows.",
            score: 0.9,
            title: "AI Workflows",
            sourceType: "project",
          },
        ],
        options: {
          maxTokens: 500,
          maxChunks: 3,
        },
      }),
    });

    const res = await contextTestRoute(req);
    expect(res.status).toBe(200);

    const data = (await res.json()) as {
      success: boolean;
      result: {
        formattedContext: string;
        chunks: unknown[];
        availableCitations: unknown[];
        telemetry: { selectedChunksCount: number };
      };
    };

    expect(data.success).toBe(true);
    expect(data.result.formattedContext).toContain("<retrieved_context>");
    expect(data.result.chunks.length).toBe(1);
    expect(data.result.availableCitations.length).toBe(1);
    expect(data.result.telemetry.selectedChunksCount).toBe(1);
  });
});
