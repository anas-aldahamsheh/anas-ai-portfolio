import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CacheManager } from "@/modules/admin/presentation/cache-manager";
import type { CacheStats, CacheKeySummary } from "@/lib/cache/cache-types";

describe("CacheManager UI Component (F043)", () => {
  const mockStats: CacheStats = {
    totalKeys: 12,
    hits: 154,
    misses: 23,
    hitRate: 0.87,
    tagsCount: 5,
    tagDistribution: {
      content: 4,
      projects: 3,
      ai: 2,
      cv: 1,
      prompts: 2,
    },
  };

  const mockKeys: CacheKeySummary[] = [
    {
      key: "projects:catalog:en",
      tags: ["projects"],
      ttlRemainingMs: 45000,
      hits: 42,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 45000).toISOString(),
    },
    {
      key: "content:home:sections",
      tags: ["content"],
      ttlRemainingMs: 30000,
      hits: 89,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30000).toISOString(),
    },
  ];

  it("renders F043 badge, title, and all KPI stat cards", () => {
    render(
      <CacheManager
        initialStats={mockStats}
        initialKeys={mockKeys}
        locale="en"
      />,
    );

    expect(screen.getByText("F043")).toBeInTheDocument();
    expect(screen.getByText("Caching & Invalidation")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument(); // totalKeys
    expect(screen.getByText("87.0%")).toBeInTheDocument(); // hitRate
    expect(screen.getByText("154")).toBeInTheDocument(); // hits
    expect(screen.getByText("23")).toBeInTheDocument(); // misses
  });

  it("renders tag invalidation cards with items count", () => {
    render(
      <CacheManager
        initialStats={mockStats}
        initialKeys={mockKeys}
        locale="en"
      />,
    );

    expect(screen.getAllByText("Content & Sections")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Projects Catalog")[0]).toBeInTheDocument();
    expect(screen.getAllByText("AI Registry")[0]).toBeInTheDocument();
  });

  it("renders cached keys table with keys and remaining TTL", () => {
    render(
      <CacheManager
        initialStats={mockStats}
        initialKeys={mockKeys}
        locale="en"
      />,
    );

    expect(screen.getByText("projects:catalog:en")).toBeInTheDocument();
    expect(screen.getByText("content:home:sections")).toBeInTheDocument();
    expect(screen.getByText("45s")).toBeInTheDocument();
    expect(screen.getByText("30s")).toBeInTheDocument();
  });

  it("renders with RTL direction and Arabic labels when locale is ar", () => {
    const { container } = render(
      <CacheManager
        initialStats={mockStats}
        initialKeys={mockKeys}
        locale="ar"
      />,
    );

    expect(container.firstChild).toHaveAttribute("dir", "rtl");
    expect(screen.getByText("ذاكرة التخزين المؤقت وتفريغها")).toBeInTheDocument();
    expect(screen.getAllByText("المحتوى والأقسام")[0]).toBeInTheDocument();
    expect(screen.getAllByText("كتالوج المشاريع")[0]).toBeInTheDocument();
  });
});
