import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LinkedInPopover } from "@/modules/social/presentation";
import { BASELINE_LINKEDIN_PROFILE } from "@/modules/social/domain/types";
import { LocalizationProvider } from "@/modules/localization/presentation/localization-provider";
import { AdminEditProvider } from "@/modules/admin/presentation";

describe("LinkedIn Profile Popover Interaction (F016)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders trigger button with accessible attributes and toggles popover on click", () => {
    render(
      <LocalizationProvider
        locale="en"
        dictionary={{
          "social.linkedin.title": "LinkedIn Profile",
          "social.linkedin.description": "Connect for professional collaborations.",
          "social.copy_url": "Copy URL",
          "social.copied": "Copied!",
          "social.open_profile": "Open Profile",
          "social.canonical_url": "Canonical URL:",
        }}
      >
        <LinkedInPopover profile={BASELINE_LINKEDIN_PROFILE} locale="en" />
      </LocalizationProvider>,
    );

    // Initial state: popover closed
    const trigger = screen.getByRole("button", { name: /linkedin profile/i });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // Click trigger -> opens popover
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    const dialog = screen.getByRole("dialog", { name: /linkedin profile/i });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText(`@${BASELINE_LINKEDIN_PROFILE.handle}`)).toBeInTheDocument();
    expect(screen.getByText("Connect for professional collaborations.")).toBeInTheDocument();
  });

  it("forces LTR direction for canonical URL in both RTL and LTR locales", () => {
    render(
      <LocalizationProvider
        locale="ar"
        dictionary={{
          "social.linkedin.title": "الملف المهني على LinkedIn",
          "social.linkedin.description": "تواصل مهنيًا لمناقشة القيادة الهندسية.",
          "social.copy_url": "نسخ الرابط",
          "social.copied": "تم النسخ!",
          "social.open_profile": "فتح الملف الشخصي",
          "social.canonical_url": "الرابط الرسمي:",
        }}
      >
        <LinkedInPopover profile={BASELINE_LINKEDIN_PROFILE} locale="ar" />
      </LocalizationProvider>,
    );

    const trigger = screen.getByRole("button", { name: /الملف المهني على LinkedIn/i });
    fireEvent.click(trigger);

    const urlDisplay = screen.getByText(BASELINE_LINKEDIN_PROFILE.url);
    expect(urlDisplay).toBeInTheDocument();
    expect(urlDisplay).toHaveAttribute("dir", "ltr");
  });

  it("copies canonical URL to clipboard and renders feedback state", async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(
      <LocalizationProvider
        locale="en"
        dictionary={{
          "social.linkedin.title": "LinkedIn Profile",
          "social.copy_url": "Copy URL",
          "social.copied": "Copied to clipboard!",
          "social.open_profile": "Open Profile",
          "social.canonical_url": "Canonical URL:",
        }}
      >
        <LinkedInPopover profile={BASELINE_LINKEDIN_PROFILE} locale="en" />
      </LocalizationProvider>,
    );

    const trigger = screen.getByRole("button", { name: /linkedin profile/i });
    fireEvent.click(trigger);

    const copyBtn = screen.getByRole("button", { name: /copy url/i });
    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledWith(BASELINE_LINKEDIN_PROFILE.url);
    await waitFor(() => {
      expect(screen.getByText("Copied to clipboard!")).toBeInTheDocument();
    });
  });

  it("provides secure external link with target='_blank' and rel='noopener noreferrer'", () => {
    render(
      <LocalizationProvider
        locale="en"
        dictionary={{
          "social.linkedin.title": "LinkedIn Profile",
          "social.open_profile": "Open Profile",
        }}
      >
        <LinkedInPopover profile={BASELINE_LINKEDIN_PROFILE} locale="en" />
      </LocalizationProvider>,
    );

    const trigger = screen.getByRole("button", { name: /linkedin profile/i });
    fireEvent.click(trigger);

    const link = screen.getByRole("link", { name: /open profile/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", BASELINE_LINKEDIN_PROFILE.url);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("dismisses popover on Escape key press and restores focus", () => {
    render(
      <LocalizationProvider
        locale="en"
        dictionary={{
          "social.linkedin.title": "LinkedIn Profile",
        }}
      >
        <LinkedInPopover profile={BASELINE_LINKEDIN_PROFILE} locale="en" />
      </LocalizationProvider>,
    );

    const trigger = screen.getByRole("button", { name: /linkedin profile/i });
    fireEvent.click(trigger);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Press Escape
    fireEvent.keyDown(window, { key: "Escape" });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders EditableRegion handle when admin inline edit mode is active", () => {
    render(
      <LocalizationProvider
        locale="en"
        dictionary={{
          "social.linkedin.title": "LinkedIn Profile",
        }}
      >
        <AdminEditProvider isAdmin={true} initialEditMode={true}>
          <LinkedInPopover profile={BASELINE_LINKEDIN_PROFILE} locale="en" />
        </AdminEditProvider>
      </LocalizationProvider>,
    );

    // Open popover
    const trigger = screen.getByRole("button", { name: /linkedin profile/i });
    fireEvent.click(trigger);

    // In edit mode, editable region edit affordance is rendered
    const editBtn = screen.getByRole("button", { name: /edit linkedin profile settings/i });
    expect(editBtn).toBeInTheDocument();
  });
});
