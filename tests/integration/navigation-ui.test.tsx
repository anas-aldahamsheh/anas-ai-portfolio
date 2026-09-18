import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Navbar, Footer } from "@/modules/navigation/presentation";
import { LocalizationProvider } from "@/modules/localization/presentation/localization-provider";
import { MotionProvider } from "@/modules/motion/presentation/motion-provider";
import type { NavigationItem } from "@/modules/navigation/domain/types";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => "/en/projects",
}));

const mockItems: NavigationItem[] = [
  {
    id: "nav-projects",
    destinationType: "internal",
    target: "/projects",
    labelKey: "nav.projects",
    iconKey: "folder-git-2",
    orderIndex: 1,
    isVisible: true,
    openInNewTab: false,
    authVisibility: "all",
    placement: "both",
  },
  {
    id: "nav-cv",
    destinationType: "internal",
    target: "/cv",
    labelKey: "nav.cv",
    iconKey: "file-text",
    orderIndex: 2,
    isVisible: true,
    openInNewTab: false,
    authVisibility: "all",
    placement: "both",
  },
  {
    id: "nav-ai-chat",
    destinationType: "internal",
    target: "/chat",
    labelKey: "nav.ai_chat",
    iconKey: "sparkles",
    orderIndex: 3,
    isVisible: true,
    openInNewTab: false,
    authVisibility: "all",
    placement: "both",
    badge: "RAG",
  },
];

const mockDictionary: Record<string, string> = {
  "home.title": "AI Engineering Portfolio",
  "nav.projects": "Projects",
  "nav.cv": "CV & Resume",
  "nav.ai_chat": "AI Assistant",
  "footer.rights": "All rights reserved",
  "footer.built_with": "Engineered with production-grade reliability.",
  "footer.navigation": "Navigation",
  "footer.capabilities": "Capabilities",
};

import { ThemeProvider } from "@/modules/theme/presentation/theme-provider";
import type { SupportedLocale } from "@/modules/localization/domain/locales";

function renderWithProviders(ui: React.ReactNode, locale: SupportedLocale = "en") {
  return render(
    <ThemeProvider initialTheme="light">
      <LocalizationProvider locale={locale} dictionary={mockDictionary}>
        <MotionProvider overrideIntensity="none">{ui}</MotionProvider>
      </LocalizationProvider>
    </ThemeProvider>,
  );
}

describe("Navigation & Footer UI Integration (F011)", () => {
  describe("Navbar", () => {
    it("renders brand, skip link, and desktop navigation links", () => {
      renderWithProviders(<Navbar locale="en" items={mockItems} />);

      // Skip link
      const skipLink = screen.getByText("Skip to main content");
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute("href", "#main-content");

      // Brand link
      expect(screen.getByText("AI Engineering Portfolio")).toBeInTheDocument();

      // Navigation links
      expect(screen.getAllByText("Projects").length).toBeGreaterThan(0);
      expect(screen.getAllByText("CV & Resume").length).toBeGreaterThan(0);
      expect(screen.getAllByText("AI Assistant").length).toBeGreaterThan(0);

      // Badge
      expect(screen.getAllByText("RAG").length).toBeGreaterThan(0);
    });

    it("toggles mobile menu drawer on button click and closes with Escape key", () => {
      renderWithProviders(<Navbar locale="en" items={mockItems} />);

      const toggleButton = screen.getByRole("button", { name: /open menu/i });
      expect(toggleButton).toHaveAttribute("aria-expanded", "false");

      // Open drawer
      fireEvent.click(toggleButton);
      expect(toggleButton).toHaveAttribute("aria-expanded", "true");
      expect(screen.getByRole("dialog", { name: /mobile navigation menu/i })).toBeInTheDocument();

      // Close drawer with Escape key
      fireEvent.keyDown(window, { key: "Escape" });
      expect(toggleButton).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("Footer", () => {
    it("renders footer columns, localized labels, and current copyright year", () => {
      renderWithProviders(<Footer locale="en" items={mockItems} />);

      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
      expect(screen.getByText("Navigation")).toBeInTheDocument();
      expect(screen.getByText("Capabilities")).toBeInTheDocument();
      expect(screen.getByText("Engineered with production-grade reliability.")).toBeInTheDocument();

      const currentYear = new Date().getFullYear();
      expect(screen.getByText(new RegExp(String(currentYear)))).toBeInTheDocument();
      expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
    });
  });
});
