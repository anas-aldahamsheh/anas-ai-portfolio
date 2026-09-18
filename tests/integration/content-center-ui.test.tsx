import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ContentCenterManager } from "@/modules/admin/presentation/content-center-manager";
import { LocalizationProvider } from "@/modules/localization/presentation/localization-provider";
import { BASELINE_CONTENT_SUMMARY } from "@/modules/content/infrastructure/baseline-content-data";

describe("ContentCenterManager Component (F039)", () => {
  const dictionaryEn: Record<string, string> = {
    "admin.content.title": "Admin Content Center",
    "admin.content.desc": "Manage portfolio pages and composable sections",
    "admin.content.pages_tab": "Pages Management",
    "admin.content.sections_tab": "Sections Builder",
    "admin.content.publish_tab": "Publishing Queue",
  };

  const dictionaryAr: Record<string, string> = {
    "admin.content.title": "مركز إدارة المحتوى والأقسام",
    "admin.content.desc": "إدارة الصفحات وبناء الأقسام التركيبية",
    "admin.content.pages_tab": "إدارة الصفحات",
    "admin.content.sections_tab": "بناء الأقسام",
    "admin.content.publish_tab": "طابور النشر",
  };

  const renderManager = (locale: "en" | "ar" = "en") => {
    const dict = locale === "ar" ? dictionaryAr : dictionaryEn;
    return render(
      <LocalizationProvider locale={locale} dictionary={dict}>
        <ContentCenterManager initialSummary={BASELINE_CONTENT_SUMMARY} />
      </LocalizationProvider>,
    );
  };

  it("renders header and summary stat cards", () => {
    renderManager();

    expect(screen.getByText("Admin Content Center")).toBeInTheDocument();
    expect(screen.getByText("Total Pages")).toBeInTheDocument();
    expect(screen.getByText("Published Pages")).toBeInTheDocument();
    expect(screen.getByText("Total Sections")).toBeInTheDocument();
  });

  it("displays portfolio pages table with slugs and status badges", () => {
    renderManager();

    expect(screen.getByTestId("page-row-home")).toBeInTheDocument();
    expect(screen.getByTestId("page-row-projects")).toBeInTheDocument();
    expect(screen.getByTestId("page-row-cv")).toBeInTheDocument();
    expect(screen.getByTestId("page-row-lab")).toBeInTheDocument();
    expect(screen.getByTestId("page-row-evaluation")).toBeInTheDocument();
  });

  it("opens add page form when clicking '+ Add Page' button", () => {
    renderManager();

    const addBtn = screen.getByTestId("btn-add-page");
    fireEvent.click(addBtn);

    expect(screen.getByTestId("form-add-page")).toBeInTheDocument();
    expect(screen.getByTestId("input-page-slug")).toBeInTheDocument();
  });

  it("switches to Sections Builder tab and shows section builder panel", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [
          {
            id: "sec-hero-1",
            pageId: "page-home",
            sectionType: "hero",
            orderIndex: 0,
            isVisible: true,
            status: "PUBLISHED",
            translations: {
              en: { title: "Main Hero" },
              ar: { title: "البطل الرئيسي" },
            },
            blocksCount: 2,
            updatedAt: "2026-09-18T12:00:00Z",
          },
          {
            id: "sec-proj-2",
            pageId: "page-home",
            sectionType: "projects_grid",
            orderIndex: 1,
            isVisible: true,
            status: "PUBLISHED",
            translations: {
              en: { title: "Featured Projects" },
              ar: { title: "المشاريع المميزة" },
            },
            blocksCount: 4,
            updatedAt: "2026-09-18T12:00:00Z",
          },
        ],
      }),
    } as unknown as Response);

    renderManager();

    const sectionsTab = screen.getByTestId("tab-sections");
    fireEvent.click(sectionsTab);

    expect(screen.getByTestId("sections-panel")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("section-item-sec-hero-1")).toBeInTheDocument();
    });

    expect(screen.getByTestId("btn-move-up-0")).toBeDisabled();
    expect(screen.getByTestId("btn-move-down-0")).not.toBeDisabled();
  });

  it("switches to Publishing Queue tab and shows verification rules", () => {
    renderManager();

    const publishTab = screen.getByTestId("tab-publishing");
    fireEvent.click(publishTab);

    expect(screen.getByTestId("publishing-panel")).toBeInTheDocument();
    expect(screen.getByText("Pending Draft Revisions")).toBeInTheDocument();
    expect(screen.getByTestId("btn-publish-all")).toBeInTheDocument();
  });

  it("renders correctly in Arabic with RTL orientation", () => {
    renderManager("ar");

    const container = screen.getByTestId("content-center-manager");
    expect(container).toHaveAttribute("dir", "rtl");
    expect(screen.getByText("مركز إدارة المحتوى والأقسام")).toBeInTheDocument();
  });
});
