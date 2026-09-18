import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST as languageTestRoute } from "@/app/api/admin/ai/language/test/route";
import * as serverAuth from "@/modules/auth/infrastructure/server-auth";

describe("Admin AI Language Resolution Test Route (/api/admin/ai/language/test)", () => {
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
      id: "sess-lang-test",
      userId: "admin-uuid",
      token: "tok-lang-test",
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

    const req = new NextRequest("http://localhost/api/admin/ai/language/test", {
      method: "POST",
      body: JSON.stringify({ message: "Hello" }),
    });

    const res = await languageTestRoute(req);
    expect(res.status).toBe(401);
  });

  it("rejects non-admin users with 403", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockRejectedValueOnce(
      new serverAuth.ForbiddenError("Forbidden: Admin role required"),
    );

    const req = new NextRequest("http://localhost/api/admin/ai/language/test", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({ message: "Hello" }),
    });

    const res = await languageTestRoute(req);
    expect(res.status).toBe(403);
  });

  it("rejects invalid input with 400", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

    const req = new NextRequest("http://localhost/api/admin/ai/language/test", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({
        // message is missing
        conversationLocale: "invalid-locale",
      }),
    });

    const res = await languageTestRoute(req);
    expect(res.status).toBe(400);

    const json = (await res.json()) as { error: string };
    expect(json.error).toBe("Invalid test input");
  });

  it("successfully resolves language and returns structured result", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

    const req = new NextRequest("http://localhost/api/admin/ai/language/test", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({
        message: "ما هي مهارات أنس الهندسية؟",
        conversationLocale: "en",
      }),
    });

    const res = await languageTestRoute(req);
    expect(res.status).toBe(200);

    const json = (await res.json()) as {
      success: boolean;
      result: {
        language: string;
        direction: string;
        confidence: number;
        strategy: string;
      };
    };

    expect(json.success).toBe(true);
    expect(json.result.language).toBe("ar");
    expect(json.result.direction).toBe("rtl");
    expect(json.result.strategy).toBe("script_heuristic");
  });
});
