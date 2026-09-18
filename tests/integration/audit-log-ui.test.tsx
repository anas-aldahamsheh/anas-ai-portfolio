import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AuditLogViewer } from "@/modules/admin/presentation/audit-log-viewer";
import { LocalizationProvider } from "@/modules/localization/presentation/localization-provider";
import {
  BASELINE_AUDIT_EVENTS,
  BASELINE_AUDIT_SUMMARY,
} from "@/modules/admin/infrastructure/baseline-audit-data";

describe("AuditLogViewer Component (F041)", () => {
  const renderViewer = (locale: "en" | "ar" = "en") => {
    return render(
      <LocalizationProvider locale={locale} dictionary={{}}>
        <AuditLogViewer
          initialEvents={BASELINE_AUDIT_EVENTS}
          initialSummary={BASELINE_AUDIT_SUMMARY}
          locale={locale}
        />
      </LocalizationProvider>,
    );
  };

  it("renders header with F041 badge and title", () => {
    renderViewer();

    expect(screen.getByText("F041")).toBeInTheDocument();
    expect(screen.getByText("Audit Trail & Security Logs")).toBeInTheDocument();
    expect(screen.getByText("Export CSV")).toBeInTheDocument();
    expect(screen.getByText("Export JSON")).toBeInTheDocument();
  });

  it("renders 4 KPI stat cards", () => {
    renderViewer();

    expect(screen.getByText("Total Audit Events")).toBeInTheDocument();
    expect(screen.getByText("High-Impact Security Actions")).toBeInTheDocument();
    expect(screen.getByText("Tracked Entity Types")).toBeInTheDocument();
    expect(screen.getByText("Credential Redaction")).toBeInTheDocument();
  });

  it("displays audit events table with action and entity badges", () => {
    renderViewer();

    expect(screen.getByText("system_init")).toBeInTheDocument();
    expect(screen.getByText("model_assignment")).toBeInTheDocument();
    expect(screen.getByText("prompt_publish")).toBeInTheDocument();
    expect(screen.getByText("cv_publish")).toBeInTheDocument();
    expect(screen.getByText("reindex")).toBeInTheDocument();
    expect(screen.getByText("secret_update")).toBeInTheDocument();
  });

  it("opens state diff modal when clicking Diff button", () => {
    renderViewer();

    const diffButtons = screen.getAllByText("Diff");
    expect(diffButtons.length).toBeGreaterThan(0);

    fireEvent.click(diffButtons[0]!);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Audit Event State Diff")).toBeInTheDocument();
    expect(screen.getByText("Previous State")).toBeInTheDocument();
    expect(screen.getByText("New State (Sanitized)")).toBeInTheDocument();
  });

  it("supports Arabic RTL layout properly", () => {
    renderViewer("ar");

    expect(screen.getByText("سجل التدقيق والأمان غير القابل للتعديل")).toBeInTheDocument();
    expect(screen.getByText("إجمالي الأحداث المسجلة")).toBeInTheDocument();
  });
});
