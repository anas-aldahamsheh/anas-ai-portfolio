import { describe, it, expect } from "vitest";
import {
  extractTokenShingles,
  computeJaccardSimilarity,
  isNearDuplicate,
} from "@/ai/context/deduplicator";

describe("Deduplicator & Lexical Similarity (F028)", () => {
  it("extracts unigram and bigram shingles correctly", () => {
    const text = "Anas builds vector retrieval pipelines";
    const shingles = extractTokenShingles(text);

    expect(shingles.has("anas")).toBe(true);
    expect(shingles.has("vector")).toBe(true);
    expect(shingles.has("anas__builds")).toBe(true);
    expect(shingles.has("builds__vector")).toBe(true);
  });

  it("calculates accurate Jaccard similarity between identical and disjoint sets", () => {
    const shinglesA = extractTokenShingles("Autonomous agentic workflow with LLMs");
    const shinglesB = extractTokenShingles("Autonomous agentic workflow with LLMs");
    const shinglesC = extractTokenShingles("Frontend CSS animations and theme toggle");

    expect(computeJaccardSimilarity(shinglesA, shinglesB)).toBe(1.0);
    expect(computeJaccardSimilarity(shinglesA, shinglesC)).toBe(0.0);
  });

  it("detects near-duplicate sentences with minor variations", () => {
    const original =
      "Anas implemented hybrid search using Qdrant vector database and BM25 lexical retriever.";
    const nearDuplicate =
      "Anas implemented hybrid search using Qdrant vector database and BM25 lexical ranking.";

    const acceptedShingles = [extractTokenShingles(original)];

    expect(isNearDuplicate(nearDuplicate, acceptedShingles, 0.75)).toBe(true);
  });

  it("correctly identifies near-duplicates in Arabic text", () => {
    const original = "قام أنس بتطوير منصة ذكاء اصطناعي متعددة اللغات تدعم نموذج BGE-M3";
    const nearDuplicate = "قام أنس بتطوير منصة ذكاء اصطناعي متطورة تدعم نموذج BGE-M3";

    const acceptedShingles = [extractTokenShingles(original)];

    expect(isNearDuplicate(nearDuplicate, acceptedShingles, 0.55)).toBe(true);
  });

  it("distinguishes completely different documents", () => {
    const docA = "Curriculum Vitae overview highlighting experience at Google and Microsoft.";
    const docB = "Project deep dive explaining PostgreSQL Drizzle ORM schema migrations.";

    const acceptedShingles = [extractTokenShingles(docA)];

    expect(isNearDuplicate(docB, acceptedShingles, 0.5)).toBe(false);
  });
});
