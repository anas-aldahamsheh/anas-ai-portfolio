import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { ChatDrawer } from "@/modules/chat/presentation/chat-drawer";
import { LocalizationProvider } from "@/modules/localization/presentation/localization-provider";

const mockTranslations: Record<string, string> = {
  "chat.title": "Anas Portfolio Assistant",
  "chat.trigger.label": "Ask Portfolio AI",
  "chat.trigger.aria": "Open AI Chat Assistant",
  "chat.close": "Close chat",
  "chat.clear": "Clear",
  "chat.empty.title": "Ask Anything About Anas's Work",
  "chat.empty.subtitle": "Evidence-backed answers grounded in portfolio systems.",
  "chat.mode.general": "General",
  "chat.mode.recruiter": "Recruiter",
  "chat.mode.technical": "Technical",
  "chat.scope.badge": "Project Evidence Scoped",
  "chat.scope.exit": "Exit Scope",
  "chat.scope.all_portfolio": "Returned to full portfolio search",
  "chat.scope.prompt.architecture": "What architectural decisions and trade-offs were made?",
  "chat.scope.prompt.performance": "How were performance and latency constraints addressed?",
  "chat.scope.prompt.data_flow": "Explain the end-to-end data pipeline and reliability mechanisms.",
  "chat.suggested.skills": "What are Anas's primary architectural strengths?",
  "chat.suggested.projects": "Tell me about the technical architecture of key projects",
  "chat.suggested.experience": "Summarize Anas's engineering leadership experience",
  "chat.placeholder": "Ask a verified engineering question...",
  "chat.send": "Send message",
  "chat.action.stop": "Stop generating",
  "chat.disclaimer": "Answers strictly grounded in verified portfolio evidence.",
  "chat.retry": "Retry",
};

function renderChatDrawer(props: {
  initialOpen?: boolean;
  projectScopeId?: string;
  projectScopeTitle?: string;
}) {
  return render(
    <LocalizationProvider locale="en" dictionary={mockTranslations}>
      <ChatDrawer {...props} />
    </LocalizationProvider>,
  );
}

describe("Ask AI About This Project Scoped Chat (F033)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [
          { slug: "general", name: "General", description: "General mode" },
          { slug: "recruiter", name: "Recruiter", description: "Recruiter mode" },
          { slug: "technical", name: "Technical", description: "Technical mode" },
        ],
      }),
    } as unknown as Response);
  });

  it("renders Scope Badge and project-scoped prompt suggestions when opened with project scope", async () => {
    renderChatDrawer({
      initialOpen: true,
      projectScopeId: "proj-vector-search",
      projectScopeTitle: "Enterprise Vector Search Platform",
    });

    // Verify scope badge is present in header
    const scopeBadge = screen.getByTestId("chat-scope-badge-container");
    expect(scopeBadge).toBeInTheDocument();
    expect(within(scopeBadge).getByText("Enterprise Vector Search Platform")).toBeInTheDocument();
    expect(within(scopeBadge).getByText("• Project Evidence Scoped")).toBeInTheDocument();
    expect(within(scopeBadge).getByTestId("exit-scope-button")).toBeInTheDocument();

    // Verify project-specific suggested prompts are shown
    expect(
      screen.getByText("What architectural decisions and trade-offs were made?"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("How were performance and latency constraints addressed?"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Explain the end-to-end data pipeline and reliability mechanisms."),
    ).toBeInTheDocument();
  });

  it("exits project scope when Exit Scope button is clicked, returning to full portfolio prompts", async () => {
    renderChatDrawer({
      initialOpen: true,
      projectScopeId: "proj-vector-search",
      projectScopeTitle: "Enterprise Vector Search Platform",
    });

    expect(screen.getByTestId("chat-scope-badge-container")).toBeInTheDocument();

    // Click Exit Scope button
    fireEvent.click(screen.getByTestId("exit-scope-button"));

    // Scope badge should disappear
    expect(screen.queryByTestId("chat-scope-badge-container")).not.toBeInTheDocument();

    // Reverted to global portfolio suggested prompts
    expect(
      screen.getByText("What are Anas's primary architectural strengths?"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Tell me about the technical architecture of key projects"),
    ).toBeInTheDocument();
  });

  it("dynamically opens and scopes chat when window receives open-project-chat custom event", async () => {
    renderChatDrawer({ initialOpen: false });

    // Initially closed
    expect(screen.queryByTestId("chat-drawer-container")).not.toBeInTheDocument();

    // Dispatch custom event
    window.dispatchEvent(
      new CustomEvent("open-project-chat", {
        detail: {
          projectId: "proj-ai-gateway",
          projectTitle: "Resilient Multi-Provider AI Gateway",
          prompt: "How does the gateway handle fallbacks?",
        },
      }),
    );

    // Chat drawer should now be open
    await waitFor(() => {
      expect(screen.getByTestId("chat-drawer-container")).toBeInTheDocument();
    });

    // Scope badge reflects the dispatched event
    const scopeBadge = screen.getByTestId("chat-scope-badge-container");
    expect(scopeBadge).toBeInTheDocument();
    expect(within(scopeBadge).getByText("Resilient Multi-Provider AI Gateway")).toBeInTheDocument();

    // Input should be pre-filled with the prompt
    const input = screen.getByPlaceholderText("Ask a verified engineering question...");
    expect(input).toHaveValue("How does the gateway handle fallbacks?");
  });
});
