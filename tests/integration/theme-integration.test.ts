import { describe, it, expect } from "vitest";
import {
  getThemeFromCookie,
  serializeThemeCookie,
} from "@/modules/theme/infrastructure/theme-cookie";
import { THEME_COOKIE_NAME, resolveTheme } from "@/modules/theme/domain/theme";

describe("Theme System Integration (F008)", () => {
  it("resolves server-side cookie from simulated request headers", () => {
    const headers = new Headers({
      cookie: `session_token=xyz; ${THEME_COOKIE_NAME}=dark; locale=ar`,
    });

    const cookieHeader = headers.get("cookie");
    const serverTheme = getThemeFromCookie(cookieHeader);

    expect(serverTheme).toBe("dark");
    expect(resolveTheme(serverTheme, false)).toBe("dark");
  });

  it("handles guest requests with missing cookie by defaulting to system", () => {
    const headers = new Headers({});
    const cookieHeader = headers.get("cookie");
    const serverTheme = getThemeFromCookie(cookieHeader);

    expect(serverTheme).toBe("system");
  });

  it("produces compliant cookie serialization that can be parsed back idempotently", () => {
    const originalTheme = "dark";
    const cookieString = serializeThemeCookie(originalTheme);

    const parsed = getThemeFromCookie(cookieString);
    expect(parsed).toBe(originalTheme);
  });
});
