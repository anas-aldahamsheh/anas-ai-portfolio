import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ChatDrawer } from "@/modules/chat/presentation/chat-drawer";
import { LocalizationProvider } from "@/modules/localization/presentation/localization-provider";

describe("ChatDrawer Component (F031)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Mock scrollIntoView for jsdom
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  const renderWithLocalization = (ui: React.ReactElement, initialLocale: "en" | "ar" = "en") => {
    const dictionary: Record<string, string> = {
      "chat.trigger.label": "Chat with Portfolio AI",
      "chat.trigger.aria": "Open AI conversation drawer",
      "chat.title": "Portfolio AI Assistant",
      "chat.subtitle": "Evidence-grounded answers citing Anas's verified projects & skills",
      "chat.placeholder": "Ask about projects, architecture, or skills...",
      "chat.send": "Send",
      "chat.close": "Close chat",
      "chat.clear": "New Chat",
      "chat.mode.general": "General",
      "chat.mode.recruiter": "Recruiter",
      "chat.mode.technical": "Technical",
      "chat.empty.title": "How can I help you today?",
      "chat.empty.subtitle": "Pick a suggested topic or ask a question.",
      "chat.suggested.skills": "What are Anas's primary AI & ML engineering skills?",
      "chat.suggested.projects": "Tell me about the technical architecture of Anas's key projects",
      "chat.suggested.experience": "Summarize Anas's professional engineering track record",
      "chat.disclaimer": "Answers strictly grounded in Anas's verified portfolio evidence.",
    };

    return render(
      <LocalizationProvider locale={initialLocale} dictionary={dictionary}>
        {ui}
      </LocalizationProvider>,
    );
  };

  it("renders floating trigger button with accessible label", () => {
    renderWithLocalization(<ChatDrawer />);

    const triggerBtn = screen.getByTestId("chat-trigger-button");
    expect(triggerBtn).toBeInTheDocument();
    expect(triggerBtn).toHaveAttribute("aria-label", "Open AI conversation drawer");
    expect(screen.getByText("Chat with Portfolio AI")).toBeInTheDocument();
  });

  it("opens slide-over drawer when trigger button is clicked", () => {
    renderWithLocalization(<ChatDrawer />);

    const triggerBtn = screen.getByTestId("chat-trigger-button");
    fireEvent.click(triggerBtn);

    const drawer = screen.getByTestId("chat-drawer-container");
    expect(drawer).toBeInTheDocument();
    expect(screen.getByText("Portfolio AI Assistant")).toBeInTheDocument();
    expect(screen.getByTestId("chat-mode-selector")).toBeInTheDocument();
  });

  it("closes drawer when close button is clicked", () => {
    renderWithLocalization(<ChatDrawer initialOpen={true} />);

    expect(screen.getByTestId("chat-drawer-container")).toBeInTheDocument();

    const closeBtn = screen.getByTestId("chat-close-button");
    fireEvent.click(closeBtn);

    expect(screen.queryByTestId("chat-drawer-container")).not.toBeInTheDocument();
  });

  it("allows switching conversation modes", () => {
    renderWithLocalization(<ChatDrawer initialOpen={true} />);

    const recruiterTab = screen.getByTestId("mode-tab-recruiter");
    expect(recruiterTab).toBeInTheDocument();

    fireEvent.click(recruiterTab);
    expect(recruiterTab).toHaveClass("bg-card");

    const technicalTab = screen.getByTestId("mode-tab-technical");
    fireEvent.click(technicalTab);
    expect(technicalTab).toHaveClass("bg-card");
  });

  it("displays suggested prompt chips in empty state and clicking sends message", async () => {
    // Mock global fetch for chat submission
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        success: true,
        result: {
          answer: "Anas excels in RAG, vector databases, and full-stack systems.",
          citations: [],
          direction: "ltr",
        },
      }),
    });
    global.fetch = mockFetch;

    renderWithLocalization(<ChatDrawer initialOpen={true} />);

    const chip = screen.getByTestId("suggested-prompt-0");
    expect(chip).toBeInTheDocument();
    expect(chip).toHaveTextContent("What are Anas's primary AI & ML engineering skills?");

    fireEvent.click(chip);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/chat",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining("What are Anas's primary AI & ML engineering skills?"),
        }),
      );
    });
  });
});
