import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  BREAKPOINTS,
  MEDIA_QUERIES,
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
} from "@/lib/responsive";

describe("Responsive Breakpoints & Media Query Hooks (F048)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("defines standard responsive breakpoints", () => {
    expect(BREAKPOINTS.sm).toBe(640);
    expect(BREAKPOINTS.md).toBe(768);
    expect(BREAKPOINTS.lg).toBe(1024);
    expect(BREAKPOINTS.xl).toBe(1280);
    expect(BREAKPOINTS["2xl"]).toBe(1536);

    expect(MEDIA_QUERIES.mobile).toBe("(max-width: 767px)");
    expect(MEDIA_QUERIES.tablet).toBe("(min-width: 768px) and (max-width: 1023px)");
    expect(MEDIA_QUERIES.desktop).toBe("(min-width: 1024px)");
  });

  it("returns matches true when media query matches", () => {
    let currentMatches = true;
    let listenerCallback: (() => void) | null = null;

    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      get matches() {
        return currentMatches;
      },
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((_event: string, cb: () => void) => {
        listenerCallback = cb;
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);

    // Simulate viewport resize to non-mobile
    if (listenerCallback) {
      act(() => {
        currentMatches = false;
        (listenerCallback as () => void)();
      });
      expect(result.current).toBe(false);
    }
  });

  it("handles tablet and desktop queries accurately", () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("1024px"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result: isDesktopResult } = renderHook(() => useIsDesktop());
    expect(isDesktopResult.current).toBe(true);

    const { result: isTabletResult } = renderHook(() => useIsTablet());
    expect(isTabletResult.current).toBe(false);
  });

  it("handles custom media queries with useMediaQuery", () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === "(orientation: landscape)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useMediaQuery("(orientation: landscape)"));
    expect(result.current).toBe(true);
  });
});
