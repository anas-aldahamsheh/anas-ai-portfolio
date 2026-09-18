import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DynamicPage, SectionRenderer } from "@/modules/content/presentation";
import { MotionProvider } from "@/modules/motion/presentation/motion-provider";
import type { SectionData } from "@/modules/content/domain/sections";

const mockSections: SectionData[] = [
  {
    id: "sec-1",
    pageId: "page-1",
    sectionType: "hero",
    orderIndex: 1,
    isVisible: true,
    status: "PUBLISHED",
    title: "Engineering Excellence",
    subtitle: "High performance architecture",
    blocks: [
      {
        id: "blk-1",
        blockType: "heading",
        orderIndex: 1,
        isVisible: true,
        config: { level: "h1", align: "start" },
        content: { text: "Engineering Excellence", subtitle: "High performance architecture" },
      },
      {
        id: "blk-2",
        blockType: "cta",
        orderIndex: 2,
        isVisible: true,
        config: { variant: "primary", align: "start" },
        content: { label: "View Architecture", url: "/architecture" },
      },
    ],
  },
  {
    id: "sec-2",
    pageId: "page-1",
    sectionType: "metrics",
    orderIndex: 2,
    isVisible: true,
    status: "PUBLISHED",
    title: "Key Metrics",
    blocks: [
      {
        id: "blk-3",
        blockType: "metrics",
        orderIndex: 1,
        isVisible: true,
        config: {},
        content: {
          items: [
            { value: "99.9%", label: "Uptime" },
            { value: "<10ms", label: "Latency" },
          ],
        },
      },
    ],
  },
  {
    id: "sec-draft",
    pageId: "page-1",
    sectionType: "draft-sec",
    orderIndex: 3,
    isVisible: true,
    status: "DRAFT",
    title: "Unpublished Draft",
    blocks: [],
  },
  {
    id: "sec-hidden",
    pageId: "page-1",
    sectionType: "hidden-sec",
    orderIndex: 4,
    isVisible: false,
    status: "PUBLISHED",
    title: "Hidden Section",
    blocks: [],
  },
];

function renderWithMotion(ui: React.ReactNode) {
  return render(<MotionProvider overrideIntensity="none">{ui}</MotionProvider>);
}

describe("Dynamic Section Builder UI Integration (F012)", () => {
  it("renders published, visible sections with headings and blocks", () => {
    renderWithMotion(<DynamicPage sections={mockSections} locale="en" />);

    // Published sections should be rendered
    expect(screen.getAllByText("Engineering Excellence").length).toBeGreaterThan(0);
    expect(screen.getByText("High performance architecture")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View Architecture" })).toBeInTheDocument();
    expect(screen.getByText("Key Metrics")).toBeInTheDocument();
    expect(screen.getByText("99.9%")).toBeInTheDocument();
    expect(screen.getByText("Uptime")).toBeInTheDocument();

    // Draft and hidden sections must NOT be rendered
    expect(screen.queryByText("Unpublished Draft")).not.toBeInTheDocument();
    expect(screen.queryByText("Hidden Section")).not.toBeInTheDocument();
  });

  it("handles unknown block types gracefully without throwing errors", () => {
    const sectionWithUnknownBlock: SectionData = {
      id: "sec-unknown",
      pageId: "page-1",
      sectionType: "custom",
      orderIndex: 1,
      isVisible: true,
      status: "PUBLISHED",
      title: "Unknown Block Test",
      blocks: [
        {
          id: "blk-unknown",
          blockType:
            "unsupported_future_type" as unknown as SectionData["blocks"][number]["blockType"],
          orderIndex: 1,
          isVisible: true,
          config: {},
          content: {},
        },
      ],
    };

    renderWithMotion(<SectionRenderer section={sectionWithUnknownBlock} locale="en" />);
    expect(screen.getByText("Unknown Block Test")).toBeInTheDocument();
  });
});
