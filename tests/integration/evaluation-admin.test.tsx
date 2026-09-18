import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EvaluationAdminManager } from "@/modules/admin/presentation/evaluation-admin-manager";
import { LocalizationProvider } from "@/modules/localization/presentation/localization-provider";
import { BASELINE_EVALUATION_DASHBOARD_DATA } from "@/ai/evaluation/baseline-evaluation-data";

describe("EvaluationAdminManager Component (F037)", () => {
  const dictionaryEn: Record<string, string> = {
    "eval.admin.title": "AI Evaluation Control Center",
    "eval.admin.env.title": "Active Runtime AI Environment",
    "eval.admin.env.generation": "Generation",
    "eval.admin.env.embedding": "Embedding",
    "eval.admin.env.reranker": "Reranker",
    "eval.admin.env.retrieval_policy": "Retrieval Policy",
    "eval.runner.title": "AI Evaluation Runner & Regression Gate",
    "eval.runner.desc": "Execute automated benchmark test suites",
    "eval.runner.trigger": "Run Benchmark Suite",
    "eval.runner.running": "Running Benchmark Suite...",
    "eval.runner.mode.label": "Evaluation Mode:",
    "eval.runner.mode.full": "Full Suite",
    "eval.runner.mode.retrieval": "Retrieval Only",
    "eval.runner.mode.generation": "Generation & Safety",
    "eval.runner.gate.title": "Release Gate Decision",
    "eval.runner.gate.passed": "GATE PASSED",
    "eval.runner.gate.warning": "GATE WARNING",
    "eval.runner.gate.blocked": "GATE BLOCKED",
    "eval.admin.compare.title": "Quality Regression Comparison",
    "eval.admin.compare.no_regression": "No Critical Regression Detected",
    "eval.admin.compare.has_regression": "Regression Detected in Candidate",
  };

  const dictionaryAr: Record<string, string> = {
    "eval.admin.title": "مركز إدارة وتقييم جودة النماذج",
    "eval.admin.env.title": "بيئة الذكاء الاصطناعي التشغيلية النشطة",
    "eval.admin.env.generation": "نموذج التوليد",
    "eval.admin.env.embedding": "نموذج التضمين",
    "eval.admin.env.reranker": "نموذج إعادة الترتيب",
    "eval.admin.env.retrieval_policy": "سياسة استرجاع البيانات",
    "eval.runner.title": "تشغيل حزمة تقييم الذكاء الاصطناعي وبوابة الانحدار",
    "eval.runner.desc": "تنفيذ اختبارات معيارية مؤتمتة",
    "eval.runner.trigger": "بدء فحص الحزمة والمعايير",
    "eval.runner.running": "جارٍ تشغيل التقييم والفحص...",
    "eval.runner.mode.label": "نطاق التقييم:",
    "eval.runner.mode.full": "شامل",
    "eval.runner.mode.retrieval": "الاسترجاع فقط",
    "eval.runner.mode.generation": "التوليد والأمان",
    "eval.runner.gate.title": "قرار بوابة الاعتماد",
    "eval.runner.gate.passed": "اجتاز بنجاح",
    "eval.runner.gate.warning": "تحذير أداء",
    "eval.runner.gate.blocked": "محظور",
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

  it("triggers AI evaluation runner and renders gate verdict and case results", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          run: {
            ...BASELINE_EVALUATION_DASHBOARD_DATA.recentRuns[0],
            id: "run-new-test",
            passedCases: 4,
            totalCases: 4,
          },
          gate: {
            verdict: "PASSED",
            passed: true,
            message: "All release gates passed",
            regressions: [],
            warnings: [],
            metricsSummary: {
              recallAt5: 0.94,
              precisionAt5: 0.88,
              mrr: 0.9,
              faithfulness: 0.99,
              citationCorrectness: 0.98,
              arabicParityRatio: 0.97,
              averageLatencyMs: 140,
            },
          },
          caseResults: [
            {
              caseId: "c1",
              query: "Test query 1",
              localeCode: "en",
              category: "retrieval",
              passed: true,
              latencyMs: 45,
              metrics: { recallAtK: 1 },
            },
          ],
        },
      }),
    } as unknown as Response);

    renderAdminManager();

    expect(screen.getByTestId("evaluation-runner-card")).toBeInTheDocument();
    const triggerBtn = screen.getByTestId("btn-trigger-eval-runner");
    fireEvent.click(triggerBtn);

    await waitFor(() => {
      expect(screen.getByTestId("runner-result-panel")).toBeInTheDocument();
    });

    expect(screen.getByText("GATE PASSED")).toBeInTheDocument();
    expect(screen.getByText("94.0%")).toBeInTheDocument();
    expect(screen.getByText("99.0%")).toBeInTheDocument();
  });
});

