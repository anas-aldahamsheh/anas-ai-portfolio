import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET as getPublicMetricsRoute } from "@/app/api/evaluation/metrics/route";
import { GET as getAdminRunsRoute } from "@/app/api/admin/evaluation/runs/route";
import { GET as getAdminCompareRoute } from "@/app/api/admin/evaluation/compare/route";
import * as serverAuth from "@/modules/auth/infrastructure/server-auth";

describe("AI Evaluation API Routes (F037)", () => {
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
      id: "sess-eval-test",
      userId: "admin-uuid",
      token: "tok-eval-test",
      expiresAt: new Date(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/evaluation/metrics (Public)", () => {
    it("returns public aggregate metrics and methodology with cache headers", async () => {
      const res = await getPublicMetricsRoute();
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.aggregateMetrics.length).toBeGreaterThan(0);
      expect(json.data.methodology.principles.length).toBeGreaterThan(0);
      expect(json.data.languageParity.parityRatio).toBeGreaterThan(0.9);
      expect(json.data.activeBaselineRun).toBeDefined();

      // Verify cache header
      expect(res.headers.get("Cache-Control")).toContain("public");
    });
  });

  describe("GET /api/admin/evaluation/runs (Admin)", () => {
    it("rejects unauthenticated requests with 401", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockRejectedValueOnce(
        new serverAuth.UnauthorizedError("Unauthorized"),
      );

      const req = new NextRequest("http://localhost/api/admin/evaluation/runs");
      const res = await getAdminRunsRoute(req);
      expect(res.status).toBe(401);
    });

    it("rejects non-admin users with 403", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockRejectedValueOnce(
        new serverAuth.ForbiddenError("Forbidden: Admin role required"),
      );

      const req = new NextRequest("http://localhost/api/admin/evaluation/runs", {
        headers: adminHeaders,
      });
      const res = await getAdminRunsRoute(req);
      expect(res.status).toBe(403);
    });

    it("returns evaluation runs for authenticated admins", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

      const req = new NextRequest("http://localhost/api/admin/evaluation/runs", {
        headers: adminHeaders,
      });
      const res = await getAdminRunsRoute(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.data.runs)).toBe(true);
      expect(json.data.runs.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/admin/evaluation/compare (Admin)", () => {
    it("rejects requests missing query parameters with 400", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

      const req = new NextRequest("http://localhost/api/admin/evaluation/compare", {
        headers: adminHeaders,
      });
      const res = await getAdminCompareRoute(req);
      expect(res.status).toBe(400);
    });

    it("returns 404 if runs are not found", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

      const req = new NextRequest(
        "http://localhost/api/admin/evaluation/compare?baselineId=invalid-1&candidateId=invalid-2",
        { headers: adminHeaders },
      );
      const res = await getAdminCompareRoute(req);
      expect(res.status).toBe(404);
    });

    it("returns regression comparison between valid baseline and candidate runs", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

      const req = new NextRequest(
        "http://localhost/api/admin/evaluation/compare?baselineId=run-prod-candidate-v1&candidateId=run-dense-only-ablation",
        { headers: adminHeaders },
      );
      const res = await getAdminCompareRoute(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.deltas).toBeDefined();
      expect(json.data.hasRegression).toBe(true);
    });
  });
});
