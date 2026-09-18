import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET as getRateLimitsRoute, POST as postRateLimitsRoute } from "@/app/api/admin/rate-limits/route";
import { POST as postJobFitRoute } from "@/app/api/job-fit/route";
import * as serverAuth from "@/modules/auth/infrastructure/server-auth";
import { rateLimiter } from "@/lib/security/rate-limiter";
import { jobFitService } from "@/ai/job-fit/job-fit-service";

describe("Rate Limiting API Integration (F044)", () => {
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
      id: "sess-rl-test",
      userId: "admin-uuid",
      token: "tok-rl-test",
      expiresAt: new Date(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    rateLimiter.reset();
  });

  describe("GET /api/admin/rate-limits", () => {
    it("returns 401 when unauthenticated", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockRejectedValue(
        new serverAuth.UnauthorizedError("Unauthorized"),
      );

      const req = new NextRequest("http://localhost:3000/api/admin/rate-limits");
      const res = await getRateLimitsRoute(req);
      expect(res.status).toBe(401);
    });

    it("returns 403 when not admin", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockRejectedValue(
        new serverAuth.ForbiddenError("Forbidden: Admin role required"),
      );

      const req = new NextRequest("http://localhost:3000/api/admin/rate-limits");
      const res = await getRateLimitsRoute(req);
      expect(res.status).toBe(403);
    });

    it("returns 200 with rules and throttled clients list for admin", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

      const req = new NextRequest("http://localhost:3000/api/admin/rate-limits", {
        headers: adminHeaders,
      });

      const res = await getRateLimitsRoute(req);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.rules).toBeDefined();
      expect(body.rules.chat.limit).toBe(20);
      expect(Array.isArray(body.throttledClients)).toBe(true);
    });
  });

  describe("POST /api/admin/rate-limits", () => {
    it("resets rate limits when admin posts reset request", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

      // Block an IP
      for (let i = 0; i < 25; i++) {
        rateLimiter.check("ip:192.168.1.50", "chat");
      }
      expect(rateLimiter.check("ip:192.168.1.50", "chat").allowed).toBe(false);

      const req = new NextRequest("http://localhost:3000/api/admin/rate-limits", {
        method: "POST",
        headers: adminHeaders,
        body: JSON.stringify({ all: true }),
      });

      const res = await postRateLimitsRoute(req);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.success).toBe(true);
      expect(rateLimiter.check("ip:192.168.1.50", "chat").allowed).toBe(true);
    });
  });

  describe("Rate Limit Enforcement on Public Endpoints", () => {
    it("attaches rate limit headers and blocks with 429 when quota is exceeded", async () => {
      vi.spyOn(jobFitService, "analyze").mockResolvedValue({
        summary: {
          totalRequirements: 5,
          supportedCount: 4,
          partiallySupportedCount: 1,
          notFoundCount: 0,
          matchScore: 88,
          overview: "Strong candidate fit.",
          strengths: ["Architecture", "Next.js"],
          gapsOrConsiderations: [],
        },
        requirements: [],
        telemetry: {
          retrievedCount: 5,
          rerankedCount: 5,
          tokenCount: 800,
          durationMs: 120,
          language: "en",
        },
      });

      const clientIp = "192.168.100.22";
      const headers = new Headers({
        "x-forwarded-for": clientIp,
        "content-type": "application/json",
      });

      const makeRequest = () =>
        new NextRequest("http://localhost:3000/api/job-fit", {
          method: "POST",
          headers,
          body: JSON.stringify({
            jobDescription: "Staff AI Engineer role requiring Next.js and LLM system architecture.",
          }),
        });

      // job_fit limit is 10
      const firstRes = await postJobFitRoute(makeRequest());
      expect(firstRes.status).toBe(200);
      expect(firstRes.headers.get("X-RateLimit-Limit")).toBe("10");
      expect(firstRes.headers.get("X-RateLimit-Remaining")).toBe("9");

      // Exhaust remaining 9 requests
      for (let i = 0; i < 9; i++) {
        await postJobFitRoute(makeRequest());
      }

      // 11th request triggers 429
      const blockedRes = await postJobFitRoute(makeRequest());
      expect(blockedRes.status).toBe(429);
      expect(blockedRes.headers.get("X-RateLimit-Remaining")).toBe("0");
      expect(blockedRes.headers.get("Retry-After")).toBeDefined();

      const blockedBody = await blockedRes.json();
      expect(blockedBody.success).toBe(false);
      expect(blockedBody.error).toContain("Too many requests");
    });
  });
});
