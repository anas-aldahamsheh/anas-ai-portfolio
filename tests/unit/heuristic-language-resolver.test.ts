import { describe, it, expect } from "vitest";
import { resolveLanguageHeuristics } from "@/ai/language/heuristic-resolver";

describe("HeuristicLanguageResolver (F030)", () => {
  it("resolves Modern Standard Arabic (MSA) accurately with RTL direction", () => {
    const result = resolveLanguageHeuristics({
      message: "ما هي الخبرات التقنية للمهندس أنس في الذكاء الاصطناعي وهندسة البيانات؟",
    });

    expect(result.language).toBe("ar");
    expect(result.direction).toBe("rtl");
    expect(result.confidence).toBeGreaterThanOrEqual(0.85);
    expect(result.strategy).toBe("script_heuristic");
  });

  it("resolves Arabic colloquial sentences accurately with RTL direction", () => {
    const result = resolveLanguageHeuristics({
      message: "شو هي أحسن مشاريع أنس وكيف بقدر أتواصل معه؟",
    });

    expect(result.language).toBe("ar");
    expect(result.direction).toBe("rtl");
    expect(result.confidence).toBeGreaterThanOrEqual(0.85);
    expect(result.strategy).toBe("script_heuristic");
  });

  it("resolves Arabic sentences containing English technical terms as Arabic (RTL)", () => {
    const result = resolveLanguageHeuristics({
      message: "هل اشتغل أنس على تقنيات RAG مع Qdrant و Next.js و Docker؟",
    });

    expect(result.language).toBe("ar");
    expect(result.direction).toBe("rtl");
    expect(result.strategy).toBe("script_heuristic");
    expect(result.reason).toContain("Arabic framing detected with embedded Latin technical terms");
  });

  it("resolves standard English queries as English (LTR)", () => {
    const result = resolveLanguageHeuristics({
      message: "What are Anas's primary architectural skills and full-stack achievements?",
    });

    expect(result.language).toBe("en");
    expect(result.direction).toBe("ltr");
    expect(result.confidence).toBeGreaterThanOrEqual(0.85);
    expect(result.strategy).toBe("script_heuristic");
  });

  it("resolves English queries containing Arabic project names as English (LTR)", () => {
    const result = resolveLanguageHeuristics({
      message:
        "Explain Anas's role and technical accomplishments on the Al-Khabir search platform.",
    });

    expect(result.language).toBe("en");
    expect(result.direction).toBe("ltr");
    expect(result.strategy).toBe("script_heuristic");
  });

  it("prioritizes explicit user directive to answer in English", () => {
    const directReq = resolveLanguageHeuristics({
      message: "Answer in English please: ما هي مهارات أنس؟",
    });
    expect(directReq.language).toBe("en");
    expect(directReq.direction).toBe("ltr");
    expect(directReq.confidence).toBe(1.0);
    expect(directReq.strategy).toBe("explicit_instruction");
    expect(directReq.hasExplicitOverride).toBe(true);

    const arabicPhrasedReq = resolveLanguageHeuristics({
      message: "تكلم باللغة الإنجليزية لو سمحت",
    });
    expect(arabicPhrasedReq.language).toBe("en");
    expect(arabicPhrasedReq.hasExplicitOverride).toBe(true);
  });

  it("prioritizes explicit user directive to answer in Arabic", () => {
    const directReq = resolveLanguageHeuristics({
      message: "Tell me about his career, but reply in Arabic.",
    });
    expect(directReq.language).toBe("ar");
    expect(directReq.direction).toBe("rtl");
    expect(directReq.confidence).toBe(1.0);
    expect(directReq.strategy).toBe("explicit_instruction");
    expect(directReq.hasExplicitOverride).toBe(true);

    const arabicPhrasedReq = resolveLanguageHeuristics({
      message: "جاوب بالعربي لو سمحت",
    });
    expect(arabicPhrasedReq.language).toBe("ar");
    expect(arabicPhrasedReq.hasExplicitOverride).toBe(true);
  });

  it("honors explicit forceLanguage override parameter", () => {
    const result = resolveLanguageHeuristics({
      message: "Hello world",
      forceLanguage: "ar",
    });

    expect(result.language).toBe("ar");
    expect(result.direction).toBe("rtl");
    expect(result.confidence).toBe(1.0);
    expect(result.hasExplicitOverride).toBe(true);
  });

  it("falls back to conversationLocale for single neutral words without grammar", () => {
    const arLocaleResult = resolveLanguageHeuristics({
      message: "Docker",
      conversationLocale: "ar",
    });
    expect(arLocaleResult.language).toBe("ar");
    expect(arLocaleResult.direction).toBe("rtl");
    expect(arLocaleResult.strategy).toBe("locale_fallback");

    const enLocaleResult = resolveLanguageHeuristics({
      message: "Docker",
      conversationLocale: "en",
    });
    expect(enLocaleResult.language).toBe("en");
    expect(enLocaleResult.direction).toBe("ltr");
  });

  it("falls back to conversationLocale for pure symbols and numbers", () => {
    const result = resolveLanguageHeuristics({
      message: "👋 123 !?",
      conversationLocale: "ar",
    });

    expect(result.language).toBe("ar");
    expect(result.direction).toBe("rtl");
    expect(result.strategy).toBe("locale_fallback");
  });
});
