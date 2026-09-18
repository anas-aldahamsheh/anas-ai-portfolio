import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET as getCacheRoute, POST as postCacheRoute } from "@/app/api/admin/cache/route";
import { POST as postFlushRoute } from "@/app/api/admin/cache/flush/route";
import * as serverAuth from "@/modules/auth/infrastructure/server-auth";
import { cacheService } from "@/lib/cache/cache-service";

describe("Cache API Routes (F043)", () => {
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
      id: "sess-cache-test",
      userId: "admin-uuid",
      token: "tok-cache-test",
      expiresAt: new Date(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    cacheService.clear();
    cacheService.resetMetrics();
  });

  describe("GET /api/admin/cache", () => {
    it("returns 401 when unauthenticated", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockRejectedValue(
        new serverAuth.UnauthorizedError("Unauthorized"),
      );

      const req = new NextRequest("http://localhost:3000/api/admin/cache");
      const res = await getCacheRoute(req);
      expect(res.status).toBe(401);
    });

    it("returns 403 when not admin", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockRejectedValue(
        new serverAuth.ForbiddenError("Forbidden: Admin role required"),
      );

      const req = new NextRequest("http://localhost:3000/api/admin/cache");
      const res = await getCacheRoute(req);
      expect(res.status).toBe(403);
    });

    it("returns 200 with cache stats and keys for admin", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

      cacheService.set("test:key", "sample-val", { tags: ["content"] });

      const req = new NextRequest("http://localhost:3000/api/admin/cache", {
        headers: adminHeaders,
      });

      const res = await getCacheRoute(req);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.stats.totalKeys).toBe(1);
      expect(Array.isArray(body.keys)).toBe(true);
      expect(body.keys.length).toBe(1);
    });
  });

  describe("POST /api/admin/cache", () => {
    it("returns 401 when unauthenticated", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockRejectedValue(
        new serverAuth.UnauthorizedError("Unauthorized"),
      );

      const req = new NextRequest("http://localhost:3000/api/admin/cache", {
        method: "POST",
        body: JSON.stringify({ tags: ["content"] }),
      });

      const res = await postCacheRoute(req);
      expect(res.status).toBe(401);
    });

    it("returns 400 for validation failure", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

      const req = new NextRequest("http://localhost:3000/api/admin/cache", {
        method: "POST",
        headers: adminHeaders,
        body: JSON.stringify({ tags: "not-an-array" }),
      });

      const res = await postCacheRoute(req);
      expect(res.status).toBe(400);
    });

    it("invalidates specific tags and returns 200 with count", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

      cacheService.set("proj:1", "p1", { tags: ["projects"] });
      cacheService.set("proj:2", "p2", { tags: ["projects"] });
      cacheService.set("ai:1", "a1", { tags: ["ai"] });

      const req = new NextRequest("http://localhost:3000/api/admin/cache", {
        method: "POST",
        headers: adminHeaders,
        body: JSON.stringify({ tags: ["projects"] }),
      });

      const res = await postCacheRoute(req);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.invalidatedCount).toBe(2);
      expect(cacheService.get("proj:1")).toBeNull();
      expect(cacheService.get("ai:1")).toBe("a1");
    });
  });

  describe("POST /api/admin/cache/flush", () => {
    it("returns 401 when unauthenticated", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockRejectedValue(
        new serverAuth.UnauthorizedError("Unauthorized"),
      );

      const req = new NextRequest("http://localhost:3000/api/admin/cache/flush", {
        method: "POST",
      });

      const res = await postFlushRoute(req);
      expect(res.status).toBe(401);
    });

    it("flushes all caches and returns 200", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

      cacheService.set("k1", "v1");
      cacheService.set("k2", "v2");

      const req = new NextRequest("http://localhost:3000/api/admin/cache/flush", {
        method: "POST",
        headers: adminHeaders,
      });

      const res = await postFlushRoute(req);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.flushedCount).toBe(2);
      expect(cacheService.getStats().totalKeys).toBe(0);
    });
  });
});
