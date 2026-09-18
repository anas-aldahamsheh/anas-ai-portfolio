import { describe, it, expect } from "vitest";
import { getDirectionForLocale } from "@/modules/localization/domain/locales";
import {
  isDirectionalIcon,
  getIconDirectionClass,
  detectScriptDirection,
} from "@/modules/localization/domain/direction";

describe("Bidirectional RTL/LTR System Integration (F007)", () => {
  it("maps root direction strictly according to locale specification", () => {
    expect(getDirectionForLocale("ar")).toBe("rtl");
    expect(getDirectionForLocale("en")).toBe("ltr");
  });

  it("enforces directional mirroring only on forward/backward indicators", () => {
    const forwardChevron = "chevron-end";
    const externalLink = "external-link";

    expect(isDirectionalIcon(forwardChevron)).toBe(true);
    expect(getIconDirectionClass(forwardChevron)).toContain("rtl:-scale-x-100");

    expect(isDirectionalIcon(externalLink)).toBe(false);
    expect(getIconDirectionClass(externalLink)).toBe("");
  });

  it("preserves proper reading order for mixed language segments", () => {
    const arabicSentence = "انقر هنا للاطلاع على كود المستودع في GitHub";
    const englishSentence = "Click here to review the repository codebase on GitHub";

    expect(detectScriptDirection(arabicSentence)).toBe("rtl");
    expect(detectScriptDirection(englishSentence)).toBe("ltr");
  });

  it("guarantees universal non-directional icons are never inverted in RTL", () => {
    const universalIcons = [
      "play",
      "pause",
      "stop",
      "search",
      "settings",
      "check",
      "close",
      "copy",
      "github",
      "linkedin",
    ];

    for (const name of universalIcons) {
      expect(isDirectionalIcon(name)).toBe(false);
      expect(getIconDirectionClass(name)).toBe("");
    }
  });
});
