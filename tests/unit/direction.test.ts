import { describe, it, expect } from "vitest";
import {
  detectScriptDirection,
  isDirectionalIcon,
  getIconDirectionClass,
  DIRECTIONAL_ICONS,
  UNIVERSAL_NON_DIRECTIONAL_ICONS,
} from "@/modules/localization/domain/direction";

describe("Bidirectional Direction & Icon Classification (domain/direction.ts)", () => {
  describe("detectScriptDirection", () => {
    it("detects pure Arabic text as RTL", () => {
      expect(detectScriptDirection("منصة المحفظة الهندسية والذكاء الاصطناعي")).toBe("rtl");
    });

    it("detects pure English text as LTR", () => {
      expect(detectScriptDirection("Production-ready AI Portfolio Platform")).toBe("ltr");
    });

    it("detects mixed text dominated by Arabic as RTL", () => {
      const mixedArabic = "مشروع هندسي معقد تم بناؤه باستخدام Next.js و TypeScript و PostgreSQL";
      expect(detectScriptDirection(mixedArabic)).toBe("rtl");
    });

    it("detects mixed text dominated by English as LTR", () => {
      const mixedEnglish =
        "High-performance RAG pipeline supporting Arabic (العربية) text indexing";
      expect(detectScriptDirection(mixedEnglish)).toBe("ltr");
    });

    it("defaults to LTR on empty or whitespace strings", () => {
      expect(detectScriptDirection("")).toBe("ltr");
      expect(detectScriptDirection("   ")).toBe("ltr");
    });
  });

  describe("isDirectionalIcon", () => {
    it("correctly flags all directional icons as true", () => {
      for (const icon of DIRECTIONAL_ICONS) {
        expect(isDirectionalIcon(icon)).toBe(true);
      }
    });

    it("correctly flags universal non-directional icons as false", () => {
      for (const icon of UNIVERSAL_NON_DIRECTIONAL_ICONS) {
        expect(isDirectionalIcon(icon)).toBe(false);
      }
    });

    it("handles common aliases and case-insensitivity", () => {
      expect(isDirectionalIcon("CHEVRON-RIGHT")).toBe(true);
      expect(isDirectionalIcon("arrow-left")).toBe(true);
      expect(isDirectionalIcon("external-link")).toBe(false);
      expect(isDirectionalIcon("github")).toBe(false);
    });
  });

  describe("getIconDirectionClass", () => {
    it("returns rtl:-scale-x-100 for directional icons", () => {
      expect(getIconDirectionClass("chevron-end")).toBe("rtl:-scale-x-100 transform-gpu");
      expect(getIconDirectionClass("arrow-right")).toBe("rtl:-scale-x-100 transform-gpu");
    });

    it("returns empty string for non-directional icons", () => {
      expect(getIconDirectionClass("play")).toBe("");
      expect(getIconDirectionClass("external-link")).toBe("");
      expect(getIconDirectionClass("search")).toBe("");
    });
  });
});
