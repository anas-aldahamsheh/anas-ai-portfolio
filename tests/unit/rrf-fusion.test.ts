import { describe, it, expect } from "vitest";
import { ReciprocalRankFusion, LinearScoreFusion } from "@/ai/retrieval/fusion/rrf-fusion";
import { ScoredCandidate } from "@/ai/contracts/retrieval";

function createMockCandidate(
  id: string,
  title: string,
  score: number,
  retrieverType: "dense" | "sparse",
): ScoredCandidate {
  return {
    id,
    documentId: `doc-${id}`,
    citationId: `cit:project:${id}:0`,
    content: `Sample content for ${title}`,
    score,
    sourceType: "project",
    sourceId: id,
    title,
    locale: "en",
    headingHierarchy: [],
    tags: ["ai"],
    retrieverType,
  };
}

describe("Reciprocal Rank Fusion (RRF)", () => {
  const rrf = new ReciprocalRankFusion(60);

  it("calculates correct RRF score for single-list candidates", () => {
    const dense: ScoredCandidate[] = [
      createMockCandidate("c1", "Candidate 1", 0.95, "dense"),
      createMockCandidate("c2", "Candidate 2", 0.85, "dense"),
    ];

    const fused = rrf.fuse(dense, [], { rrfK: 60 });

    expect(fused.length).toBe(2);
    // Rank 1 -> 1 / (60 + 1) = 1 / 61 = 0.01639344...
    expect(fused[0]?.score).toBeCloseTo(1 / 61, 5);
    expect(fused[0]?.retrieverType).toBe("dense");
    expect(fused[0]?.denseRank).toBe(1);

    // Rank 2 -> 1 / (60 + 2) = 1 / 62 = 0.016129...
    expect(fused[1]?.score).toBeCloseTo(1 / 62, 5);
    expect(fused[1]?.denseRank).toBe(2);
  });

  it("combines scores when candidates appear in both dense and sparse lists", () => {
    const dense: ScoredCandidate[] = [
      createMockCandidate("shared-1", "Shared Item 1", 0.9, "dense"), // dense rank 1
      createMockCandidate("dense-only", "Dense Item", 0.8, "dense"), // dense rank 2
    ];

    const sparse: ScoredCandidate[] = [
      createMockCandidate("sparse-only", "Sparse Item", 5.2, "sparse"), // sparse rank 1
      createMockCandidate("shared-1", "Shared Item 1", 4.1, "sparse"), // sparse rank 2
    ];

    const fused = rrf.fuse(dense, sparse, { rrfK: 60 });

    // shared-1 has rank 1 in dense (1/61) and rank 2 in sparse (1/62)
    // total = 1/61 + 1/62 = 0.0163934 + 0.016129 = 0.032522
    // sparse-only has rank 1 in sparse (1/61) = 0.0163934
    // dense-only has rank 2 in dense (1/62) = 0.016129

    expect(fused[0]?.id).toBe("shared-1");
    expect(fused[0]?.retrieverType).toBe("hybrid");
    expect(fused[0]?.score).toBeCloseTo(1 / 61 + 1 / 62, 5);
    expect(fused[0]?.denseRank).toBe(1);
    expect(fused[0]?.sparseRank).toBe(2);

    expect(fused[1]?.id).toBe("sparse-only");
    expect(fused[1]?.retrieverType).toBe("sparse");

    expect(fused[2]?.id).toBe("dense-only");
    expect(fused[2]?.retrieverType).toBe("dense");
  });

  it("enforces candidateCap and minScoreThreshold limits", () => {
    const dense: ScoredCandidate[] = Array.from({ length: 30 }, (_, i) =>
      createMockCandidate(`d-${i}`, `Dense ${i}`, 1.0 - i * 0.02, "dense"),
    );

    const fusedCap = rrf.fuse(dense, [], { candidateCap: 5 });
    expect(fusedCap.length).toBe(5);

    // Filter with minScoreThreshold
    const fusedThresh = rrf.fuse(dense, [], { minScoreThreshold: 1 / 65 });
    expect(fusedThresh.length).toBe(5); // ranks 1 through 5 satisfy >= 1/65
  });

  it("fuses candidates correctly using LinearScoreFusion", () => {
    const linear = new LinearScoreFusion(0.5);

    const dense: ScoredCandidate[] = [
      createMockCandidate("c1", "Candidate 1", 0.8, "dense"),
      createMockCandidate("c2", "Candidate 2", 0.4, "dense"),
    ];

    const sparse: ScoredCandidate[] = [
      createMockCandidate("c2", "Candidate 2", 10.0, "sparse"),
      createMockCandidate("c1", "Candidate 1", 5.0, "sparse"),
    ];

    const fused = linear.fuse(dense, sparse, { alpha: 0.5 });

    expect(fused.length).toBe(2);
    // c1: normDense = 0.8/0.8 = 1.0, normSparse = 5/10 = 0.5 -> final = 0.5*1.0 + 0.5*0.5 = 0.75
    // c2: normDense = 0.4/0.8 = 0.5, normSparse = 10/10 = 1.0 -> final = 0.5*0.5 + 0.5*1.0 = 0.75
    expect(fused[0]?.score).toBeCloseTo(0.75, 4);
    expect(fused[1]?.score).toBeCloseTo(0.75, 4);
  });
});
