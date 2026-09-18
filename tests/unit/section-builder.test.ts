import { describe, it, expect, beforeEach } from "vitest";
import { sectionService } from "@/modules/content/infrastructure/section-service";
import {
  headingBlockConfigSchema,
  headingBlockContentSchema,
  ctaBlockConfigSchema,
  ctaBlockContentSchema,
  metricsBlockContentSchema,
  cardCollectionBlockContentSchema,
} from "@/modules/content/domain/blocks";

describe("Dynamic Section Builder Domain & Service (F012)", () => {
  beforeEach(() => {
    sectionService.invalidateCache();
  });

  describe("Block Schema Validation", () => {
    it("validates heading block schemas", () => {
      const validConfig = headingBlockConfigSchema.safeParse({ level: "h2", align: "start" });
      expect(validConfig.success).toBe(true);

      const validContent = headingBlockContentSchema.safeParse({
        text: "Main Title",
        subtitle: "A description subtitle",
      });
      expect(validContent.success).toBe(true);

      const invalidContent = headingBlockContentSchema.safeParse({ text: "" });
      expect(invalidContent.success).toBe(false);
    });

    it("validates CTA block schemas", () => {
      const validConfig = ctaBlockConfigSchema.safeParse({ variant: "primary", align: "center" });
      expect(validConfig.success).toBe(true);

      const validContent = ctaBlockContentSchema.safeParse({
        label: "Get Started",
        url: "/projects",
        openInNewTab: false,
      });
      expect(validContent.success).toBe(true);
    });

    it("validates metrics block schemas", () => {
      const valid = metricsBlockContentSchema.safeParse({
        items: [
          { value: "100%", label: "Test Coverage" },
          { value: "50ms", label: "Latency", description: "P99 duration" },
        ],
      });
      expect(valid.success).toBe(true);

      const emptyItems = metricsBlockContentSchema.safeParse({ items: [] });
      expect(emptyItems.success).toBe(false);
    });

    it("validates card collection schemas", () => {
      const valid = cardCollectionBlockContentSchema.safeParse({
        columns: "2",
        items: [
          {
            id: "card-1",
            title: "Project Alpha",
            description: "Deep dive case study",
            badge: "Featured",
            url: "/projects/alpha",
          },
        ],
      });
      expect(valid.success).toBe(true);
    });
  });

  describe("Section Service", () => {
    it("retrieves default home sections ordered by orderIndex for Arabic and English", async () => {
      const arSections = await sectionService.getPageSections("home", "ar");
      expect(arSections.length).toBeGreaterThan(0);
      expect(arSections[0]!.title).toContain("المحفظة");

      const enSections = await sectionService.getPageSections("home", "en");
      expect(enSections.length).toBeGreaterThan(0);
      expect(enSections[0]!.title).toContain("Portfolio");

      // Verify sections are sorted ascending
      for (let i = 0; i < enSections.length - 1; i++) {
        expect(enSections[i]!.orderIndex).toBeLessThanOrEqual(enSections[i + 1]!.orderIndex);
      }
    });

    it("caches sections in memory and supports invalidation", async () => {
      const first = await sectionService.getPageSections("home", "en");
      const second = await sectionService.getPageSections("home", "en");
      expect(first).toBe(second);

      sectionService.invalidateCache("home");
      const third = await sectionService.getPageSections("home", "en");
      expect(third).toEqual(first);
    });
  });
});
