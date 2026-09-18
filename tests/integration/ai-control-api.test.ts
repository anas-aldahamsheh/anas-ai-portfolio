import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET as getOverviewRoute } from "@/app/api/admin/ai/control/overview/route";
import { POST as postValidateRoute } from "@/app/api/admin/ai/control/validate/route";
import * as serverAuth from "@/modules/auth/infrastructure/server-auth";

describe("AI Control Center API Routes (F040)", () => {
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
      id: "sess-ai-control-test",
      userId: "admin-uuid",
      token: "tok-ai-control-test",
      expiresAt: new Date(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/admin/ai/control/overview", () => {
    it("returns 401 when unauthenticated", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockRejectedValue(
        new serverAuth.UnauthorizedError("Unauthorized"),
      );

      const req = new NextRequest("http://localhost:3000/api/admin/ai/control/overview");
      const res = await getOverviewRoute(req);
      expect(res.status).toBe(401);
    });

    it("returns 403 when user lacks admin role", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockRejectedValue(
        new serverAuth.ForbiddenError("Forbidden: Admin role required"),
      );

      const req = new NextRequest("http://localhost:3000/api/admin/ai/control/overview");
      const res = await getOverviewRoute(req);
      expect(res.status).toBe(403);
    });

    it("returns 200 with complete AI overview when admin", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

      const req = new NextRequest("http://localhost:3000/api/admin/ai/control/overview", {
        headers: adminHeaders,
      });

      const res = await getOverviewRoute(req);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data).toBeDefined();
      expect(body.data.subsystemHealth).toBeDefined();
      expect(body.data.activeBindings).toHaveLength(6);
      expect(body.data.ragConfig).toBeDefined();
    });
  });

  describe("POST /api/admin/ai/control/validate", () => {
    it("returns 401 when unauthenticated", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockRejectedValue(
        new serverAuth.UnauthorizedError("Unauthorized"),
      );

      const req = new NextRequest("http://localhost:3000/api/admin/ai/control/validate", {
        method: "POST",
        body: JSON.stringify({ changeType: "assignment" }),
      });

      const res = await postValidateRoute(req);
      expect(res.status).toBe(401);
    });

    it("returns 400 for invalid JSON payload", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

      const req = new NextRequest("http://localhost:3000/api/admin/ai/control/validate", {
        method: "POST",
        headers: adminHeaders,
        body: "invalid-not-json",
      });

      const res = await postValidateRoute(req);
      expect(res.status).toBe(400);
    });

    it("returns 400 for schema validation failure", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

      const req = new NextRequest("http://localhost:3000/api/admin/ai/control/validate", {
        method: "POST",
        headers: adminHeaders,
        body: JSON.stringify({ changeType: "unrecognized_type" }),
      });

      const res = await postValidateRoute(req);
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toContain("Validation failed");
    });

    it("returns 200 with validation decision for valid change request", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

      const req = new NextRequest("http://localhost:3000/api/admin/ai/control/validate", {
        method: "POST",
        headers: adminHeaders,
        body: JSON.stringify({
          changeType: "assignment",
          capability: "generation",
          modelId: "mod-gpt4o-1",
        }),
      });

      const res = await postValidateRoute(req);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.validation).toBeDefined();
      expect(body.validation.recommendedGateSuite).toBe("generation");
    });
  });
});
