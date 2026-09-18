import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST as postAdminEvaluationRunRoute } from "@/app/api/admin/evaluation/run/route";
import * as serverAuth from "@/modules/auth/infrastructure/server-auth";
import { db } from "@/lib/db/client";

describe("AI Evaluation Runner API Route (F038)", () => {
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
      id: "sess-eval-runner-test",
      userId: "admin-uuid",
      token: "tok-eval-runner-test",
      expiresAt: new Date(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock DB insert
    vi.spyOn(db, "insert").mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: "mock-run-id" }]),
      }),
    } as unknown as ReturnType<typeof db.insert>);
  });

  it("returns 401 when request is unauthenticated", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockRejectedValue(
      new serverAuth.UnauthorizedError("Unauthorized"),
    );

    const req = new NextRequest("http://localhost:3000/api/admin/evaluation/run", {
      method: "POST",
      body: JSON.stringify({ mode: "full" }),
    });

    const res = await postAdminEvaluationRunRoute(req);
    expect(res.status).toBe(401);
  });

  it("returns 403 when user is not an admin", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockRejectedValue(
      new serverAuth.ForbiddenError("Forbidden: Admin access required"),
    );

    const req = new NextRequest("http://localhost:3000/api/admin/evaluation/run", {
      method: "POST",
      body: JSON.stringify({ mode: "full" }),
    });

    const res = await postAdminEvaluationRunRoute(req);
    expect(res.status).toBe(403);
  });

  it("returns 400 when request body contains invalid mode", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

    const req = new NextRequest("http://localhost:3000/api/admin/evaluation/run", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({ mode: "invalid_mode" }),
    });

    const res = await postAdminEvaluationRunRoute(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toContain("Invalid evaluation run request");
  });

  it("returns 200 with run summary and gate verdict when admin executes suite", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

    const req = new NextRequest("http://localhost:3000/api/admin/evaluation/run", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({ mode: "retrieval", maxCases: 4 }),
    });

    const res = await postAdminEvaluationRunRoute(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.run).toBeDefined();
    expect(json.data.run.totalCases).toBe(4);
    expect(json.data.gate).toBeDefined();
    expect(["PASSED", "WARNING", "BLOCKED"]).toContain(json.data.gate.verdict);
    expect(json.data.caseResults.length).toBe(4);
  });
});
