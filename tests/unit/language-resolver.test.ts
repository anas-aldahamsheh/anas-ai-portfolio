import { describe, it, expect } from "vitest";
import { LanguageResolver } from "@/ai/language/language-resolver";
import { groundedGenerator } from "@/ai/generation";

describe("LanguageResolver Service (F030)", () => {
  const resolver = new LanguageResolver();

  it("resolves Arabic queries with rtl direction and correct strategy", async () => {
    const result = await resolver.resolveLanguage({
      message: "ما هي تفاصيل مشاريع أنس في الأنظمة الموزعة؟",
    });

    expect(result.language).toBe("ar");
    expect(result.direction).toBe("rtl");
    expect(result.confidence).toBeGreaterThanOrEqual(0.85);
  });

  it("resolves English queries with ltr direction and correct strategy", async () => {
    const result = await resolver.resolveLanguage({
      message: "What is Anas's experience with cloud infrastructure?",
    });

    expect(result.language).toBe("en");
    expect(result.direction).toBe("ltr");
    expect(result.confidence).toBeGreaterThanOrEqual(0.85);
  });

  it("getDirection maps language codes correctly", () => {
    expect(resolver.getDirection("ar")).toBe("rtl");
    expect(resolver.getDirection("en")).toBe("ltr");
  });

  it("integrates seamlessly with GroundedGenerator when responseLanguage is omitted", async () => {
    // When responseLanguage is omitted, groundedGenerator resolves Arabic query automatically
    const arabicAnswer = await groundedGenerator.generate({
      userMessage: "ما هي المشاريع المتاحة في ملف الأعمال؟",
      contextChunks: [], // Empty chunks trigger insufficient evidence answer
    });

    expect(arabicAnswer.language).toBe("ar");
    expect(arabicAnswer.content).toContain("لا تحتوي قاعدة معارف ملف الأعمال");

    // When responseLanguage is omitted, groundedGenerator resolves English query automatically
    const englishAnswer = await groundedGenerator.generate({
      userMessage: "What projects are available in the portfolio?",
      contextChunks: [],
    });

    expect(englishAnswer.language).toBe("en");
    expect(englishAnswer.content).toContain("does not contain verified information");
  });
});
