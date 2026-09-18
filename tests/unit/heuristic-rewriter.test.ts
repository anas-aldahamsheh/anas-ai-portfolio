import { describe, it, expect } from "vitest";
import { rewriteQueryHeuristic } from "@/ai/query-rewrite/heuristic-rewriter";

describe("Heuristic Query Rewriter (F026)", () => {
  it("preserves original query as the primary query item", () => {
    const result = rewriteQueryHeuristic({
      userMessage: "What are your skills in Python?",
      language: "en",
    });

    expect(result.originalQuery).toBe("What are your skills in Python?");
    expect(result.rewrittenQueries[0]).toBe("What are your skills in Python?");
  });

  it("expands query with current scope if provided", () => {
    const result = rewriteQueryHeuristic({
      userMessage: "How does the pipeline work?",
      language: "en",
      currentScope: "proj-rag-agent",
    });

    expect(result.rewrittenQueries.length).toBeGreaterThan(1);
    expect(result.rewrittenQueries).toContain("How does the pipeline work? proj-rag-agent");
    expect(result.wasRewritten).toBe(true);
  });

  it("expands query with unmentioned entity hints", () => {
    const result = rewriteQueryHeuristic({
      userMessage: "Tell me about full stack development",
      language: "en",
      entityHints: ["nextjs", "typescript"],
    });

    expect(result.rewrittenQueries.some((q) => q.includes("nextjs"))).toBe(true);
  });

  it("handles Arabic query normalization and cross-lingual expansion", () => {
    const result = rewriteQueryHeuristic({
      userMessage: "مَشْرُوعُ الذَّكَاءِ الاصْطِنَاعِيّ",
      language: "ar",
      entityHints: ["qdrant"],
    });

    expect(result.rewrittenQueries.length).toBeGreaterThan(1);
    // Diacritic-free form
    expect(result.rewrittenQueries).toContain("مشروع الذكاء الاصطناعي");
  });

  it("enforces maxQueries cap", () => {
    const result = rewriteQueryHeuristic(
      {
        userMessage: "AI project with Qdrant vector database and embeddings",
        language: "en",
        currentScope: "portfolio",
        entityHints: ["nextjs", "typescript", "vitest"],
      },
      { maxQueries: 2 },
    );

    expect(result.rewrittenQueries.length).toBeLessThanOrEqual(2);
  });

  it("handles empty or blank queries gracefully", () => {
    const empty = rewriteQueryHeuristic({
      userMessage: "",
      language: "en",
    });

    expect(empty.originalQuery).toBe("");
    expect(empty.rewrittenQueries).toEqual([]);
    expect(empty.strategy).toBe("noop");
  });
});
