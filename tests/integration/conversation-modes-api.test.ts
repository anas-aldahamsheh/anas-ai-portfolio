import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET as getPublicModes } from "@/app/api/chat/modes/route";
import { GET as getAdminModes } from "@/app/api/admin/ai/modes/route";
import { PATCH as patchAdminMode } from "@/app/api/admin/ai/modes/[id]/route";
import * as serverAuth from "@/modules/auth/infrastructure/server-auth";
import { conversationModeService } from "@/ai/modes";

describe("Conversation Modes API Endpoints (F032)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("Public GET /api/chat/modes", () => {
    it("returns 200 with localized English modes by default", async () => {
      const req = new NextRequest("http://localhost:3000/api/chat/modes");
      const res = await getPublicModes(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(Array.isArray(json.data)).toBe(true);
      expect(json.data).toHaveLength(3);
      expect(json.data[0].slug).toBe("general");
      expect(json.data[0].name).toBe("General");
    });

    it("returns 200 with localized Arabic modes when locale=ar", async () => {
      const req = new NextRequest("http://localhost:3000/api/chat/modes?locale=ar");
      const res = await getPublicModes(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data[0].name).toBe("عام");
      expect(json.data[1].name).toBe("مسؤول توظيف");
      expect(json.data[2].name).toBe("تقني متعمق");
    });
  });

  describe("Admin GET /api/admin/ai/modes", () => {
    it("returns 401 when unauthenticated", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockRejectedValue(
        new serverAuth.UnauthorizedError("Authentication required"),
      );

      const req = new NextRequest("http://localhost:3000/api/admin/ai/modes");
      const res = await getAdminModes(req);
      expect(res.status).toBe(401);
    });

    it("returns 403 when user is not admin", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockRejectedValue(
        new serverAuth.ForbiddenError("Admin role required"),
      );

      const req = new NextRequest("http://localhost:3000/api/admin/ai/modes");
      const res = await getAdminModes(req);
      expect(res.status).toBe(403);
    });

    it("returns 200 with full configs when authenticated as admin", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue({
        user: { id: "admin-1", email: "admin@example.com" },
        session: {
          id: "sess-1",
          userId: "admin-1",
          expiresAt: new Date(Date.now() + 3600000),
          token: "test-token",
        },
        role: "ADMIN",
      });

      const req = new NextRequest("http://localhost:3000/api/admin/ai/modes");
      const res = await getAdminModes(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data).toHaveLength(3);
      expect(json.data[0].slug).toBe("general");
      expect(json.data[0].toneGuidelines).toBeDefined();
    });
  });

  describe("Admin PATCH /api/admin/ai/modes/[id]", () => {
    it("returns 401 when unauthenticated", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockRejectedValue(
        new serverAuth.UnauthorizedError("Authentication required"),
      );

      const req = new NextRequest("http://localhost:3000/api/admin/ai/modes/mode-general", {
        method: "PATCH",
        body: JSON.stringify({ isEnabled: false }),
      });

      const res = await patchAdminMode(req, {
        params: Promise.resolve({ id: "mode-general" }),
      });
      expect(res.status).toBe(401);
    });

    it("returns 400 when invalid payload is passed", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue({
        user: { id: "admin-1", email: "admin@example.com" },
        session: {
          id: "sess-1",
          userId: "admin-1",
          expiresAt: new Date(Date.now() + 3600000),
          token: "test-token",
        },
        role: "ADMIN",
      });

      const req = new NextRequest("http://localhost:3000/api/admin/ai/modes/mode-general", {
        method: "PATCH",
        body: JSON.stringify({ sortOrder: "invalid-number" }),
      });

      const res = await patchAdminMode(req, {
        params: Promise.resolve({ id: "mode-general" }),
      });
      expect(res.status).toBe(400);
    });

    it("returns 200 with updated config when authorized", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue({
        user: { id: "admin-1", email: "admin@example.com" },
        session: {
          id: "sess-1",
          userId: "admin-1",
          expiresAt: new Date(Date.now() + 3600000),
          token: "test-token",
        },
        role: "ADMIN",
      });

      vi.spyOn(conversationModeService, "updateMode").mockResolvedValue({
        id: "mode-general",
        slug: "general",
        nameEn: "Updated General",
        nameAr: "عام",
        descriptionEn: "desc",
        descriptionAr: "desc",
        toneGuidelines: "tone",
        focusAreas: "focus",
        promptSlug: "chat_system",
        isEnabled: true,
        isPublished: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const req = new NextRequest("http://localhost:3000/api/admin/ai/modes/mode-general", {
        method: "PATCH",
        body: JSON.stringify({ nameEn: "Updated General" }),
      });

      const res = await patchAdminMode(req, {
        params: Promise.resolve({ id: "mode-general" }),
      });
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.nameEn).toBe("Updated General");
    });
  });
});
