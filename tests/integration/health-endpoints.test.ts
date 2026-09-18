import { describe, it, expect } from "vitest";
import { GET as getHealthRoute } from "@/app/api/health/route";
import { GET as getReadinessRoute } from "@/app/api/readiness/route";

describe("Health & Readiness Endpoints (F046)", () => {
  describe("GET /api/health", () => {
    it("returns 200 with healthy status and no-cache headers", async () => {
      const res = await getHealthRoute();
      expect(res.status).toBe(200);
      expect(res.headers.get("Cache-Control")).toContain("no-store");

      const body = await res.json();
      expect(body.status).toBe("healthy");
      expect(typeof body.uptimeSeconds).toBe("number");
      expect(body.memory).toBeDefined();
    });
  });

  describe("GET /api/readiness", () => {
    it("returns status 200 or 503 with subsystem checks and no-cache headers", async () => {
      const res = await getReadinessRoute();
      expect([200, 503]).toContain(res.status);
      expect(res.headers.get("Cache-Control")).toContain("no-store");

      const body = await res.json();
      expect(["ready", "degraded", "unready"]).toContain(body.status);
      expect(body.checks).toBeDefined();
      expect(body.checks.database).toBeDefined();
      expect(body.checks.vectorStore).toBeDefined();
      expect(body.checks.cache).toBeDefined();
      expect(body.checks.configuration).toBeDefined();
    });
  });
});
