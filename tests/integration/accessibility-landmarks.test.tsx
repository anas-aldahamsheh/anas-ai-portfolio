import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkipLink, AnnouncerProvider } from "@/modules/accessibility/presentation";

describe("Accessibility Landmarks & Semantics (F047)", () => {
  it("renders page with skip link, main landmark, and accessible live regions", () => {
    const { container } = render(
      <AnnouncerProvider>
        <SkipLink locale="en" />
        <header role="banner">
          <nav aria-label="Main Navigation">
            <a href="#home">Home</a>
            <a href="#projects">Projects</a>
          </nav>
        </header>
        <main id="main-content" tabIndex={-1}>
          <h1>Portfolio Welcome</h1>
          <p>Accessible portfolio experience</p>
        </main>
        <footer role="contentinfo">
          <p>© 2026 Anas</p>
        </footer>
      </AnnouncerProvider>,
    );

    // 1. Skip link presence and target
    const skipLink = screen.getByRole("link", { name: "Skip to main content" });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink.getAttribute("href")).toBe("#main-content");

    // 2. Semantic landmarks
    const main = container.querySelector("main#main-content");
    expect(main).toBeInTheDocument();

    const banner = screen.getByRole("banner");
    expect(banner).toBeInTheDocument();

    const nav = screen.getByRole("navigation", { name: "Main Navigation" });
    expect(nav).toBeInTheDocument();

    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();

    // 3. Screen reader live region
    const announcer = container.querySelector("#sr-announcer-polite");
    expect(announcer).toBeInTheDocument();
    expect(announcer).toHaveAttribute("aria-live", "polite");
  });
});
