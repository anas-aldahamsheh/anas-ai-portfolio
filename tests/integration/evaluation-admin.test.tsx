import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EvaluationAdminManager } from "@/modules/admin/presentation/evaluation-admin-manager";
import { LocalizationProvider } from "@/modules/localization/presentation/localization-provider";
import { BASELINE_EVALUATION_DASHBOARD_DATA } from "@/ai/evaluation/baseline-evaluation-data";

describe("EvaluationAdminManager Component (F037)", () => {
  const dictionaryEn: Record<string, string> = {
    "eval.admin.title": "AI Evaluation Control Center",
    "eval.admin.compare.title": "Quality Regression Comparison",
    "eval.admin.compare.no_regression": "No Critical Regression Detected",
    "eval.admin.compare.has_regression": "Regression Detected in Candidate",
  };

  const dictionaryAr: Record<string, string> = {
    "eval.admin.title": "مركز إدارة وتقييم جودة النماذج",
    "eval.admin.compare.title": "فحص انحدار الجودة ومقارنة الجولات",
    "eval.admin.compare.no_regression": "لا يوجد انحدار ملحوظ (جاهز للاعتماد)",
    "eval.admin.compare.has_regression": "تم رصد انحدار في بعض المقاييس",
  };

  const renderAdminManager = (locale: "en" | "ar" = "en") => {
    const dict = locale === "ar" ? dictionaryAr : dictionaryEn;
    return render(
      <LocalizationProvider locale={locale} dictionary={dict}>
        <EvaluationAdminManager initialData={BASELINE_EVALUATION_DASHBOARD_DATA} />
      </LocalizationProvider>,
    );
  };

  it("renders header and active runtime AI environment cards", () => {
    renderAdminManager();

    expect(screen.getByText("AI Evaluation Control Center")).toBeInTheDocument();
    expect(screen.getByText("Active Runtime AI Environment")).toBeInTheDocument();
    expect(screen.getByText("OpenAI GPT-4o-mini (gpt-4o-mini)")).toBeInTheDocument();
    expect(screen.getByText("BAAI/bge-m3 (1024 dense dimensions)")).toBeInTheDocument();
  });

  it("renders run history table with baseline and ablation runs", () => {
    renderAdminManager();

    expect(screen.getByText("Evaluation Run History")).toBeInTheDocument();
    expect(
      screen.getByTestId("admin-run-row-run-prod-candidate-v1"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("admin-run-row-run-dense-only-ablation"),
    ).toBeInTheDocument();
  });

  it("executes regression comparison and displays comparison banner and delta rows", async () => {
    // Mock the compare API call
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          baselineRun: BASELINE_EVALUATION_DASHBOARD_DATA.recentRuns[0],
          candidateRun: BASELINE_EVALUATION_DASHBOARD_DATA.recentRuns[1],
          deltas: {
            recallAt5: {
              baseline: 0.932,
              candidate: 0.781,
              delta: -0.151,
              status: "regressed",
            },
            faithfulness: {
              baseline: 0.985,
              candidate: 0.912,
              delta: -0.073,
              status: "regressed",
            },
            averageLatencyMs: {
              baseline: 272,
              candidate: 198,
              delta: -74,
              status: "improved",
            },
          },
          hasRegression: true,
          regressionCount: 2,
          improvementCount: 1,
        },
      }),
    } as unknown as Response);

    renderAdminManager();

    const compareBtn = screen.getByTestId("compare-runs-btn");
    fireEvent.click(compareBtn);

    await waitFor(() => {
      expect(screen.getByTestId("comparison-results")).toBeInTheDocument();
    });

    expect(screen.getByText("Regression Detected in Candidate")).toBeInTheDocument();
    expect(screen.getByTestId("delta-row-recallAt5")).toBeInTheDocument();
    expect(screen.getByTestId("delta-row-averageLatencyMs")).toBeInTheDocument();
  });

  it("renders correctly in Arabic with RTL orientation", () => {
    renderAdminManager("ar");

    const container = screen.getByTestId("evaluation-admin-manager");
    expect(container).toHaveAttribute("dir", "rtl");
    expect(screen.getByText("مركز إدارة وتقييم جودة النماذج")).toBeInTheDocument();
  });
});
