import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AiLabView } from "@/modules/ai-lab/presentation";
import { LocalizationProvider } from "@/modules/localization/presentation/localization-provider";

const mockTranslations: Record<string, string> = {
  "lab.title": "AI Engineering Lab",
  "lab.subtitle": "Interactive demonstrations of production RAG, vector search, and reranking.",
  "lab.badge": "Real Execution • Zero Mockups",
  "lab.params.title": "Demo Configuration & Parameters",
  "lab.params.query": "Evaluation Query / Prompt:",
  "lab.params.topK": "Top Candidates (Top-K):",
  "lab.params.denseWeight": "Dense Weight (Vector):",
  "lab.params.candidateCount": "Candidate Pool Size:",
  "lab.params.topN": "Rerank Top-N Output:",
  "lab.params.threshold": "Relevance Threshold:",
  "lab.params.schemaType": "Extraction Target Schema:",
  "lab.params.claim": "Factual Claim to Verify:",
  "lab.params.text": "Input Context Text:",
  "lab.run.button": "Execute Real Algorithm",
  "lab.run.running": "Executing Real Pipeline...",
  "lab.telemetry.title": "Live Execution Telemetry",
  "lab.telemetry.latency": "Latency:",
  "lab.telemetry.real": "Authentic Execution:",
  "lab.telemetry.tokens": "Tokens Used:",
  "lab.results.title": "Live Output & Pipeline Trace",
  "lab.results.raw": "Raw Output JSON",
  "lab.results.visual": "Interactive Visual Analysis",
  "lab.error.failed": "Failed to execute demonstration",
};

function renderAiLabView(locale: "en" | "ar" = "en") {
  return render(
    <LocalizationProvider locale={locale} dictionary={mockTranslations}>
      <AiLabView />
    </LocalizationProvider>,
  );
}

describe("AiLabView Presentation Component (F035)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it("renders page header, authenticity badge, and all demo tabs on mount", () => {
    renderAiLabView();

    expect(screen.getByText("AI Engineering Lab")).toBeInTheDocument();
    expect(screen.getByText("Real Execution • Zero Mockups")).toBeInTheDocument();
    expect(screen.getByTestId("lab-tab-hybrid-search")).toBeInTheDocument();
    expect(screen.getByTestId("lab-tab-reranking")).toBeInTheDocument();
    expect(screen.getByTestId("lab-tab-retrieval-comparison")).toBeInTheDocument();
    expect(screen.getByTestId("lab-tab-structured-extraction")).toBeInTheDocument();
    expect(screen.getByTestId("lab-tab-citation-verification")).toBeInTheDocument();
  });

  it("switches demo tabs and renders relevant parameter controls", async () => {
    renderAiLabView();

    // Default tab is hybrid-search
    expect(screen.getByTestId("param-dense-weight-slider")).toBeInTheDocument();

    // Switch to reranking tab
    fireEvent.click(screen.getByTestId("lab-tab-reranking"));
    expect(screen.getByTestId("param-candidate-count-select")).toBeInTheDocument();
    expect(screen.getByTestId("param-topn-select")).toBeInTheDocument();

    // Switch to structured-extraction tab
    fireEvent.click(screen.getByTestId("lab-tab-structured-extraction"));
    expect(screen.getByTestId("param-schema-select")).toBeInTheDocument();
    expect(screen.getByTestId("param-text-textarea")).toBeInTheDocument();

    // Switch to citation-verification tab
    fireEvent.click(screen.getByTestId("lab-tab-citation-verification"));
    expect(screen.getByTestId("param-claim-textarea")).toBeInTheDocument();
  });

  it("applies sample presets to update inputs", async () => {
    renderAiLabView();

    const sampleBtn = screen.getByTestId("lab-sample-1");
    fireEvent.click(sampleBtn);

    const queryInput = screen.getByTestId("param-query-input") as HTMLInputElement;
    expect(queryInput.value).toContain("microservices");
  });

  it("triggers execution and displays visual results, telemetry, and view toggle", async () => {
    // Mock successful run response
    const mockResult = {
      demoSlug: "hybrid-search",
      type: "hybrid_search",
      data: {
        query: "Production RAG architecture",
        denseWeight: 0.5,
        sparseWeight: 0.5,
        topK: 2,
        results: [
          {
            rank: 1,
            id: "res-1",
            title: "Production RAG Pipeline",
            sourceType: "project",
            score: 0.9521,
            denseRank: 1,
            sparseRank: 2,
            snippet: "Full hybrid retrieval architecture combining BGE-M3 vectors.",
          },
        ],
      },
      telemetry: {
        latencyMs: 38,
        realExecution: true,
        tokensUsed: 120,
      },
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockResult }),
    });

    renderAiLabView();

    const runBtn = screen.getByTestId("lab-run-button");
    fireEvent.click(runBtn);

    await waitFor(() => {
      expect(screen.getByText("Live Output & Pipeline Trace")).toBeInTheDocument();
      expect(screen.getByText("38ms")).toBeInTheDocument();
      expect(screen.getByText("Production RAG Pipeline")).toBeInTheDocument();
      expect(screen.getByText("RRF: 0.9521")).toBeInTheDocument();
    });

    // Toggle to raw JSON view
    fireEvent.click(screen.getByTestId("viewmode-raw-button"));
    expect(screen.getByTestId("raw-output-json")).toBeInTheDocument();

    // Toggle back to visual view
    fireEvent.click(screen.getByTestId("viewmode-visual-button"));
    expect(screen.getByTestId("visual-hybrid-results")).toBeInTheDocument();
  });
});
