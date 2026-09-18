import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET as getObservabilityRoute } from "@/app/api/admin/observability/route";
import { GET as getMetricsRoute } from "@/app/api/metrics/route";
import * as serverAuth from "@/modules/auth/infrastructure/server-auth";
import { metrics } from "@/lib/observability/metrics";
import { tracer } from "@/lib/observability/tracer";

describe("Observability API Endpoints (F045)", () => {
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
      id: "sess-obs-test",
      userId: "admin-uuid",
      token: "tok-obs-test",
      expiresAt: new Date(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    metrics.reset();
    tracer.clear();
  });

  describe("GET /api/admin/observability", () => {
    it("returns 401 when unauthenticated", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockRejectedValue(
        new serverAuth.UnauthorizedError("Unauthorized"),
      );

      const req = new NextRequest("http://localhost:3000/api/admin/observability");
      const res = await getObservabilityRoute(req);
      expect(res.status).toBe(401);
    });

    it("returns 403 when not admin", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockRejectedValue(
        new serverAuth.ForbiddenError("Forbidden: Admin role required"),
      );

      const req = new NextRequest("http://localhost:3000/api/admin/observability");
      const res = await getObservabilityRoute(req);
      expect(res.status).toBe(403);
    });

    it("returns 200 with metrics snapshot and recent spans for admin", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

      metrics.recordHttpRequest("GET", "/api/chat", 200, 45);
      await tracer.traceSpan("test_span", () => "ok");

      const req = new NextRequest("http://localhost:3000/api/admin/observability", {
        headers: adminHeaders,
      });

      const res = await getObservabilityRoute(req);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.metrics).toBeDefined();
      expect(body.metrics.totalRequests).toBe(1);
      expect(Array.isArray(body.recentSpans)).toBe(true);
      expect(body.recentSpans.length).toBe(1);
    });
  });

  describe("GET /api/metrics", () => {
    it("returns 200 with Prometheus text/plain format", async () => {
      metrics.recordHttpRequest("POST", "/api/chat", 200, 35);

      const res = await getMetricsRoute();
      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toContain("text/plain");

      const text = await res.text();
      expect(text).toContain("# HELP http_requests_total");
      expect(text).toContain("nodejs_heap_used_bytes");
    });
  });
});
