import { describe, it, expect, beforeEach, vi } from "vitest";
import { EvaluationService } from "@/ai/evaluation/evaluation-service";
import { db } from "@/lib/db/client";
import { BASELINE_EVALUATION_DASHBOARD_DATA } from "@/ai/evaluation/baseline-evaluation-data";

describe("EvaluationService (F037)", () => {
  let service: EvaluationService;

  beforeEach(() => {
    service = new EvaluationService();
    vi.restoreAllMocks();

    vi.spyOn(db, "select").mockReturnValue({
      from: vi.fn().mockReturnValue({
        leftJoin: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      }),
    } as unknown as ReturnType<typeof db.select>);
  });

  it("returns verified baseline evaluation data when database has no runs", async () => {

    const data = await service.getDashboardData();
    expect(data).toBeDefined();
    expect(data.aggregateMetrics).toHaveLength(BASELINE_EVALUATION_DASHBOARD_DATA.aggregateMetrics.length);
    expect(data.recentRuns).toHaveLength(BASELINE_EVALUATION_DASHBOARD_DATA.recentRuns.length);
    expect(data.methodology.principles.length).toBeGreaterThan(0);
    expect(data.languageParity.parityRatio).toBeGreaterThan(0.9);
  });

  it("retrieves run by ID from recent runs or baselines", async () => {
    const run = await service.getRunById("run-prod-candidate-v1");
    expect(run).toBeDefined();
    expect(run?.id).toBe("run-prod-candidate-v1");
    expect(run?.metrics.faithfulness).toBe(0.985);
  });

  it("returns null when run ID is not found", async () => {
    const run = await service.getRunById("non-existent-run-id");
    expect(run).toBeNull();
  });

  it("accurately computes regression comparison between baseline and ablation candidate", async () => {
    // Compare baseline (with reranker) vs dense-only ablation (without reranker)
    const comparison = await service.compareRuns(
      "run-prod-candidate-v1",
      "run-dense-only-ablation",
    );

    expect(comparison).toBeDefined();
    if (comparison) {
      expect(comparison.hasRegression).toBe(true);
      expect(comparison.regressionCount).toBeGreaterThan(0);

      // Recall@5 should show regression
      const recallDelta = comparison.deltas["recallAt5"];
      expect(recallDelta).toBeDefined();
      expect(recallDelta?.status).toBe("regressed");
      expect(recallDelta?.delta).toBeLessThan(0);

      // Faithfulness should show regression
      const faithfulnessDelta = comparison.deltas["faithfulness"];
      expect(faithfulnessDelta).toBeDefined();
      expect(faithfulnessDelta?.status).toBe("regressed");
    }
  });

  it("returns stable or improved status when comparing identical or superior runs", async () => {
    const comparison = await service.compareRuns(
      "run-prod-candidate-v1",
      "run-prod-candidate-v1",
    );

    expect(comparison).toBeDefined();
    if (comparison) {
      expect(comparison.hasRegression).toBe(false);
      expect(comparison.regressionCount).toBe(0);

      for (const delta of Object.values(comparison.deltas)) {
        expect(delta.status).toBe("stable");
        expect(delta.delta).toBe(0);
      }
    }
  });

  it("returns null when comparing non-existent run IDs", async () => {
    const comparison = await service.compareRuns("invalid-1", "invalid-2");
    expect(comparison).toBeNull();
  });

  it("caches dashboard data and allows cache invalidation", async () => {
    const data1 = await service.getDashboardData();
    const data2 = await service.getDashboardData();
    expect(data1).toBe(data2);

    service.invalidateCache();
    const data3 = await service.getDashboardData();
    expect(data3).toBeDefined();
  });
});
