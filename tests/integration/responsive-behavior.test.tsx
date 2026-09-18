import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Navbar } from "@/modules/navigation/presentation/navbar";
import { viewport } from "@/app/[locale]/layout";
import { DEFAULT_NAVIGATION_ITEMS } from "@/modules/navigation/infrastructure/default-navigation";
import { LocalizationProvider } from "@/modules/localization/presentation/localization-provider";
import { ThemeProvider } from "@/modules/theme/presentation/theme-provider";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/en",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
}));

const TEST_DICTIONARY_EN = {
  "home.title": "Anas Portfolio",
  "nav.projects": "Projects",
  "nav.cv": "CV",
  "nav.ai_chat": "AI Chat",
  "nav.job_fit": "Job Fit",
};

const TEST_DICTIONARY_AR = {
  "home.title": "أنس - مهندس برمجيات",
  "nav.projects": "المشاريع",
  "nav.cv": "السيرة الذاتية",
  "nav.ai_chat": "المحادثة الذكية",
  "nav.job_fit": "توافق الوظيفة",
};

describe("Responsive Behavior & Multi-Breakpoint Experience (F048)", () => {
  it("exports compliant mobile-first viewport meta configuration", () => {
    expect(viewport.width).toBe("device-width");
    expect(viewport.initialScale).toBe(1);
    expect(viewport.maximumScale).toBe(5);
  });

  it("renders desktop navigation and mobile hamburger menu trigger in navbar", () => {
    render(
      <ThemeProvider initialTheme="system">
        <LocalizationProvider locale="en" dictionary={TEST_DICTIONARY_EN}>
          <Navbar locale="en" items={DEFAULT_NAVIGATION_ITEMS} />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    // Desktop navigation has md:flex hidden on mobile
    const desktopNav = screen.getByRole("navigation", { name: "Main Navigation" });
    expect(desktopNav).toHaveClass("hidden");
    expect(desktopNav).toHaveClass("md:flex");

    // Hamburger button has md:hidden visible on mobile
    const hamburger = screen.getByLabelText("Open menu");
    expect(hamburger).toBeInTheDocument();
    expect(hamburger).toHaveClass("md:hidden");
  });

  it("toggles mobile navigation drawer open and closed", () => {
    render(
      <ThemeProvider initialTheme="system">
        <LocalizationProvider locale="en" dictionary={TEST_DICTIONARY_EN}>
          <Navbar locale="en" items={DEFAULT_NAVIGATION_ITEMS} />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    const hamburger = screen.getByLabelText("Open menu");
    expect(hamburger).toHaveAttribute("aria-expanded", "false");

    // Open mobile menu
    fireEvent.click(hamburger);
    expect(hamburger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("dialog", { name: "Mobile navigation menu" })).toBeInTheDocument();

    // Close mobile menu via Escape key
    fireEvent.keyDown(window, { key: "Escape" });
    expect(hamburger).toHaveAttribute("aria-expanded", "false");
  });

  it("supports Arabic RTL layout and labels for responsive mobile drawer", () => {
    render(
      <ThemeProvider initialTheme="system">
        <LocalizationProvider locale="ar" dictionary={TEST_DICTIONARY_AR}>
          <Navbar locale="ar" items={DEFAULT_NAVIGATION_ITEMS} />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    const openBtn = screen.getByLabelText("فتح القائمة");
    expect(openBtn).toBeInTheDocument();

    fireEvent.click(openBtn);
    expect(screen.getByLabelText("إغلاق القائمة")).toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "قائمة التنقل للهواتف" })).toBeInTheDocument();
  });
});
