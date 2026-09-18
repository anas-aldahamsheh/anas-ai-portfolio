import { describe, it, expect } from "vitest";
import { isTheme, resolveTheme, THEMES, THEME_COOKIE_NAME } from "@/modules/theme/domain/theme";
import {
  getThemeFromCookie,
  serializeThemeCookie,
} from "@/modules/theme/infrastructure/theme-cookie";

describe("Theme Domain & Cookie Handling (F008)", () => {
  it("validates themes against supported modes (light, dark, system)", () => {
    for (const theme of THEMES) {
      expect(isTheme(theme)).toBe(true);
    }
    expect(isTheme("neon")).toBe(false);
    expect(isTheme("")).toBe(false);
    expect(isTheme(null)).toBe(false);
    expect(isTheme(undefined)).toBe(false);
  });

  it("resolves effective theme accurately based on mode and system preference", () => {
    // Explicit override takes precedence
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("light", false)).toBe("light");
    expect(resolveTheme("dark", true)).toBe("dark");
    expect(resolveTheme("dark", false)).toBe("dark");

    // System mode defers to OS/browser preference
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });

  it("extracts and parses theme cookie correctly", () => {
    expect(getThemeFromCookie(`${THEME_COOKIE_NAME}=dark`)).toBe("dark");
    expect(getThemeFromCookie(`foo=bar; ${THEME_COOKIE_NAME}=light; other=value`)).toBe("light");
    expect(getThemeFromCookie(`${THEME_COOKIE_NAME}=system`)).toBe("system");
    expect(getThemeFromCookie(`${THEME_COOKIE_NAME}=invalid_value`)).toBe("system");
    expect(getThemeFromCookie("")).toBe("system");
    expect(getThemeFromCookie(null)).toBe("system");
  });

  it("serializes theme cookie with secure lifetime attributes", () => {
    const serialized = serializeThemeCookie("dark");
    expect(serialized).toContain(`${THEME_COOKIE_NAME}=dark`);
    expect(serialized).toContain("Path=/");
    expect(serialized).toContain("SameSite=Lax");
    expect(serialized).toContain("Max-Age=");
  });
});
