import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectDeepDive } from "@/modules/projects/presentation";
import { BASELINE_PROJECTS_EN, BASELINE_PROJECTS_AR } from "@/modules/projects/domain/baseline";
import { LocalizationProvider } from "@/modules/localization/presentation/localization-provider";
import { AdminEditProvider } from "@/modules/admin/presentation";
import type { Project } from "@/modules/projects/domain/types";

const deepDiveDictEn: Record<string, string> = {
  "project.detail.overview": "Overview",
  "project.detail.problem": "Problem & Context",
  "project.detail.constraints": "Engineering Constraints",
  "project.detail.solution": "Solution & Strategy",
  "project.detail.architecture": "System Architecture & Patterns",
  "project.detail.implementation": "Implementation Details",
  "project.detail.challenges": "Key Challenges & Mitigations",
  "project.detail.tradeoffs": "Decisions & Trade-offs",
  "project.detail.results": "Impact & Measurable Results",
  "project.detail.tech_stack": "Technologies & Tools",
  "project.detail.scope_badge": "Scoped Retrieval: Project Evidence Only",
  "project.detail.ask_ai": "Ask AI About This Project",
  "project.detail.ask_ai_desc":
    "Ask verified architectural, code, or design questions grounded specifically in this project's evidence.",
  "project.detail.ask_ai_cta": "Launch AI Project Query",
  "project.detail.back_to_projects": "Back to Projects",
  "project.detail.related_projects": "Related Projects",
  "projects.card.view_project": "View Deep Dive",
  "projects.card.source_code": "Source Code",
  "projects.card.live_demo": "Live Demo",
  "projects.card.featured_badge": "Featured",
};

const deepDiveDictAr: Record<string, string> = {
  "project.detail.overview": "نظرة عامة",
  "project.detail.problem": "المشكلة والسياق العام",
  "project.detail.constraints": "القيود والمتطلبات الهندسية",
  "project.detail.solution": "الحل والمعالجة",
  "project.detail.architecture": "البنية المعمارية والأنماط",
  "project.detail.implementation": "تفاصيل التنفيذ والتقنيات",
  "project.detail.challenges": "أبرز التحديات والمعالجات",
  "project.detail.tradeoffs": "القرارات المعمارية والمفاضلات",
  "project.detail.results": "الأثر والنتائج القابلة للقياس",
  "project.detail.tech_stack": "التقنيات والأدوات المستخدمة",
  "project.detail.scope_badge": "نطاق استرجاع مخصص: براهين المشروع فقط",
  "project.detail.ask_ai": "اسأل الذكاء الاصطناعي عن هذا المشروع",
  "project.detail.ask_ai_desc":
    "اطرح أسئلة برمجية ومعمارية موثقة ومستندة حصريًا إلى براهين هذا المشروع.",
  "project.detail.ask_ai_cta": "بدء محادثة ذكية عن المشروع",
  "project.detail.back_to_projects": "العودة إلى المشاريع",
  "project.detail.related_projects": "مشاريع ذات صلة",
  "projects.card.view_project": "استعراض تفاصيل المشروع",
  "projects.card.source_code": "الكود المصدري",
  "projects.card.live_demo": "معاينة حية",
  "projects.card.featured_badge": "مميز",
};

describe("Project Deep Dive Presentation Integration (F018)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all non-empty narrative blocks for full project", () => {
    const project = BASELINE_PROJECTS_EN[0]!;
    const related = [BASELINE_PROJECTS_EN[1]!];

    render(
      <LocalizationProvider locale="en" dictionary={deepDiveDictEn}>
        <ProjectDeepDive project={project} relatedProjects={related} locale="en" />
      </LocalizationProvider>,
    );

    // Title & Summary
    expect(screen.getByText(project.title)).toBeInTheDocument();
    expect(screen.getByText(project.summary)).toBeInTheDocument();

    // Narrative section headings
    expect(screen.getByText("Problem & Context")).toBeInTheDocument();
    expect(screen.getByText("Engineering Constraints")).toBeInTheDocument();
    expect(screen.getByText("Solution & Strategy")).toBeInTheDocument();
    expect(screen.getByText("System Architecture & Patterns")).toBeInTheDocument();
    expect(screen.getByText("Implementation Details")).toBeInTheDocument();
    expect(screen.getByText("Key Challenges & Mitigations")).toBeInTheDocument();
    expect(screen.getByText("Decisions & Trade-offs")).toBeInTheDocument();
    expect(screen.getByText("Impact & Measurable Results")).toBeInTheDocument();

    // Content snippets
    expect(screen.getByText(/Traditional semantic vector search struggles/)).toBeInTheDocument();
    expect(screen.getByText(/Sub-250ms retrieval latency budget/)).toBeInTheDocument();
    expect(screen.getByText(/Achieved 99.4% citation accuracy/)).toBeInTheDocument();

    // Tech stack badges
    expect(screen.getByText("Technologies & Tools")).toBeInTheDocument();
    project.tags.forEach((tag) => {
      expect(screen.getAllByText(tag).length).toBeGreaterThan(0);
    });

    // Related projects
    expect(screen.getByText("Related Projects")).toBeInTheDocument();
    expect(screen.getByText(BASELINE_PROJECTS_EN[1]!.title)).toBeInTheDocument();
  });

  it("does not render empty headings when optional fields are null or empty string", () => {
    const sparseProject: Project = {
      id: "proj-sparse",
      slug: "sparse-test-project",
      status: "PUBLISHED",
      orderIndex: 99,
      isFeatured: false,
      coverImageUrl: null,
      repoUrl: null,
      demoUrl: null,
      title: "Sparse Architecture Prototype",
      summary: "A minimal prototype testing graceful absence of narrative sections.",
      // problem, constraints, architecture, challenges, tradeoffs, results are omitted/null
      problem: null,
      constraints: "  ", // blank string should also be omitted
      solution: "We solved this with a clean pipeline.",
      architecture: undefined,
      implementation: null,
      challenges: "",
      decisionsTradeoffs: null,
      results: null,
      categories: ["Agentic AI"],
      tags: ["TypeScript"],
      createdAt: "2026-03-01T00:00:00.000Z",
      updatedAt: "2026-03-01T00:00:00.000Z",
    };

    render(
      <LocalizationProvider locale="en" dictionary={deepDiveDictEn}>
        <ProjectDeepDive project={sparseProject} relatedProjects={[]} locale="en" />
      </LocalizationProvider>,
    );

    // Only Solution should be present
    expect(screen.getByText("Solution & Strategy")).toBeInTheDocument();
    expect(screen.getByText("We solved this with a clean pipeline.")).toBeInTheDocument();

    // Absent fields must NOT leave broken headings
    expect(screen.queryByText("Problem & Context")).not.toBeInTheDocument();
    expect(screen.queryByText("Engineering Constraints")).not.toBeInTheDocument();
    expect(screen.queryByText("System Architecture & Patterns")).not.toBeInTheDocument();
    expect(screen.queryByText("Implementation Details")).not.toBeInTheDocument();
    expect(screen.queryByText("Key Challenges & Mitigations")).not.toBeInTheDocument();
    expect(screen.queryByText("Decisions & Trade-offs")).not.toBeInTheDocument();
    expect(screen.queryByText("Impact & Measurable Results")).not.toBeInTheDocument();

    // Related projects section omitted when empty
    expect(screen.queryByText("Related Projects")).not.toBeInTheDocument();
  });

  it("renders Ask AI About This Project card with scoped retrieval parameters", () => {
    const project = BASELINE_PROJECTS_EN[0]!;

    render(
      <LocalizationProvider locale="en" dictionary={deepDiveDictEn}>
        <ProjectDeepDive project={project} relatedProjects={[]} locale="en" />
      </LocalizationProvider>,
    );

    expect(screen.getByText("Ask AI About This Project")).toBeInTheDocument();
    expect(screen.getByText("Scoped Retrieval: Project Evidence Only")).toBeInTheDocument();

    const expectedHref = `/en/chat?project=${project.slug}&projectId=${project.id}`;
    const aiLinks = screen.getAllByRole("link").filter((l) => {
      const href = l.getAttribute("href");
      return href?.startsWith(expectedHref);
    });

    expect(aiLinks.length).toBeGreaterThan(0);
  });

  it("renders properly in Arabic locale with translated headings and RTL layout", () => {
    const projectAr = BASELINE_PROJECTS_AR[0]!;

    render(
      <LocalizationProvider locale="ar" dictionary={deepDiveDictAr}>
        <ProjectDeepDive project={projectAr} relatedProjects={[]} locale="ar" />
      </LocalizationProvider>,
    );

    expect(screen.getByText("المشكلة والسياق العام")).toBeInTheDocument();
    expect(screen.getByText("القيود والمتطلبات الهندسية")).toBeInTheDocument();
    expect(screen.getByText("الحل والمعالجة")).toBeInTheDocument();
    expect(screen.getByText("اسأل الذكاء الاصطناعي عن هذا المشروع")).toBeInTheDocument();
    expect(screen.getByText("العودة إلى المشاريع")).toBeInTheDocument();
  });

  it("displays admin inline edit buttons when user is admin and edit mode is active", () => {
    const project = BASELINE_PROJECTS_EN[0]!;

    render(
      <AdminEditProvider isAdmin={true} initialEditMode={true}>
        <LocalizationProvider locale="en" dictionary={deepDiveDictEn}>
          <ProjectDeepDive project={project} relatedProjects={[]} locale="en" />
        </LocalizationProvider>
      </AdminEditProvider>,
    );

    const editButtons = screen.getAllByRole("button", { name: /Edit/i });
    expect(editButtons.length).toBeGreaterThan(0);
  });
});
