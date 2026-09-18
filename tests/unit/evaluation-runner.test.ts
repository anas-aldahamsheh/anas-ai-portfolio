import { describe, it, expect, vi, beforeEach } from "vitest";
import { EvaluationRunner } from "@/ai/evaluation/evaluation-runner";
import { EvaluationCaseItem } from "@/ai/contracts/evaluation";
import { db } from "@/lib/db/client";

describe("EvaluationRunner", () => {
  let runner: EvaluationRunner;

  beforeEach(() => {
    vi.clearAllMocks();
    runner = new EvaluationRunner();

    // Mock DB insert to avoid network hang
    vi.spyOn(db, "insert").mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: "mock-run-id" }]),
      }),
    } as unknown as ReturnType<typeof db.insert>);
  });

  it("executes full benchmark suite and calculates valid metrics", async () => {
    const result = await runner.executeRun({ mode: "full", maxCases: 5 });

    expect(result.run).toBeDefined();
    expect(result.gate).toBeDefined();
    expect(result.caseResults.length).toBe(5);
    expect(result.run.totalCases).toBe(5);
    expect(result.run.averageLatencyMs).toBeGreaterThan(0);
    expect(result.gate.metricsSummary.recallAt5).toBeGreaterThan(0);
    expect(result.gate.metricsSummary.faithfulness).toBeGreaterThan(0);
  });

  it("filters retrieval-only cases when mode is retrieval", async () => {
    const result = await runner.executeRun({ mode: "retrieval", maxCases: 6 });

    expect(result.caseResults.length).toBeGreaterThan(0);
    for (const c of result.caseResults) {
      expect(["retrieval", "project_scoped"]).toContain(c.category);
      expect(c.metrics.recallAtK).toBeDefined();
    }
  });

  it("filters generation-only cases when mode is generation", async () => {
    const result = await runner.executeRun({ mode: "generation", maxCases: 6 });

    expect(result.caseResults.length).toBeGreaterThan(0);
    for (const c of result.caseResults) {
      expect(["generation", "negative_refusal", "security_injection"]).toContain(c.category);
      expect(c.metrics.faithfulness).toBeDefined();
    }
  });

  it("calculates balanced Arabic/English cross-lingual parity", async () => {
    const customCases: EvaluationCaseItem[] = [
      {
        id: "ar-1",
        datasetId: "ds-test",
        query: "استعلام عربي",
        localeCode: "ar",
        category: "retrieval",
        expectedSourceIds: ["src-proj-arabic-nlp"],
      },
      {
        id: "en-1",
        datasetId: "ds-test",
        query: "English query",
        localeCode: "en",
        category: "retrieval",
        expectedSourceIds: ["src-proj-arabic-nlp"],
      },
    ];

    const result = await runner.executeRun({ customCases });

    expect(result.gate.metricsSummary.arabicParityRatio).toBeGreaterThanOrEqual(0.9);
    expect(result.gate.verdict).toBe("PASSED");
  });

  it("evaluates negative refusal correctly without hallucinating", async () => {
    const negativeCase: EvaluationCaseItem = {
      id: "neg-1",
      datasetId: "ds-test",
      query: "What is Anas's favorite video game?",
      localeCode: "en",
      category: "negative_refusal",
      expectedRefusal: true,
      prohibitedUnsupportedClaims: ["Call of Duty"],
    };

    const result = await runner.executeRun({ customCases: [negativeCase] });

    expect(result.caseResults[0]?.passed).toBe(true);
    expect(result.caseResults[0]?.metrics.refusalCorrectness).toBe(1);
    expect(result.caseResults[0]?.generatedAnswer).toContain("not available");
  });

  it("blocks release gate if faithfulness falls below 95% threshold", async () => {
    const failingCase: EvaluationCaseItem = {
      id: "fail-1",
      datasetId: "ds-test",
      query: "Test failing claim",
      localeCode: "en",
      category: "generation",
      // Prohibit word that will be in answer to trigger unsupported claim detection
      prohibitedUnsupportedClaims: ["Arabic NLP Suite"],
    };

    const result = await runner.executeRun({ customCases: [failingCase] });

    expect(result.gate.verdict).toBe("BLOCKED");
    expect(result.gate.passed).toBe(false);
    expect(result.gate.regressions.some((r) => r.includes("unsupported claim") || r.includes("Faithfulness"))).toBe(true);
  });

  it("safely handles database persistence errors without failing the run", async () => {
    vi.spyOn(db, "insert").mockImplementation(() => {
      throw new Error("DB connection timeout");
    });

    const result = await runner.executeRun({ maxCases: 2 });

    expect(result.run).toBeDefined();
    expect(result.caseResults.length).toBe(2);
  });
});
