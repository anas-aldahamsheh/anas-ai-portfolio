import { describe, it, expect, vi, beforeEach } from "vitest";
import { LocalizedTextService } from "@/modules/localization/infrastructure/localized-text-service";
import { logger } from "@/lib/observability/logger";

describe("LocalizedTextService (infrastructure/localized-text-service.ts)", () => {
  beforeEach(() => {
    LocalizedTextService.invalidateCache();
    vi.restoreAllMocks();
  });

  it("retrieves complete dictionary for Arabic and English", async () => {
    const arDict = await LocalizedTextService.getDictionary("ar");
    expect(arDict).toBeDefined();
    expect(arDict["home.title"]).toBeDefined();
    expect(arDict["guest.reassurance.title"]).toBeDefined();

    const enDict = await LocalizedTextService.getDictionary("en");
    expect(enDict).toBeDefined();
    expect(enDict["home.title"]).toBe("AI Engineering Portfolio Platform");
    expect(enDict["guest.reassurance.title"]).toBe("Guest-First Access");
  });

  it("resolves specific translated keys with isFallback=false", async () => {
    const result = await LocalizedTextService.get("home.title", "en");
    expect(result.value).toBe("AI Engineering Portfolio Platform");
    expect(result.locale).toBe("en");
    expect(result.isFallback).toBe(false);
  });

  it("uses in-memory cache on subsequent requests", async () => {
    const firstCall = await LocalizedTextService.getDictionary("en");
    const secondCall = await LocalizedTextService.getDictionary("en");
    expect(firstCall).toEqual(secondCall);
  });

  it("logs structured error and returns missing token for non-existent key", async () => {
    const loggerSpy = vi.spyOn(logger, "error");

    const result = await LocalizedTextService.get("non.existent.key.xyz", "en");

    expect(result.value).toBe("[missing: non.existent.key.xyz]");
    expect(result.isFallback).toBe(false);
    expect(loggerSpy).toHaveBeenCalledWith(
      "missing_localization_key",
      expect.objectContaining({
        metadata: expect.objectContaining({
          key: "non.existent.key.xyz",
          locale: "en",
        }),
      }),
    );
  });

  it("generates a completeness report for translations", async () => {
    const report = await LocalizedTextService.checkCompleteness();
    expect(report).toBeDefined();
    expect(typeof report.totalKeys).toBe("number");
    expect(typeof report.completenessPercentage).toBe("number");
    expect(Array.isArray(report.missingArabic)).toBe(true);
    expect(Array.isArray(report.missingEnglish)).toBe(true);
  });
});
