import { describe, it, expect } from "vitest";
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  isSupportedLocale,
  getDirectionForLocale,
  LOCALES_METADATA,
} from "@/modules/localization/domain/locales";
import { interpolate } from "@/modules/localization/application/get-translations";

describe("Localization Domain & Direction Metadata (domain/locales.ts)", () => {
  it("defines Arabic and English with Arabic as default per specification", () => {
    expect(SUPPORTED_LOCALES).toContain("ar");
    expect(SUPPORTED_LOCALES).toContain("en");
    expect(DEFAULT_LOCALE).toBe("ar");
  });

  it("validates supported and unsupported locales correctly", () => {
    expect(isSupportedLocale("ar")).toBe(true);
    expect(isSupportedLocale("en")).toBe(true);
    expect(isSupportedLocale("fr")).toBe(false);
    expect(isSupportedLocale("")).toBe(false);
  });

  it("maps Arabic to RTL and English to LTR direction metadata", () => {
    expect(getDirectionForLocale("ar")).toBe("rtl");
    expect(getDirectionForLocale("en")).toBe("ltr");
    expect(LOCALES_METADATA.ar.dir).toBe("rtl");
    expect(LOCALES_METADATA.en.dir).toBe("ltr");
  });

  it("interpolates parameters in translation strings", () => {
    const template = "Welcome, {name}! You have {count} updates.";
    const result = interpolate(template, { name: "Anas", count: 5 });
    expect(result).toBe("Welcome, Anas! You have 5 updates.");
  });

  it("returns original text when no params or unmatched tokens exist", () => {
    expect(interpolate("Simple text")).toBe("Simple text");
    expect(interpolate("Missing {param}", {})).toBe("Missing {param}");
  });
});
