import { describe, it, expect } from "vitest";
import { getTranslations } from "@/modules/localization/application/get-translations";

describe("Dynamic Localization Integration (getTranslations)", () => {
  it("resolves Arabic translation context with RTL direction", async () => {
    const { t, locale, dir } = await getTranslations("ar");

    expect(locale).toBe("ar");
    expect(dir).toBe("rtl");
    expect(t("home.title")).toBe("منصة المحفظة الهندسية والذكاء الاصطناعي");
    expect(t("guest.reassurance.title")).toBe("وصول مباشر ومجاني بالكامل");
  });

  it("resolves English translation context with LTR direction", async () => {
    const { t, locale, dir } = await getTranslations("en");

    expect(locale).toBe("en");
    expect(dir).toBe("ltr");
    expect(t("home.title")).toBe("AI Engineering Portfolio Platform");
    expect(t("guest.reassurance.title")).toBe("Guest-First Access");
  });

  it("interpolates parameters in translations seamlessly", async () => {
    const { t } = await getTranslations("en");

    // Dynamic key with interpolation
    const rendered = t("actions.explore", { action: "now" });
    expect(rendered).toBe("Explore Now");
  });

  it("safely handles missing keys by returning bracketed key without throwing errors", async () => {
    const { t } = await getTranslations("ar");

    const result = t("unknown.system.label");
    expect(result).toBe("[unknown.system.label]");
  });
});
