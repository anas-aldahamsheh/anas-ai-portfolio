import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  inlineEditUpdateSchema,
  type InlineEditUpdateInput,
} from "@/modules/admin/domain/inline-edit";
import { InlineEditService } from "@/modules/admin/infrastructure/inline-edit-service";
import { sectionService } from "@/modules/content/infrastructure/section-service";
import { localizedTextService } from "@/modules/localization/infrastructure/localized-text-service";
import { navigationService } from "@/modules/navigation/infrastructure/navigation-service";

// Mock database operations
vi.mock("@/lib/db/client", () => ({
  db: {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    }),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: "test-id" }]),
        onConflictDoUpdate: vi.fn().mockResolvedValue({}),
      }),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue({}),
      }),
    }),
    delete: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue({}),
    }),
  },
}));

describe("Global Admin Inline Edit Domain & Service (F013)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(sectionService, "invalidateCache").mockImplementation(() => {});
    vi.spyOn(localizedTextService, "invalidateCache").mockImplementation(() => {});
    vi.spyOn(navigationService, "invalidateCache").mockImplementation(() => {});
  });

  describe("Domain Validation (inlineEditUpdateSchema)", () => {
    it("validates a well-formed block update payload", () => {
      const input: InlineEditUpdateInput = {
        entityType: "block",
        entityId: "blk-123",
        fieldOrBlockId: "heading",
        locale: "ar",
        expectedVersion: 1,
        data: {
          content: { title: "عنوان جديد" },
        },
        action: "update",
      };

      const result = inlineEditUpdateSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("validates a section visibility toggle payload", () => {
      const input: InlineEditUpdateInput = {
        entityType: "section",
        entityId: "sec-456",
        fieldOrBlockId: "visibility",
        data: { isVisible: false },
        action: "toggle_visibility",
      };

      const result = inlineEditUpdateSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("validates a ui_text string update payload", () => {
      const input: InlineEditUpdateInput = {
        entityType: "ui_text",
        entityId: "home.hero.title",
        fieldOrBlockId: "value",
        locale: "en",
        data: "Updated Hero Title",
        action: "update",
      };

      const result = inlineEditUpdateSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("rejects payload missing required entityId", () => {
      const input = {
        entityType: "section",
        fieldOrBlockId: "header",
        data: {},
      };

      const result = inlineEditUpdateSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("rejects payload with invalid entityType", () => {
      const input = {
        entityType: "unsupported_type",
        entityId: "123",
        fieldOrBlockId: "xyz",
        data: {},
      };

      const result = inlineEditUpdateSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe("InlineEditService Execution", () => {
    const service = new InlineEditService();
    const adminUserId = "admin-user-uuid-123";

    it("successfully updates block content and invalidates content/localization caches", async () => {
      const input: InlineEditUpdateInput = {
        entityType: "block",
        entityId: "blk-hero-1",
        fieldOrBlockId: "heading",
        locale: "en",
        expectedVersion: 2,
        data: {
          content: { title: "Software Architect Portfolio" },
        },
        action: "update",
      };

      const res = await service.updateContent(input, adminUserId, {
        ipAddress: "127.0.0.1",
        userAgent: "Vitest/1.0",
      });

      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.entityType).toBe("block");
        expect(res.version).toBe(3);
      }

      expect(sectionService.invalidateCache).toHaveBeenCalledTimes(1);
      expect(localizedTextService.invalidateCache).toHaveBeenCalledTimes(1);
      expect(navigationService.invalidateCache).toHaveBeenCalledTimes(1);
    });

    it("successfully updates section status and title", async () => {
      const input: InlineEditUpdateInput = {
        entityType: "section",
        entityId: "sec-projects-1",
        fieldOrBlockId: "header",
        locale: "ar",
        expectedVersion: 0,
        data: {
          title: "المشاريع المميزة",
          status: "PUBLISHED",
        },
        action: "update",
      };

      const res = await service.updateContent(input, adminUserId);
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.entityType).toBe("section");
        expect(res.version).toBe(1);
      }
      expect(sectionService.invalidateCache).toHaveBeenCalled();
    });

    it("successfully updates navigation settings in system_settings", async () => {
      const input: InlineEditUpdateInput = {
        entityType: "navigation",
        entityId: "navigation_config",
        fieldOrBlockId: "header_items",
        data: {
          items: [{ id: "nav-1", labelKey: "nav.projects", path: "/projects" }],
        },
        action: "update",
      };

      const res = await service.updateContent(input, adminUserId);
      expect(res.success).toBe(true);
      expect(navigationService.invalidateCache).toHaveBeenCalled();
    });
  });
});
