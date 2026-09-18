import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST as routerTestRoute } from "@/app/api/admin/ai/router/test/route";
import * as serverAuth from "@/modules/auth/infrastructure/server-auth";

describe("Admin AI Router Test Route (/api/admin/ai/router/test)", () => {
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
      id: "sess-router-test",
      userId: "admin-uuid",
      token: "tok-router-test",
      expiresAt: new Date(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects unauthorized calls with 401", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockRejectedValueOnce(
      new serverAuth.UnauthorizedError("Unauthorized"),
    );

    const req = new NextRequest("http://localhost/api/admin/ai/router/test", {
      method: "POST",
      body: JSON.stringify({ query: "test query" }),
    });

    const res = await routerTestRoute(req);
    expect(res.status).toBe(401);
  });

  it("rejects non-admin calls with 403", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockRejectedValueOnce(
      new serverAuth.ForbiddenError("Forbidden: Admin role required"),
    );

    const req = new NextRequest("http://localhost/api/admin/ai/router/test", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({ query: "test query" }),
    });

    const res = await routerTestRoute(req);
    expect(res.status).toBe(403);
  });

  it("rejects invalid input with 400", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

    const req = new NextRequest("http://localhost/api/admin/ai/router/test", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({ query: "" }),
    });

    const res = await routerTestRoute(req);
    expect(res.status).toBe(400);
  });

  it("routes queries successfully and returns route output with policy", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

    const req = new NextRequest("http://localhost/api/admin/ai/router/test", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({ query: "What projects did Anas build in AI?" }),
    });

    const res = await routerTestRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.query).toBe("What projects did Anas build in AI?");
    expect(data.result.route_id).toBe("project");
    expect(data.result.policy).toBeDefined();
    expect(data.result.policy.id).toBe("policy-project");
  });
});
