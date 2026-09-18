import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EvaluationDashboard } from "@/modules/evaluation/presentation/evaluation-dashboard";
import { LocalizationProvider } from "@/modules/localization/presentation/localization-provider";
import { BASELINE_EVALUATION_DASHBOARD_DATA } from "@/ai/evaluation/baseline-evaluation-data";

describe("EvaluationDashboard Component (F037)", () => {
  const dictionaryEn: Record<string, string> = {
    "eval.title": "AI Quality Evaluation Dashboard",
    "eval.subtitle": "Measured retrieval and generation quality benchmarks.",
    "eval.tab.metrics": "Aggregate Metrics",
    "eval.tab.methodology": "Methodology & Datasets",
    "eval.tab.benchmarks": "Benchmark Runs",
    "eval.parity.title": "Arabic / English Language Parity",
    "eval.parity.desc": "Arabic queries are evaluated with identical rigor to English cases.",
    "eval.parity.balanced": "Balanced Parity",
    "eval.runs.title": "Measured Evaluation Runs",
    "eval.runs.baseline": "Active Baseline",
    "eval.pledge.title": "Measured Values Pledge",
    "eval.pledge.desc": "Zero invented metrics.",
  };

  const dictionaryAr: Record<string, string> = {
    "eval.title": "لوحة تقييم الجودة الهندسية",
    "eval.subtitle": "مقاييس جودة الاسترجاع والتوليد المقاسة فعلياً.",
    "eval.tab.metrics": "المقاييس الشاملة",
    "eval.tab.methodology": "المنهجية ومجموعات الاختبار",
    "eval.tab.benchmarks": "مقارنات النماذج والتجارب",
    "eval.parity.title": "تكافؤ الجودة بين العربية والإنجليزية",
    "eval.parity.desc": "يتم تقييم الاستفسارات باللغة العربية بنفس المعايير الصارمة.",
    "eval.parity.balanced": "تكافؤ متوازن",
    "eval.runs.title": "سجل جولات التقييم المقاسة",
    "eval.runs.baseline": "الجولة المعتمدة الحالية",
    "eval.pledge.title": "تعهد الشفافية والبيانات المقاسة",
    "eval.pledge.desc": "لا يتم استخدام أي أرقام مفبركة.",
  };

  const renderDashboard = (locale: "en" | "ar" = "en") => {
    const dict = locale === "ar" ? dictionaryAr : dictionaryEn;
    return render(
      <LocalizationProvider locale={locale} dictionary={dict}>
        <EvaluationDashboard initialData={BASELINE_EVALUATION_DASHBOARD_DATA} />
      </LocalizationProvider>,
    );
  };

  it("renders header, title, and baseline dataset badge", () => {
    renderDashboard();

    expect(screen.getByText("AI Quality Evaluation Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Portfolio Golden Benchmark v1")).toBeInTheDocument();
    expect(screen.getByTestId("eval-tabs")).toBeInTheDocument();
  });

  it("renders metrics view with cards and filters by category", () => {
    renderDashboard();

    expect(screen.getByTestId("eval-metrics-view")).toBeInTheDocument();
    expect(screen.getByText("Faithfulness / Groundedness")).toBeInTheDocument();
    expect(screen.getByText("Retrieval Recall@5")).toBeInTheDocument();
    expect(screen.getByText("End-to-End Latency (P95)")).toBeInTheDocument();

    // Click retrieval filter
    const retrievalBtn = screen.getByTestId("filter-retrieval");
    fireEvent.click(retrievalBtn);

    expect(screen.getByText("Retrieval Recall@5")).toBeInTheDocument();
    expect(screen.queryByText("Faithfulness / Groundedness")).not.toBeInTheDocument();

    // Reset filter to all
    const allBtn = screen.getByTestId("filter-all");
    fireEvent.click(allBtn);
    expect(screen.getByText("Faithfulness / Groundedness")).toBeInTheDocument();
  });

  it("switches to Methodology tab and displays principles and golden datasets", () => {
    renderDashboard();

    const methodologyTab = screen.getByTestId("eval-tab-methodology");
    fireEvent.click(methodologyTab);

    expect(screen.getByTestId("eval-methodology-view")).toBeInTheDocument();
    expect(screen.getByText("Evaluation Engineering Principles")).toBeInTheDocument();
    expect(screen.getByText("Benchmark Golden Datasets")).toBeInTheDocument();
    expect(screen.getByText("Automated Release Gates")).toBeInTheDocument();
  });

  it("switches to Benchmark Runs tab and displays active and ablation runs", () => {
    renderDashboard();

    const benchmarksTab = screen.getByTestId("eval-tab-benchmarks");
    fireEvent.click(benchmarksTab);

    expect(screen.getByTestId("eval-benchmarks-view")).toBeInTheDocument();
    expect(screen.getByTestId("benchmark-run-run-prod-candidate-v1")).toBeInTheDocument();
    expect(screen.getByTestId("benchmark-run-run-dense-only-ablation")).toBeInTheDocument();
    expect(screen.getByText("Active Baseline")).toBeInTheDocument();
  });

  it("renders transparency pledge", () => {
    renderDashboard();

    expect(screen.getByText("Measured Values Pledge")).toBeInTheDocument();
    expect(screen.getByText("Zero invented metrics.")).toBeInTheDocument();
  });

  it("renders correctly in Arabic with RTL direction", () => {
    renderDashboard("ar");

    const container = screen.getByTestId("evaluation-dashboard-container");
    expect(container).toHaveAttribute("dir", "rtl");
    expect(screen.getByText("لوحة تقييم الجودة الهندسية")).toBeInTheDocument();
    expect(screen.getByText("تكافؤ متوازن")).toBeInTheDocument();
  });
});
