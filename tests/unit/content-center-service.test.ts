import { describe, it, expect, vi, beforeEach } from "vitest";
import { ContentCenterService } from "@/modules/content/infrastructure/content-center-service";
import { db } from "@/lib/db/client";
import { sectionService } from "@/modules/content/infrastructure/section-service";

describe("ContentCenterService (F039)", () => {
  let service: ContentCenterService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ContentCenterService();

    // Mock db.select to avoid DB timeout hangs
    vi.spyOn(db, "select").mockReturnValue({
      from: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockResolvedValue([]),
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue([]),
        }),
      }),
    } as unknown as ReturnType<typeof db.select>);

    // Mock db.insert
    vi.spyOn(db, "insert").mockReturnValue({
      values: vi.fn().mockResolvedValue([{ id: "mock-id" }]),
    } as unknown as ReturnType<typeof db.insert>);

    // Mock db.update
    vi.spyOn(db, "update").mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([{ id: "mock-id" }]),
      }),
    } as unknown as ReturnType<typeof db.update>);

    // Mock db.delete
    vi.spyOn(db, "delete").mockReturnValue({
      where: vi.fn().mockResolvedValue([]),
    } as unknown as ReturnType<typeof db.delete>);
  });

  it("returns verified baseline content summary when DB returns empty", async () => {
    const summary = await service.getSummary();

    expect(summary).toBeDefined();
    expect(summary.pages.length).toBeGreaterThan(0);
    expect(summary.totalPublishedPages).toBeGreaterThan(0);
    expect(summary.totalSections).toBeGreaterThan(0);
  });

  it("returns list of admin pages with bilingual titles", async () => {
    const pages = await service.getPages();

    expect(pages.length).toBeGreaterThan(0);
    const homePage = pages.find((p) => p.slug === "home");
    expect(homePage).toBeDefined();
    expect(homePage?.translations.ar.title).toBeDefined();
    expect(homePage?.translations.en.title).toBeDefined();
  });

  it("creates new page with DRAFT status and invalidates cache", async () => {
    const invalidateSpy = vi.spyOn(sectionService, "invalidateCache");

    const newPage = await service.createPage(
      {
        slug: "new-feature",
        titleAr: "ميزة جديدة",
        titleEn: "New Feature",
        isHome: false,
      },
      "admin-user-id",
    );

    expect(newPage.slug).toBe("new-feature");
    expect(newPage.status).toBe("DRAFT");
    expect(newPage.translations.ar.title).toBe("ميزة جديدة");
    expect(newPage.translations.en.title).toBe("New Feature");
    expect(invalidateSpy).toHaveBeenCalledWith("new-feature");
  });

  it("updates page publishing status and invalidates cache", async () => {
    const invalidateSpy = vi.spyOn(sectionService, "invalidateCache");

    const result = await service.updatePageStatus("page-123", "PUBLISHED", "admin-user-id");

    expect(result.success).toBe(true);
    expect(result.status).toBe("PUBLISHED");
    expect(invalidateSpy).toHaveBeenCalled();
  });

  it("creates new section for page with draft status", async () => {
    const section = await service.createSection(
      {
        pageId: "page-home",
        sectionType: "hero",
        titleAr: "القسم الرئيسي",
        titleEn: "Main Hero Section",
      },
      "admin-user-id",
    );

    expect(section.sectionType).toBe("hero");
    expect(section.status).toBe("DRAFT");
    expect(section.translations.ar.title).toBe("القسم الرئيسي");
    expect(section.translations.en.title).toBe("Main Hero Section");
  });

  it("reorders sections and updates orderIndex", async () => {
    const result = await service.reorderSections(
      "page-home",
      ["sec-1", "sec-2", "sec-3"],
      "admin-user-id",
    );

    expect(result.success).toBe(true);
  });

  it("deletes section and invalidates section cache", async () => {
    const invalidateSpy = vi.spyOn(sectionService, "invalidateCache");

    const result = await service.deleteSection("sec-123", "admin-user-id");

    expect(result.success).toBe(true);
    expect(invalidateSpy).toHaveBeenCalled();
  });
});
