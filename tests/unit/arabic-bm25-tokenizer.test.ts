import { describe, it, expect } from "vitest";
import {
  tokenizeMultilingual,
  computeTermFrequency,
  calculateBm25Score,
} from "@/ai/retrieval/sparse/arabic-bm25-tokenizer";

describe("Multilingual Arabic and English BM25 Tokenizer", () => {
  it("normalizes Arabic diacritics, tatweel, and letter variations", () => {
    // Text with tashkeel, tatweel (ـ), and different Alef forms (أ, إ, آ)
    const text = "مَشْــرُوعُ أَنَسْ فِي الذَّكَــاءِ الاصْطِنَاعِيّ";
    const tokens = tokenizeMultilingual(text);

    // Stopword "في" should be removed
    expect(tokens).not.toContain("في");

    // "مشــروع" with tatweel and damma should normalize to "مشروع"
    expect(tokens).toContain("مشروع");

    // "أنس" with fatha and alef-hamza should normalize to "انس"
    expect(tokens).toContain("انس");

    // "الذكاء" should normalize to "الذكاء" -> "الذكاء"
    expect(tokens).toContain("الذكاء");

    // "الاصطناعي" should normalize without diacritics
    expect(tokens).toContain("الاصطناعي");
  });

  it("normalizes Teh Marbuta and Alef Maksura", () => {
    const text = "هندسة البرمجيات والتطوير الذكي للرؤية الحاسوبية على منصة";
    const tokens = tokenizeMultilingual(text);

    // "هندسة" -> "هندسه"
    expect(tokens).toContain("هندسه");
    // "منصة" -> "منصه"
    expect(tokens).toContain("منصه");
    // "الحاسوبية" -> "الحاسوبيه"
    expect(tokens).toContain("الحاسوبيه");
    // Stopword "على" should be filtered
    expect(tokens).not.toContain("على");
  });

  it("tokenizes and filters English text with case normalization and stopwords", () => {
    const text = "Anas is building an Advanced Multilingual RAG Platform with Qdrant";
    const tokens = tokenizeMultilingual(text);

    expect(tokens).toContain("anas");
    expect(tokens).toContain("building");
    expect(tokens).toContain("advanced");
    expect(tokens).toContain("multilingual");
    expect(tokens).toContain("rag");
    expect(tokens).toContain("platform");
    expect(tokens).toContain("qdrant");

    // Stopwords filtered out
    expect(tokens).not.toContain("is");
    expect(tokens).not.toContain("an");
    expect(tokens).not.toContain("with");
  });

  it("computes accurate term frequencies", () => {
    const tokens = ["anas", "ai", "rag", "anas", "engineer", "anas"];
    const tf = computeTermFrequency(tokens);

    expect(tf.get("anas")).toBe(3);
    expect(tf.get("ai")).toBe(1);
    expect(tf.get("rag")).toBe(1);
    expect(tf.get("engineer")).toBe(1);
    expect(tf.get("unknown")).toBeUndefined();
  });

  it("computes BM25 relevance score accurately", () => {
    const queryTokens = ["rag", "architecture"];
    const docTokens1 = ["rag", "architecture", "system", "retrieval", "search"];
    const docTokens2 = ["frontend", "design", "system", "tailwind", "react"];

    const docFrequencyMap = new Map<string, number>([
      ["rag", 1],
      ["architecture", 1],
      ["system", 2],
    ]);

    const score1 = calculateBm25Score({
      queryTokens,
      docTokens: docTokens1,
      docFrequencyMap,
      totalDocs: 2,
      avgDocLength: 5,
    });

    const score2 = calculateBm25Score({
      queryTokens,
      docTokens: docTokens2,
      docFrequencyMap,
      totalDocs: 2,
      avgDocLength: 5,
    });

    expect(score1).toBeGreaterThan(0);
    expect(score2).toBe(0); // doc2 does not contain rag or architecture
  });

  it("returns zero score when no terms match or query is empty", () => {
    const score = calculateBm25Score({
      queryTokens: [],
      docTokens: ["some", "content"],
      docFrequencyMap: new Map(),
      totalDocs: 1,
      avgDocLength: 2,
    });

    expect(score).toBe(0);
  });
});
