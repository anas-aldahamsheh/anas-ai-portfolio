import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { JobFitAnalyzer } from "@/modules/job-fit/presentation";
import { LocalizationProvider } from "@/modules/localization/presentation/localization-provider";

const mockTranslations: Record<string, string> = {
  "jobfit.title": "Job Fit Analyzer",
  "jobfit.subtitle": "Map any role requirements directly to verified engineering evidence.",
  "jobfit.privacy_badge": "In-Memory Confidential Analysis (Zero persistence)",
  "jobfit.input.label": "Target Job Description (JD)",
  "jobfit.input.placeholder": "Paste complete job description...",
  "jobfit.input.sample_label": "Quick sample JDs:",
  "jobfit.input.sample_1": "AI Platform Architect",
  "jobfit.input.sample_2": "Staff Full-Stack Engineer",
  "jobfit.input.char_count": "chars",
  "jobfit.action.analyze": "Analyze Job Alignment",
  "jobfit.action.analyzing": "Analyzing Requirements...",
  "jobfit.action.clear": "Clear",
  "jobfit.action.copy_report": "Copy Analysis Report",
  "jobfit.action.copied": "Report Copied!",
  "jobfit.status.supported": "Supported",
  "jobfit.status.partially_supported": "Partially Supported",
  "jobfit.status.not_found": "Not Found",
  "jobfit.summary.match_score": "Overall Alignment",
  "jobfit.summary.total": "Total Requirements",
  "jobfit.summary.strengths": "Key Architectural Strengths",
  "jobfit.summary.considerations": "Gaps & Considerations",
  "jobfit.filter.all": "All",
  "jobfit.filter.supported": "Supported",
  "jobfit.filter.partially_supported": "Partially Supported",
  "jobfit.filter.not_found": "Not Found",
  "jobfit.citation.sources": "Verified Evidence Sources:",
  "jobfit.uncertainty.label": "Precision Note:",
  "jobfit.empty.title": "Ready for Evidence-Bound Analysis",
  "jobfit.empty.desc": "Paste a job description or choose a sample above.",
  "jobfit.disclaimer": "Objective analysis strictly bound to verified portfolio evidence.",
};

function renderJobFitAnalyzer(locale: "en" | "ar" = "en") {
  return render(
    <LocalizationProvider locale={locale} dictionary={mockTranslations}>
      <JobFitAnalyzer />
    </LocalizationProvider>,
  );
}

describe("JobFitAnalyzer Presentation Component (F034)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it("renders empty state, privacy badge, and input elements on mount", () => {
    renderJobFitAnalyzer();

    expect(screen.getByText("Job Fit Analyzer")).toBeInTheDocument();
    expect(
      screen.getByText("In-Memory Confidential Analysis (Zero persistence)"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("jobfit-empty-state")).toBeInTheDocument();
    expect(screen.getByTestId("job-description-input")).toBeInTheDocument();
    expect(screen.getByTestId("sample-jd-1-button")).toBeInTheDocument();
    expect(screen.getByTestId("sample-jd-2-button")).toBeInTheDocument();
  });

  it("populates textarea when clicking a sample JD button", () => {
    renderJobFitAnalyzer();

    const sampleBtn = screen.getByTestId("sample-jd-1-button");
    fireEvent.click(sampleBtn);

    const textarea = screen.getByTestId("job-description-input") as HTMLTextAreaElement;
    expect(textarea.value).toContain("Senior AI Platform Architect");
    expect(screen.getByTestId("clear-jd-button")).toBeInTheDocument();
  });

  it("executes analysis, renders match score, summary cards, and filterable requirement cards", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          summary: {
            totalRequirements: 3,
            supportedCount: 1,
            partiallySupportedCount: 1,
            notFoundCount: 1,
            matchScore: 50,
            overview: "Solid foundation in AI systems architecture.",
            strengths: ["Hybrid RAG Systems"],
            gapsOrConsiderations: ["Embedded C++ firmware not found"],
          },
          requirements: [
            {
              id: "req-1",
              requirement: "Hybrid vector search with BGE-M3",
              status: "supported",
              confidence: 0.95,
              explanation: "Implemented in Enterprise Vector Search Platform.",
              citations: [
                {
                  sourceId: "proj-1",
                  sourceType: "project",
                  title: "Enterprise Vector Search Platform",
                  url: "/projects/proj-1",
                },
              ],
            },
            {
              id: "req-2",
              requirement: "Distributed event queuing",
              status: "partially_supported",
              confidence: 0.75,
              explanation: "Related streaming architecture present in AI Gateway.",
              citations: [],
            },
            {
              id: "req-3",
              requirement: "Embedded C++ Firmware",
              status: "not_found",
              confidence: 0.9,
              explanation: "No evidence found in portfolio.",
              citations: [],
            },
          ],
          telemetry: {
            retrievedCount: 5,
            rerankedCount: 3,
            tokenCount: 200,
            durationMs: 30,
            language: "en",
          },
        },
      }),
    } as unknown as Response);

    renderJobFitAnalyzer();

    // Populate with sample JD
    fireEvent.click(screen.getByTestId("sample-jd-1-button"));

    // Click Analyze
    fireEvent.click(screen.getByTestId("analyze-job-button"));

    // Await results
    await waitFor(() => {
      expect(screen.getByTestId("jobfit-results-container")).toBeInTheDocument();
    });

    expect(screen.getByTestId("match-score-display")).toHaveTextContent("50%");
    expect(screen.getByTestId("jobfit-overview-text")).toHaveTextContent(
      "Solid foundation in AI systems architecture.",
    );

    // Verify 3 requirement cards rendered initially
    expect(screen.getByTestId("requirement-card-req-1")).toBeInTheDocument();
    expect(screen.getByTestId("requirement-card-req-2")).toBeInTheDocument();
    expect(screen.getByTestId("requirement-card-req-3")).toBeInTheDocument();

    // Filter by Supported
    fireEvent.click(screen.getByTestId("filter-tab-supported"));
    expect(screen.getByTestId("requirement-card-req-1")).toBeInTheDocument();
    expect(screen.queryByTestId("requirement-card-req-2")).not.toBeInTheDocument();
    expect(screen.queryByTestId("requirement-card-req-3")).not.toBeInTheDocument();

    // Filter by Not Found
    fireEvent.click(screen.getByTestId("filter-tab-not-found"));
    expect(screen.queryByTestId("requirement-card-req-1")).not.toBeInTheDocument();
    expect(screen.getByTestId("requirement-card-req-3")).toBeInTheDocument();

    // Copy report
    fireEvent.click(screen.getByTestId("copy-report-button"));
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });

  it("handles Arabic locale rendering and RTL direction", () => {
    const { container } = renderJobFitAnalyzer("ar");
    expect(container.firstChild).toHaveAttribute("dir", "rtl");
  });
});
