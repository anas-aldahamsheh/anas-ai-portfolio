import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET as getAuditRoute } from "@/app/api/admin/audit/route";
import { GET as getAuditExportRoute } from "@/app/api/admin/audit/export/route";
import * as serverAuth from "@/modules/auth/infrastructure/server-auth";

describe("Audit Log API Routes (F041)", () => {
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
      id: "sess-audit-test",
      userId: "admin-uuid",
      token: "tok-audit-test",
      expiresAt: new Date(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/admin/audit", () => {
    it("returns 401 when unauthenticated", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockRejectedValue(
        new serverAuth.UnauthorizedError("Unauthorized"),
      );

      const req = new NextRequest("http://localhost:3000/api/admin/audit");
      const res = await getAuditRoute(req);
      expect(res.status).toBe(401);
    });

    it("returns 403 when not admin", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockRejectedValue(
        new serverAuth.ForbiddenError("Forbidden: Admin role required"),
      );

      const req = new NextRequest("http://localhost:3000/api/admin/audit");
      const res = await getAuditRoute(req);
      expect(res.status).toBe(403);
    });

    it("returns 200 with events and summary when admin", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

      const req = new NextRequest("http://localhost:3000/api/admin/audit", {
        headers: adminHeaders,
      });

      const res = await getAuditRoute(req);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.success).toBe(true);
      expect(Array.isArray(body.events)).toBe(true);
      expect(body.summary).toBeDefined();
      expect(body.summary.totalEvents).toBeGreaterThanOrEqual(0);
    });
  });

  describe("GET /api/admin/audit/export", () => {
    it("returns 401 when unauthenticated", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockRejectedValue(
        new serverAuth.UnauthorizedError("Unauthorized"),
      );

      const req = new NextRequest("http://localhost:3000/api/admin/audit/export?format=csv");
      const res = await getAuditExportRoute(req);
      expect(res.status).toBe(401);
    });

    it("returns 200 with CSV attachment headers for format=csv", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

      const req = new NextRequest("http://localhost:3000/api/admin/audit/export?format=csv", {
        headers: adminHeaders,
      });

      const res = await getAuditExportRoute(req);
      expect(res.status).toBe(200);
      expect(res.headers.get("content-type")).toContain("text/csv");
      expect(res.headers.get("content-disposition")).toContain("attachment; filename=");
    });

    it("returns 200 with JSON attachment headers for format=json", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

      const req = new NextRequest("http://localhost:3000/api/admin/audit/export?format=json", {
        headers: adminHeaders,
      });

      const res = await getAuditExportRoute(req);
      expect(res.status).toBe(200);
      expect(res.headers.get("content-type")).toContain("application/json");
      expect(res.headers.get("content-disposition")).toContain("attachment; filename=");
    });
  });
});
