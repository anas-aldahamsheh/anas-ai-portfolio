import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LanguageSelect } from "@/modules/localization/presentation/language-select";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => "/ar/about",
}));

describe("Custom Select Primitive & Integration", () => {
  it("renders custom styled SelectTrigger without native <select>", () => {
    const { container } = render(
      <Select defaultValue="option-1">
        <SelectTrigger aria-label="Select an option">
          <SelectValue placeholder="Choose an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option-1">Option 1</SelectItem>
          <SelectItem value="option-2">Option 2</SelectItem>
        </SelectContent>
      </Select>,
    );

    // Rule 16 verification: NO native <select> elements in the DOM
    const nativeSelects = container.querySelectorAll("select");
    expect(nativeSelects.length).toBe(0);

    const trigger = screen.getByRole("combobox", { name: "Select an option" });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveClass("border-neutral-200");
  });

  it("supports hasError state on SelectTrigger", () => {
    render(
      <Select>
        <SelectTrigger aria-label="Error select" hasError>
          <SelectValue placeholder="Error state" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">One</SelectItem>
        </SelectContent>
      </Select>,
    );

    const trigger = screen.getByRole("combobox", { name: "Error select" });
    expect(trigger).toHaveClass("border-destructive");
  });

  it("supports disabled state on SelectTrigger", () => {
    render(
      <Select disabled>
        <SelectTrigger aria-label="Disabled select">
          <SelectValue placeholder="Disabled" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">One</SelectItem>
        </SelectContent>
      </Select>,
    );

    const trigger = screen.getByRole("combobox", { name: "Disabled select" });
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveClass("disabled:cursor-not-allowed");
  });

  it("supports RTL direction explicitly", () => {
    render(
      <Select dir="rtl">
        <SelectTrigger aria-label="RTL Select" dir="rtl">
          <SelectValue placeholder="اختر خياراً" />
        </SelectTrigger>
        <SelectContent dir="rtl">
          <SelectItem value="ar-1">خيار 1</SelectItem>
        </SelectContent>
      </Select>,
    );

    const trigger = screen.getByRole("combobox", { name: "RTL Select" });
    expect(trigger).toHaveAttribute("dir", "rtl");
  });

  describe("LanguageSelect", () => {
    it("renders with custom Select and displays current locale without native select", () => {
      const { container } = render(
        <LanguageSelect currentLocale="ar" ariaLabel="Language selection" />,
      );

      // Verify zero native selects
      expect(container.querySelectorAll("select").length).toBe(0);

      const trigger = screen.getByRole("combobox", { name: "Language selection" });
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute("dir", "rtl");
    });

    it("renders with English LTR settings when locale is en", () => {
      const { container } = render(
        <LanguageSelect currentLocale="en" ariaLabel="Language selection" />,
      );

      expect(container.querySelectorAll("select").length).toBe(0);
      const trigger = screen.getByRole("combobox", { name: "Language selection" });
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute("dir", "ltr");
    });
  });
});
