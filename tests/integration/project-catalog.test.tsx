import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProjectCatalog } from "@/modules/projects/presentation";
import {
  BASELINE_PROJECTS_EN,
  BASELINE_CATEGORIES,
  BASELINE_TAGS,
  BASELINE_PROJECTS_AR,
} from "@/modules/projects/domain/baseline";
import { LocalizationProvider } from "@/modules/localization/presentation/localization-provider";
import { AdminEditProvider } from "@/modules/admin/presentation";

const dictionaryEn: Record<string, string> = {
  "projects.catalog.title": "Engineering & AI Projects",
  "projects.catalog.description": "Production systems and agentic architectures.",
  "projects.search.placeholder": "Search projects by keyword, tech, or topic...",
  "projects.filter.all_categories": "All Domains",
  "projects.filter.all_tags": "All Technologies",
  "projects.filter.featured_only": "Featured Only",
  "projects.filter.category_label": "Domain",
  "projects.filter.tag_label": "Technology",
  "projects.sort.label": "Sort By",
  "projects.sort.order": "Recommended Order",
  "projects.sort.latest": "Most Recent",
  "projects.sort.title": "Alphabetical",
  "projects.card.view_project": "View Deep Dive",
  "projects.card.source_code": "Source Code",
  "projects.card.live_demo": "Live Demo",
  "projects.card.featured_badge": "Featured",
  "projects.empty.title": "No projects match your filter criteria",
  "projects.empty.description": "Try adjusting your search keywords, domain, or technology tags.",
  "projects.empty.reset": "Reset Filters",
  "projects.count": "{count} projects found",
};

const dictionaryAr: Record<string, string> = {
  "projects.catalog.title": "المشاريع والأنظمة الهندسية",
  "projects.catalog.description": "منظومات إنتاجية وهياكل وكيلة.",
  "projects.search.placeholder": "ابحث في المشاريع...",
  "projects.filter.all_categories": "جميع المجالات",
  "projects.filter.all_tags": "جميع التقنيات",
  "projects.filter.featured_only": "المشاريع المميزة فقط",
  "projects.card.view_project": "استعراض تفاصيل المشروع",
  "projects.card.source_code": "الكود المصدري",
  "projects.card.live_demo": "تجربة حية",
  "projects.card.featured_badge": "مميز",
  "projects.empty.title": "لا توجد مشاريع تطابق خيارات البحث",
  "projects.empty.reset": "إعادة ضبط الفلاتر",
  "projects.count": "تم العثور على {count} مشروع",
};

describe("Project Catalog Presentation Integration (F017)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all initial projects with titles, summaries, and tags", () => {
    render(
      <LocalizationProvider locale="en" dictionary={dictionaryEn}>
        <ProjectCatalog
          initialProjects={BASELINE_PROJECTS_EN}
          categories={BASELINE_CATEGORIES}
          tags={BASELINE_TAGS}
          locale="en"
        />
      </LocalizationProvider>,
    );

    expect(screen.getByText("Autonomous Multimodal RAG Engine")).toBeInTheDocument();
    expect(screen.getByText("Enterprise Edge Gateway & Policy Router")).toBeInTheDocument();
    expect(screen.getByText("Real-Time Neural Speech & Synthesis Pipeline")).toBeInTheDocument();
    expect(
      screen.getByText("Adaptive Bilingual Design System & Component Studio"),
    ).toBeInTheDocument();
    expect(screen.getByText("4 projects found")).toBeInTheDocument();
  });

  it("filters projects reactively when typing in search input", () => {
    render(
      <LocalizationProvider locale="en" dictionary={dictionaryEn}>
        <ProjectCatalog
          initialProjects={BASELINE_PROJECTS_EN}
          categories={BASELINE_CATEGORIES}
          tags={BASELINE_TAGS}
          locale="en"
        />
      </LocalizationProvider>,
    );

    const searchInput = screen.getByRole("textbox", {
      name: /search projects by keyword, tech, or topic/i,
    });

    fireEvent.change(searchInput, { target: { value: "WebRTC" } });

    expect(screen.getByText("Real-Time Neural Speech & Synthesis Pipeline")).toBeInTheDocument();
    expect(screen.queryByText("Autonomous Multimodal RAG Engine")).not.toBeInTheDocument();
    expect(screen.getByText("1 projects found")).toBeInTheDocument();
  });

  it("filters featured projects when toggling the featured checkbox", () => {
    render(
      <LocalizationProvider locale="en" dictionary={dictionaryEn}>
        <ProjectCatalog
          initialProjects={BASELINE_PROJECTS_EN}
          categories={BASELINE_CATEGORIES}
          tags={BASELINE_TAGS}
          locale="en"
        />
      </LocalizationProvider>,
    );

    const checkbox = screen.getByRole("checkbox", { name: /featured only/i });
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    // 2 featured projects in baseline
    expect(screen.getByText("Autonomous Multimodal RAG Engine")).toBeInTheDocument();
    expect(screen.getByText("Enterprise Edge Gateway & Policy Router")).toBeInTheDocument();
    expect(
      screen.queryByText("Real-Time Neural Speech & Synthesis Pipeline"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("2 projects found")).toBeInTheDocument();
  });

  it("renders EmptyState and resets search criteria when reset button is clicked", () => {
    render(
      <LocalizationProvider locale="en" dictionary={dictionaryEn}>
        <ProjectCatalog
          initialProjects={BASELINE_PROJECTS_EN}
          categories={BASELINE_CATEGORIES}
          tags={BASELINE_TAGS}
          locale="en"
        />
      </LocalizationProvider>,
    );

    const searchInput = screen.getByRole("textbox", {
      name: /search projects by keyword, tech, or topic/i,
    });

    fireEvent.change(searchInput, { target: { value: "non-matching-quantum-mesh" } });

    expect(screen.getByText("No projects match your filter criteria")).toBeInTheDocument();
    expect(screen.getByText("0 projects found")).toBeInTheDocument();

    const resetButtons = screen.getAllByRole("button", { name: /reset filters/i });
    expect(resetButtons.length).toBeGreaterThan(0);
    fireEvent.click(resetButtons[0]!);

    // Returned to full initial list
    expect(screen.getByText("Autonomous Multimodal RAG Engine")).toBeInTheDocument();
    expect(screen.getByText("4 projects found")).toBeInTheDocument();
  });

  it("provides accessible links to project deep dives with correct locale prefixes", () => {
    render(
      <LocalizationProvider locale="en" dictionary={dictionaryEn}>
        <ProjectCatalog
          initialProjects={BASELINE_PROJECTS_EN}
          categories={BASELINE_CATEGORIES}
          tags={BASELINE_TAGS}
          locale="en"
        />
      </LocalizationProvider>,
    );

    const ragLinks = screen.getAllByRole("link", { name: /autonomous multimodal rag engine/i });
    expect(ragLinks[0]).toHaveAttribute("href", "/en/projects/autonomous-rag-engine");
  });

  it("renders with Arabic dynamic strings and RTL direction compatibility", () => {
    render(
      <LocalizationProvider locale="ar" dictionary={dictionaryAr}>
        <ProjectCatalog
          initialProjects={BASELINE_PROJECTS_AR}
          categories={BASELINE_CATEGORIES}
          tags={BASELINE_TAGS}
          locale="ar"
        />
      </LocalizationProvider>,
    );

    expect(screen.getByText("محرك استرجاع متعدد الوسائط مؤتمت (RAG)")).toBeInTheDocument();
    expect(screen.getByText("بوابة الطرفية المؤسسية وموجّه السياسات")).toBeInTheDocument();
    expect(screen.getByText("تم العثور على 4 مشروع")).toBeInTheDocument();
  });

  it("integrates with AdminEditProvider in inline edit mode", () => {
    render(
      <LocalizationProvider locale="en" dictionary={dictionaryEn}>
        <AdminEditProvider isAdmin={true} initialEditMode={true}>
          <ProjectCatalog
            initialProjects={BASELINE_PROJECTS_EN}
            categories={BASELINE_CATEGORIES}
            tags={BASELINE_TAGS}
            locale="en"
          />
        </AdminEditProvider>
      </LocalizationProvider>,
    );

    const editBtn = screen.getByRole("button", {
      name: /edit autonomous multimodal rag engine/i,
    });
    expect(editBtn).toBeInTheDocument();
  });
});
