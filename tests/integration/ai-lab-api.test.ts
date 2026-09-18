import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET as getDemosRoute } from "@/app/api/lab/demos/route";
import { POST as runDemoRoute } from "@/app/api/lab/run/route";
import { GET as adminGetLabRoute } from "@/app/api/admin/ai/lab/route";
import { PATCH as adminPatchLabRoute } from "@/app/api/admin/ai/lab/[id]/route";
import * as serverAuth from "@/modules/auth/infrastructure/server-auth";
import { aiLabService } from "@/ai/lab";

describe("AI Lab API Routes (F035)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("Public Routes", () => {
    it("GET /api/lab/demos returns published demos", async () => {
      const req = new NextRequest("http://localhost/api/lab/demos?locale=en");
      const res = await getDemosRoute(req);
      expect(res.status).toBe(200);

      const json = (await res.json()) as { success: boolean; data: Array<{ slug: string }> };
      expect(json.success).toBe(true);
      expect(Array.isArray(json.data)).toBe(true);
      expect(json.data.length).toBeGreaterThan(0);
      expect(json.data[0]?.slug).toBe("hybrid-search");
    });

    it("POST /api/lab/run rejects invalid payloads with status 400", async () => {
      const req = new NextRequest("http://localhost/api/lab/run", {
        method: "POST",
        body: JSON.stringify({
          // Missing demoSlug
          params: {},
        }),
      });

      const res = await runDemoRoute(req);
      expect(res.status).toBe(400);

      const json = (await res.json()) as { error: string };
      expect(json.error).toBe("Validation failed");
    });

    it("POST /api/lab/run executes valid demo and returns result", async () => {
      vi.spyOn(aiLabService, "executeDemo").mockResolvedValueOnce({
        demoSlug: "hybrid-search",
        type: "hybrid_search",
        data: {
          query: "Enterprise RAG and vector search",
          denseWeight: 0.5,
          sparseWeight: 0.5,
          topK: 3,
          results: [],
        },
        telemetry: {
          latencyMs: 42,
          realExecution: true,
        },
      });

      const req = new NextRequest("http://localhost/api/lab/run", {
        method: "POST",
        body: JSON.stringify({
          demoSlug: "hybrid-search",
          params: {
            query: "Enterprise RAG and vector search",
            topK: 3,
          },
          locale: "en",
        }),
      });

      const res = await runDemoRoute(req);
      expect(res.status).toBe(200);

      const json = (await res.json()) as {
        success: boolean;
        data: { demoSlug: string; type: string; telemetry: { realExecution: boolean } };
      };
      expect(json.success).toBe(true);
      expect(json.data.demoSlug).toBe("hybrid-search");
      expect(json.data.telemetry.realExecution).toBe(true);
    });
  });

  describe("Admin Routes", () => {
    it("GET /api/admin/ai/lab returns 401 when unauthenticated", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockRejectedValueOnce(
        new serverAuth.UnauthorizedError("No session"),
      );

      const req = new NextRequest("http://localhost/api/admin/ai/lab");
      const res = await adminGetLabRoute(req);
      expect(res.status).toBe(401);
    });

    it("GET /api/admin/ai/lab returns all demos when admin is authorized", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValueOnce({
        user: { id: "admin-1", email: "admin@example.com" },
        session: { id: "sess-1", userId: "admin-1", expiresAt: new Date(), token: "tok-1" },
        role: "ADMIN",
      });

      const req = new NextRequest("http://localhost/api/admin/ai/lab");
      const res = await adminGetLabRoute(req);
      expect(res.status).toBe(200);

      const json = (await res.json()) as { success: boolean; data: unknown[] };
      expect(json.success).toBe(true);
      expect(json.data.length).toBeGreaterThan(0);
    });

    it("PATCH /api/admin/ai/lab/[id] updates demo configuration", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValueOnce({
        user: { id: "admin-1", email: "admin@example.com" },
        session: { id: "sess-1", userId: "admin-1", expiresAt: new Date(), token: "tok-1" },
        role: "ADMIN",
      });

      const req = new NextRequest("http://localhost/api/admin/ai/lab/demo-hybrid-search-001", {
        method: "PATCH",
        body: JSON.stringify({
          rateLimitRpm: 100,
        }),
      });

      const res = await adminPatchLabRoute(req, {
        params: Promise.resolve({ id: "demo-hybrid-search-001" }),
      });
      expect(res.status).toBe(200);

      const json = (await res.json()) as {
        success: boolean;
        data: { rateLimitRpm: number };
      };
      expect(json.success).toBe(true);
      expect(json.data.rateLimitRpm).toBe(100);
    });
  });
});
