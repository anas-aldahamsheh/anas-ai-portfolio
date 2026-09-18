import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import {
  SkipLink,
  AnnouncerProvider,
  useAnnouncer,
} from "@/modules/accessibility/presentation";

function TestAnnounceConsumer() {
  const { announce } = useAnnouncer();
  return (
    <div>
      <button onClick={() => announce("Operation completed successfully", "polite")}>
        Announce Polite
      </button>
      <button onClick={() => announce("Critical alert occurred", "assertive")}>
        Announce Assertive
      </button>
    </div>
  );
}

describe("Accessibility Primitives (F047)", () => {
  describe("SkipLink", () => {
    it("renders with English text linking to #main-content by default", () => {
      render(<SkipLink locale="en" />);
      const link = screen.getByRole("link", { name: "Skip to main content" });

      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "#main-content");
      expect(link).toHaveClass("sr-only");
    });

    it("renders with Arabic text when locale is ar", () => {
      render(<SkipLink locale="ar" />);
      const link = screen.getByRole("link", { name: "الانتقال إلى المحتوى الرئيسي" });

      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "#main-content");
    });

    it("respects custom target ID when provided", () => {
      render(<SkipLink locale="en" targetId="custom-section" />);
      const link = screen.getByRole("link", { name: "Skip to main content" });

      expect(link).toHaveAttribute("href", "#custom-section");
    });
  });

  describe("AnnouncerProvider & useAnnouncer", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("renders accessible live regions for screen readers", () => {
      const { container } = render(
        <AnnouncerProvider>
          <div>Child content</div>
        </AnnouncerProvider>,
      );

      const politeRegion = container.querySelector("#sr-announcer-polite");
      expect(politeRegion).toHaveAttribute("aria-live", "polite");
      expect(politeRegion).toHaveAttribute("role", "status");

      const assertiveRegion = container.querySelector("#sr-announcer-assertive");
      expect(assertiveRegion).toHaveAttribute("aria-live", "assertive");
      expect(assertiveRegion).toHaveAttribute("role", "alert");
    });

    it("updates polite live region when announce is triggered", () => {
      render(
        <AnnouncerProvider>
          <TestAnnounceConsumer />
        </AnnouncerProvider>,
      );

      const button = screen.getByText("Announce Polite");
      button.click();

      act(() => {
        vi.advanceTimersByTime(100);
      });

      const politeRegion = screen.getByText("Operation completed successfully");
      expect(politeRegion).toBeInTheDocument();
    });

    it("updates assertive live region when alert announcement is triggered", () => {
      render(
        <AnnouncerProvider>
          <TestAnnounceConsumer />
        </AnnouncerProvider>,
      );

      const button = screen.getByText("Announce Assertive");
      button.click();

      act(() => {
        vi.advanceTimersByTime(100);
      });

      const assertiveRegion = screen.getByText("Critical alert occurred");
      expect(assertiveRegion).toBeInTheDocument();
    });
  });
});
