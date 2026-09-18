import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET as getAdminFlagsRoute } from "@/app/api/admin/feature-flags/route";
import { PATCH as patchAdminFlagRoute } from "@/app/api/admin/feature-flags/[key]/route";
import { GET as getPublicEvalRoute } from "@/app/api/feature-flags/eval/route";
import * as serverAuth from "@/modules/auth/infrastructure/server-auth";
import { featureFlagService } from "@/modules/admin/infrastructure/feature-flag-service";

describe("Feature Flags API Routes (F042)", () => {
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
      id: "sess-flags-test",
      userId: "admin-uuid",
      token: "tok-flags-test",
      expiresAt: new Date(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    featureFlagService.resetInMemoryOverrides();
  });

  describe("GET /api/admin/feature-flags", () => {
    it("returns 401 when unauthenticated", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockRejectedValue(
        new serverAuth.UnauthorizedError("Unauthorized"),
      );

      const req = new NextRequest("http://localhost:3000/api/admin/feature-flags");
      const res = await getAdminFlagsRoute(req);
      expect(res.status).toBe(401);
    });

    it("returns 403 when not admin", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockRejectedValue(
        new serverAuth.ForbiddenError("Forbidden: Admin role required"),
      );

      const req = new NextRequest("http://localhost:3000/api/admin/feature-flags");
      const res = await getAdminFlagsRoute(req);
      expect(res.status).toBe(403);
    });

    it("returns 200 with all feature flags for admin", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

      const req = new NextRequest("http://localhost:3000/api/admin/feature-flags", {
        headers: adminHeaders,
      });

      const res = await getAdminFlagsRoute(req);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.success).toBe(true);
      expect(Array.isArray(body.flags)).toBe(true);
      expect(body.flags.length).toBeGreaterThan(0);
    });
  });

  describe("PATCH /api/admin/feature-flags/[key]", () => {
    it("returns 401 when unauthenticated", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockRejectedValue(
        new serverAuth.UnauthorizedError("Unauthorized"),
      );

      const req = new NextRequest("http://localhost:3000/api/admin/feature-flags/ai.query_rewriting", {
        method: "PATCH",
        body: JSON.stringify({ key: "ai.query_rewriting", isEnabled: false }),
      });

      const res = await patchAdminFlagRoute(req, {
        params: Promise.resolve({ key: "ai.query_rewriting" }),
      });
      expect(res.status).toBe(401);
    });

    it("returns 400 for validation failure", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

      const req = new NextRequest("http://localhost:3000/api/admin/feature-flags/ai.query_rewriting", {
        method: "PATCH",
        headers: adminHeaders,
        body: JSON.stringify({ isEnabled: "not-a-boolean" }),
      });

      const res = await patchAdminFlagRoute(req, {
        params: Promise.resolve({ key: "ai.query_rewriting" }),
      });
      expect(res.status).toBe(400);
    });

    it("returns 200 and updates flag when admin submits valid payload", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

      const req = new NextRequest("http://localhost:3000/api/admin/feature-flags/ai.query_rewriting", {
        method: "PATCH",
        headers: adminHeaders,
        body: JSON.stringify({
          key: "ai.query_rewriting",
          isEnabled: false,
          targetRolloutPercentage: 0,
        }),
      });

      const res = await patchAdminFlagRoute(req, {
        params: Promise.resolve({ key: "ai.query_rewriting" }),
      });
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.flag.isEnabled).toBe(false);
    });
  });

  describe("GET /api/feature-flags/eval (Public Endpoint)", () => {
    it("returns 400 when keys parameter is missing", async () => {
      const req = new NextRequest("http://localhost:3000/api/feature-flags/eval");
      const res = await getPublicEvalRoute(req);
      expect(res.status).toBe(400);
    });

    it("evaluates multiple feature flags publicly without authentication", async () => {
      const req = new NextRequest(
        "http://localhost:3000/api/feature-flags/eval?keys=ai.query_rewriting,experimental.voice_chat",
      );
      const res = await getPublicEvalRoute(req);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.flags).toBeDefined();
      expect(body.flags["ai.query_rewriting"]).toBe(true);
      expect(body.flags["experimental.voice_chat"]).toBe(false);
    });
  });
});
