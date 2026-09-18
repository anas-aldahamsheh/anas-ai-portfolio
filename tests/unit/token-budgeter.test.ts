import { describe, it, expect } from "vitest";
import { estimateTokenCount, TokenBudgeter } from "@/ai/context/token-budgeter";

describe("TokenBudgeter & Estimation (F028)", () => {
  describe("estimateTokenCount", () => {
    it("returns 0 for empty or whitespace-only text", () => {
      expect(estimateTokenCount("")).toBe(0);
      expect(estimateTokenCount("   \n\t  ")).toBe(0);
    });

    it("estimates tokens for English text reasonably", () => {
      const text = "Anas is an AI engineer with strong expertise in full-stack architecture.";
      const count = estimateTokenCount(text, "en");

      // 10 words, 72 chars -> ~12-16 tokens
      expect(count).toBeGreaterThan(5);
      expect(count).toBeLessThan(25);
    });

    it("estimates tokens for Arabic text accurately", () => {
      const text = "أنس مهندس ذكاء اصطناعي متخصص في بناء منظومات الاسترجاع المعزز المتقدمة";
      const count = estimateTokenCount(text, "ar");

      expect(count).toBeGreaterThan(8);
      expect(count).toBeLessThan(35);
    });
  });

  describe("TokenBudgeter class", () => {
    it("tracks tokens and prevents exceeding budget", () => {
      const budgeter = new TokenBudgeter(100);

      expect(budgeter.canFit(60)).toBe(true);
      expect(budgeter.allocate(60)).toBe(true);
      expect(budgeter.tokensUsed).toBe(60);
      expect(budgeter.remainingTokens).toBe(40);

      // Next chunk needs 50 tokens, but only 40 remain
      expect(budgeter.canFit(50)).toBe(false);
      expect(budgeter.allocate(50)).toBe(false);
      expect(budgeter.tokensUsed).toBe(60);

      // Next chunk needs 30 tokens, which fits
      expect(budgeter.canFit(30)).toBe(true);
      expect(budgeter.allocate(30)).toBe(true);
      expect(budgeter.tokensUsed).toBe(90);
      expect(budgeter.remainingTokens).toBe(10);
    });
  });
});
