import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET as getOverviewRoute } from "@/app/api/admin/content/overview/route";
import { GET as getPagesRoute, POST as postPagesRoute } from "@/app/api/admin/content/pages/route";
import { PATCH as patchPageStatusRoute } from "@/app/api/admin/content/pages/[id]/status/route";
import { GET as getSectionsRoute, POST as postSectionsRoute } from "@/app/api/admin/content/sections/route";
import { DELETE as deleteSectionRoute } from "@/app/api/admin/content/sections/[id]/route";
import { POST as postReorderSectionsRoute } from "@/app/api/admin/content/sections/reorder/route";
import * as serverAuth from "@/modules/auth/infrastructure/server-auth";
import { db } from "@/lib/db/client";

describe("Admin Content Center API Routes (F039)", () => {
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
      id: "sess-content-test",
      userId: "admin-uuid",
      token: "tok-content-test",
      expiresAt: new Date(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(db, "select").mockReturnValue({
      from: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockResolvedValue([]),
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue([]),
        }),
      }),
    } as unknown as ReturnType<typeof db.select>);

    vi.spyOn(db, "insert").mockReturnValue({
      values: vi.fn().mockResolvedValue([{ id: "mock-id" }]),
    } as unknown as ReturnType<typeof db.insert>);

    vi.spyOn(db, "update").mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([{ id: "mock-id" }]),
      }),
    } as unknown as ReturnType<typeof db.update>);

    vi.spyOn(db, "delete").mockReturnValue({
      where: vi.fn().mockResolvedValue([]),
    } as unknown as ReturnType<typeof db.delete>);
  });

  describe("GET /api/admin/content/overview", () => {
    it("returns 401 when request is unauthenticated", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockRejectedValue(
        new serverAuth.UnauthorizedError("Unauthorized"),
      );

      const req = new NextRequest("http://localhost:3000/api/admin/content/overview");
      const res = await getOverviewRoute(req);
      expect(res.status).toBe(401);
    });

    it("returns 403 when user is not an admin", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockRejectedValue(
        new serverAuth.ForbiddenError("Forbidden: Admin access required"),
      );

      const req = new NextRequest("http://localhost:3000/api/admin/content/overview");
      const res = await getOverviewRoute(req);
      expect(res.status).toBe(403);
    });

    it("returns 200 with summary when admin requests overview", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

      const req = new NextRequest("http://localhost:3000/api/admin/content/overview", {
        headers: adminHeaders,
      });
      const res = await getOverviewRoute(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.pages.length).toBeGreaterThan(0);
      expect(json.data.totalPublishedPages).toBeGreaterThan(0);
    });
  });

  describe("GET /api/admin/content/pages", () => {
    it("returns 200 with list of pages", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

      const req = new NextRequest("http://localhost:3000/api/admin/content/pages", {
        headers: adminHeaders,
      });
      const res = await getPagesRoute(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/admin/content/sections", () => {
    it("returns 200 with list of sections for page", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

      const req = new NextRequest("http://localhost:3000/api/admin/content/sections?pageId=page-home", {
        headers: adminHeaders,
      });
      const res = await getSectionsRoute(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.data)).toBe(true);
    });
  });

  describe("POST /api/admin/content/pages", () => {
    it("returns 400 when body fails schema validation", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

      const req = new NextRequest("http://localhost:3000/api/admin/content/pages", {
        method: "POST",
        headers: adminHeaders,
        body: JSON.stringify({ slug: "INVALID SLUG WITH SPACES" }),
      });
      const res = await postPagesRoute(req);
      expect(res.status).toBe(400);
    });

    it("returns 200 and creates page with valid payload", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

      const req = new NextRequest("http://localhost:3000/api/admin/content/pages", {
        method: "POST",
        headers: adminHeaders,
        body: JSON.stringify({
          slug: "test-new-page",
          titleAr: "صفحة تجريبية",
          titleEn: "Test New Page",
        }),
      });
      const res = await postPagesRoute(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.slug).toBe("test-new-page");
      expect(json.data.status).toBe("DRAFT");
    });
  });

  describe("PATCH /api/admin/content/pages/[id]/status", () => {
    it("returns 200 and updates page status to PUBLISHED", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

      const req = new NextRequest("http://localhost:3000/api/admin/content/pages/page-1/status", {
        method: "PATCH",
        headers: adminHeaders,
        body: JSON.stringify({ status: "PUBLISHED" }),
      });
      const res = await patchPageStatusRoute(req, {
        params: Promise.resolve({ id: "page-1" }),
      });
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.status).toBe("PUBLISHED");
    });
  });

  describe("POST /api/admin/content/sections", () => {
    it("returns 200 and creates section for page", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

      const req = new NextRequest("http://localhost:3000/api/admin/content/sections", {
        method: "POST",
        headers: adminHeaders,
        body: JSON.stringify({
          pageId: "page-home",
          sectionType: "hero",
          titleAr: "البطل",
          titleEn: "Hero",
        }),
      });
      const res = await postSectionsRoute(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.sectionType).toBe("hero");
    });
  });

  describe("POST /api/admin/content/sections/reorder", () => {
    it("returns 200 and reorders sections", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

      const req = new NextRequest("http://localhost:3000/api/admin/content/sections/reorder", {
        method: "POST",
        headers: adminHeaders,
        body: JSON.stringify({
          pageId: "page-home",
          sectionIds: ["sec-1", "sec-2"],
        }),
      });
      const res = await postReorderSectionsRoute(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
    });
  });

  describe("DELETE /api/admin/content/sections/[id]", () => {
    it("returns 200 and deletes section", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

      const req = new NextRequest("http://localhost:3000/api/admin/content/sections/sec-1", {
        method: "DELETE",
        headers: adminHeaders,
      });
      const res = await deleteSectionRoute(req, {
        params: Promise.resolve({ id: "sec-1" }),
      });
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
    });
  });
});
