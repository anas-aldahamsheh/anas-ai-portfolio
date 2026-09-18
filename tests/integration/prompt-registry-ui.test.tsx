import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PromptRegistryManager } from "@/modules/admin/presentation/prompt-registry-manager";
import { PromptSummary, PromptDetail } from "@/ai/contracts/prompt-registry";

describe("PromptRegistryManager Component (F021)", () => {
  const mockPrompts: PromptSummary[] = [
    {
      id: "p1",
      slug: "chat_system",
      role: "chat_system",
      name: "Portfolio AI Grounded Chat Policy",
      description:
        "Core conversational generation system prompt ensuring strict evidence grounding.",
      activeVersionNumber: 1,
      activeVersionId: "v1",
      totalVersions: 2,
      updatedAt: new Date("2026-01-01"),
    },
    {
      id: "p2",
      slug: "query_router",
      role: "query_router",
      name: "Semantic Query Retrieval Router",
      description: "Classifies user query intent and selects optimal retrieval policy.",
      activeVersionNumber: 1,
      activeVersionId: "v2",
      totalVersions: 1,
      updatedAt: new Date("2026-01-01"),
    },
  ];

  const mockDetail: PromptDetail = {
    id: "p1",
    slug: "chat_system",
    role: "chat_system",
    name: "Portfolio AI Grounded Chat Policy",
    description: "Core conversational generation system prompt ensuring strict evidence grounding.",
    activeVersionNumber: 1,
    activeVersionId: "v1",
    totalVersions: 2,
    updatedAt: new Date("2026-01-01"),
    activeVersion: {
      id: "v1",
      promptId: "p1",
      versionNumber: 1,
      systemPrompt: "You are the AI representative for Anas portfolio with {{context_chunks}}.",
      userTemplate: "User: {{user_message}}",
      isActive: true,
      changelog: "Initial baseline",
      variables: ["context_chunks", "user_message"],
      createdAt: new Date("2026-01-01"),
    },
    versions: [
      {
        id: "v2",
        promptId: "p1",
        versionNumber: 2,
        systemPrompt: "Updated prompt v2",
        userTemplate: null,
        isActive: false,
        changelog: "Draft v2",
        variables: [],
        createdAt: new Date("2026-01-02"),
      },
      {
        id: "v1",
        promptId: "p1",
        versionNumber: 1,
        systemPrompt: "You are the AI representative for Anas portfolio with {{context_chunks}}.",
        userTemplate: "User: {{user_message}}",
        isActive: true,
        changelog: "Initial baseline",
        variables: ["context_chunks", "user_message"],
        createdAt: new Date("2026-01-01"),
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/admin/prompts/chat_system")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ prompt: mockDetail }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ prompts: mockPrompts }),
      });
    });
  });

  it("renders prompts list and initial active prompt", async () => {
    render(<PromptRegistryManager initialPrompts={mockPrompts} locale="en" />);

    expect(screen.getByText("AI Prompt Registry")).toBeInTheDocument();
    expect(screen.getAllByText("Portfolio AI Grounded Chat Policy").length).toBeGreaterThanOrEqual(
      1,
    );
    expect(screen.getByText("Semantic Query Retrieval Router")).toBeInTheDocument();
  });

  it("switches tabs to Version History and renders versions", async () => {
    render(<PromptRegistryManager initialPrompts={mockPrompts} locale="en" />);

    await waitFor(() => {
      expect(screen.getByText("Active Version")).toBeInTheDocument();
    });

    const historyTab = screen.getByText("Version History");
    fireEvent.click(historyTab);

    await waitFor(() => {
      expect(screen.getByText("Version 1")).toBeInTheDocument();
      expect(screen.getByText("Version 2")).toBeInTheDocument();
      expect(screen.getByText("Currently Active")).toBeInTheDocument();
      expect(screen.getByText("Rollback")).toBeInTheDocument();
    });
  });

  it("renders Draft Version tab and form inputs", async () => {
    render(<PromptRegistryManager initialPrompts={mockPrompts} locale="en" />);

    await waitFor(() => {
      expect(screen.getByText("Active Version")).toBeInTheDocument();
    });

    const draftTab = screen.getByText("Draft Version");
    fireEvent.click(draftTab);

    await waitFor(() => {
      expect(screen.getByText("Save Version")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Enter system prompt instructions..."),
      ).toBeInTheDocument();
    });
  });

  it("renders Arabic RTL interface when locale is ar", async () => {
    render(<PromptRegistryManager initialPrompts={mockPrompts} locale="ar" />);

    expect(screen.getByText("سجل التوجيهات الذكية")).toBeInTheDocument();
    expect(screen.getByText("التوجيهات المتاحة")).toBeInTheDocument();
  });
});
