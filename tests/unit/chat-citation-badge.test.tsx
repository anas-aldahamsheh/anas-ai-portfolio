import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChatCitationBadge } from "@/modules/chat/presentation/chat-citation-badge";
import { LocalizationProvider } from "@/modules/localization/presentation/localization-provider";
import { CitationMapping } from "@/ai/contracts";

describe("ChatCitationBadge Component", () => {
  const mockCitation: CitationMapping = {
    citationId: "proj_vector:c1",
    sourceId: "project-vector-search",
    sourceType: "project",
    title: "Enterprise Vector Search Platform",
    locale: "en",
    headingHierarchy: ["Architecture", "Indexing"],
    occurrences: 1,
  };

  const renderWithLocalization = (ui: React.ReactElement) => {
    return render(
      <LocalizationProvider
        locale="en"
        dictionary={{ "chat.citations.section": "Section", "chat.citations.open": "View Source" }}
      >
        {ui}
      </LocalizationProvider>,
    );
  };

  it("renders badge button with citation ID", () => {
    renderWithLocalization(<ChatCitationBadge citation={mockCitation} />);

    const badgeBtn = screen.getByTestId("citation-badge-proj_vector:c1");
    expect(badgeBtn).toBeInTheDocument();
    expect(badgeBtn).toHaveTextContent("[proj_vector:c1]");
  });

  it("opens popover dialog with title and hierarchy on click", () => {
    renderWithLocalization(<ChatCitationBadge citation={mockCitation} />);

    const badgeBtn = screen.getByTestId("citation-badge-proj_vector:c1");
    fireEvent.click(badgeBtn);

    const popover = screen.getByTestId("citation-popover-proj_vector:c1");
    expect(popover).toBeInTheDocument();
    expect(screen.getByText("Enterprise Vector Search Platform")).toBeInTheDocument();
    expect(screen.getByText("Architecture › Indexing")).toBeInTheDocument();
    expect(screen.getByText("View Source")).toBeInTheDocument();
  });

  it("dismisses popover on Escape key press", () => {
    renderWithLocalization(<ChatCitationBadge citation={mockCitation} />);

    const badgeBtn = screen.getByTestId("citation-badge-proj_vector:c1");
    fireEvent.click(badgeBtn);

    expect(screen.getByTestId("citation-popover-proj_vector:c1")).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });

    expect(screen.queryByTestId("citation-popover-proj_vector:c1")).not.toBeInTheDocument();
  });
});
