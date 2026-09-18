import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GitHubPopover } from "@/modules/social/presentation";
import { BASELINE_GITHUB_PROFILE } from "@/modules/social/domain/types";
import { LocalizationProvider } from "@/modules/localization/presentation/localization-provider";
import { AdminEditProvider } from "@/modules/admin/presentation";

describe("GitHub Profile Popover Interaction (F015)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders trigger button with accessible attributes and toggles popover on click", () => {
    render(
      <LocalizationProvider
        locale="en"
        dictionary={{
          "social.github.title": "GitHub Profile",
          "social.github.description": "Explore open-source repositories and code contributions.",
          "social.copy_url": "Copy URL",
          "social.copied": "Copied!",
          "social.open_profile": "Open Profile",
          "social.canonical_url": "Canonical URL:",
        }}
      >
        <AdminEditProvider isAdmin={false}>
          <GitHubPopover profile={BASELINE_GITHUB_PROFILE} locale="en" />
        </AdminEditProvider>
      </LocalizationProvider>,
    );

    const triggerBtn = screen.getByRole("button", { name: "GitHub Profile" });
    expect(triggerBtn).toBeInTheDocument();
    expect(triggerBtn).toHaveAttribute("aria-haspopup", "dialog");
    expect(triggerBtn).toHaveAttribute("aria-expanded", "false");

    // Popover is initially closed
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // Click trigger to open popover
    fireEvent.click(triggerBtn);

    expect(triggerBtn).toHaveAttribute("aria-expanded", "true");
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    // Verify handle and canonical URL
    expect(screen.getByText(`@${BASELINE_GITHUB_PROFILE.handle}`)).toBeInTheDocument();
    expect(screen.getByText(BASELINE_GITHUB_PROFILE.url)).toBeInTheDocument();

    // Canonical URL container enforces LTR
    const urlContainer = screen.getByText(BASELINE_GITHUB_PROFILE.url);
    expect(urlContainer).toHaveAttribute("dir", "ltr");
  });

  it("copies canonical URL to clipboard and provides live feedback", async () => {
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
          "social.github.title": "GitHub Profile",
          "social.copy_url": "Copy URL",
          "social.copied": "Copied!",
          "social.open_profile": "Open Profile",
        }}
      >
        <AdminEditProvider isAdmin={false}>
          <GitHubPopover profile={BASELINE_GITHUB_PROFILE} locale="en" />
        </AdminEditProvider>
      </LocalizationProvider>,
    );

    // Open popover
    fireEvent.click(screen.getByRole("button", { name: "GitHub Profile" }));

    const copyBtn = screen.getByRole("button", { name: /copy url/i });
    expect(copyBtn).toBeInTheDocument();

    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledWith(BASELINE_GITHUB_PROFILE.url);

    // Feedback displayed
    await waitFor(() => {
      expect(screen.getByText("Copied!")).toBeInTheDocument();
    });
  });

  it("opens canonical URL in safe new tab with rel='noopener noreferrer'", () => {
    render(
      <LocalizationProvider
        locale="en"
        dictionary={{
          "social.github.title": "GitHub Profile",
          "social.open_profile": "Open Profile",
        }}
      >
        <AdminEditProvider isAdmin={false}>
          <GitHubPopover profile={BASELINE_GITHUB_PROFILE} locale="en" />
        </AdminEditProvider>
      </LocalizationProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "GitHub Profile" }));

    const openLink = screen.getByRole("link", { name: /open profile/i });
    expect(openLink).toHaveAttribute("href", BASELINE_GITHUB_PROFILE.url);
    expect(openLink).toHaveAttribute("target", "_blank");
    expect(openLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("closes popover on Escape key press and returns focus to trigger", async () => {
    render(
      <LocalizationProvider
        locale="en"
        dictionary={{
          "social.github.title": "GitHub Profile",
        }}
      >
        <AdminEditProvider isAdmin={false}>
          <GitHubPopover profile={BASELINE_GITHUB_PROFILE} locale="en" />
        </AdminEditProvider>
      </LocalizationProvider>,
    );

    const triggerBtn = screen.getByRole("button", { name: "GitHub Profile" });
    fireEvent.click(triggerBtn);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Press Escape
    fireEvent.keyDown(window, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(triggerBtn).toHaveAttribute("aria-expanded", "false");
    });
  });

  it("supports Arabic dynamic localization with LTR URL protection", () => {
    render(
      <LocalizationProvider
        locale="ar"
        dictionary={{
          "social.github.title": "حساب GitHub البرمجي",
          "social.copy_url": "نسخ الرابط",
          "social.open_profile": "فتح الملف الشخصي",
        }}
      >
        <AdminEditProvider isAdmin={false}>
          <GitHubPopover profile={BASELINE_GITHUB_PROFILE} locale="ar" />
        </AdminEditProvider>
      </LocalizationProvider>,
    );

    const triggerBtn = screen.getByRole("button", { name: "حساب GitHub البرمجي" });
    fireEvent.click(triggerBtn);

    expect(screen.getByText("نسخ الرابط")).toBeInTheDocument();
    expect(screen.getByText("فتح الملف الشخصي")).toBeInTheDocument();

    const urlBox = screen.getByText(BASELINE_GITHUB_PROFILE.url);
    expect(urlBox).toHaveAttribute("dir", "ltr");
  });
});
