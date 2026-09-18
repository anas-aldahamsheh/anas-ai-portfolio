import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FeatureFlagManager } from "@/modules/admin/presentation/feature-flag-manager";
import { LocalizationProvider } from "@/modules/localization/presentation/localization-provider";
import { BASELINE_FEATURE_FLAGS } from "@/modules/admin/infrastructure/baseline-feature-flags";

describe("FeatureFlagManager Component (F042)", () => {
  const renderManager = (locale: "en" | "ar" = "en") => {
    return render(
      <LocalizationProvider locale={locale} dictionary={{}}>
        <FeatureFlagManager initialFlags={BASELINE_FEATURE_FLAGS} locale={locale} />
      </LocalizationProvider>,
    );
  };

  it("renders header with F042 badge and title", () => {
    renderManager();

    expect(screen.getByText("F042")).toBeInTheDocument();
    expect(screen.getByText("Feature Flag Manager")).toBeInTheDocument();
  });

  it("renders category filter buttons", () => {
    renderManager();

    expect(screen.getByText("All Flags")).toBeInTheDocument();
    expect(screen.getByText("AI & RAG")).toBeInTheDocument();
    expect(screen.getByText("Security")).toBeInTheDocument();
    expect(screen.getByText("UI & Admin")).toBeInTheDocument();
    expect(screen.getByText("Performance")).toBeInTheDocument();
    expect(screen.getByText("Experimental")).toBeInTheDocument();
  });

  it("displays feature flag cards with keys and descriptions", () => {
    renderManager();

    expect(screen.getByText("ai.query_rewriting")).toBeInTheDocument();
    expect(screen.getByText("ai.reranker")).toBeInTheDocument();
    expect(screen.getByText("security.rate_limiting")).toBeInTheDocument();
  });

  it("filters flags when category is selected", () => {
    renderManager();

    // Click Security category
    fireEvent.click(screen.getByText("Security"));

    expect(screen.getByText("security.rate_limiting")).toBeInTheDocument();
    expect(screen.queryByText("ai.query_rewriting")).not.toBeInTheDocument();
  });

  it("supports Arabic RTL layout properly", () => {
    renderManager("ar");

    expect(screen.getByText("إدارة رايات الميزات (Feature Flags)")).toBeInTheDocument();
    expect(screen.getByText("جميع الرايات")).toBeInTheDocument();
  });
});
