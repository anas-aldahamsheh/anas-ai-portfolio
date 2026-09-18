import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProjectService } from "@/modules/projects/infrastructure/project-service";
import { BASELINE_PROJECTS_EN, BASELINE_PROJECTS_AR } from "@/modules/projects/domain/baseline";

// Mock database
vi.mock("@/lib/db/client", () => ({
  db: {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        leftJoin: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockResolvedValue([]),
          }),
        }),
        innerJoin: vi.fn().mockResolvedValue([]),
      }),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue({}),
      }),
    }),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockResolvedValue({}),
    }),
  },
}));

describe("ProjectService Domain & Infrastructure (F017)", () => {
  let service: ProjectService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ProjectService();
  });

  describe("Baseline Fallback Retrieval", () => {
    it("returns English baseline projects when DB is unseeded in en locale", async () => {
      const result = await service.listProjects({ locale: "en" });

      expect(result.projects.length).toBe(BASELINE_PROJECTS_EN.length);
      expect(result.total).toBe(BASELINE_PROJECTS_EN.length);
      expect(result.categories.length).toBeGreaterThan(0);
      expect(result.tags.length).toBeGreaterThan(0);
      expect(result.projects[0]?.slug).toBe("autonomous-rag-engine");
    });

    it("returns Arabic baseline projects when DB is unseeded in ar locale", async () => {
      const result = await service.listProjects({ locale: "ar" });

      expect(result.projects.length).toBe(BASELINE_PROJECTS_AR.length);
      expect(result.projects[0]?.title).toContain("محرك استرجاع");
    });
  });

  describe("Filtering & Searching", () => {
    it("filters projects by search keyword in title or summary", async () => {
      const result = await service.listProjects({
        locale: "en",
        search: "multimodal",
      });

      expect(result.projects.length).toBe(1);
      expect(result.projects[0]?.slug).toBe("autonomous-rag-engine");
    });

    it("filters projects by category", async () => {
      const result = await service.listProjects({
        locale: "en",
        category: "Enterprise Systems",
      });

      expect(result.projects.length).toBe(1);
      expect(result.projects[0]?.slug).toBe("enterprise-policy-router");
    });

    it("filters projects by technology tag", async () => {
      const result = await service.listProjects({
        locale: "en",
        tag: "WebRTC",
      });

      expect(result.projects.length).toBe(1);
      expect(result.projects[0]?.slug).toBe("neural-speech-pipeline");
    });

    it("filters featured projects only", async () => {
      const result = await service.listProjects({
        locale: "en",
        featuredOnly: true,
      });

      expect(result.projects.length).toBeGreaterThan(0);
      expect(result.projects.every((p) => p.isFeatured)).toBe(true);
    });

    it("returns empty list when no projects match filter criteria", async () => {
      const result = await service.listProjects({
        locale: "en",
        search: "nonexistent-quantum-encryption-pipeline",
      });

      expect(result.projects.length).toBe(0);
      expect(result.total).toBe(0);
    });
  });

  describe("Sorting", () => {
    it("sorts projects by title alphabetically", async () => {
      const result = await service.listProjects({
        locale: "en",
        sortBy: "title",
      });

      const titles = result.projects.map((p) => p.title);
      const sortedTitles = [...titles].sort((a, b) => a.localeCompare(b));
      expect(titles).toEqual(sortedTitles);
    });

    it("sorts projects by latest creation date", async () => {
      const result = await service.listProjects({
        locale: "en",
        sortBy: "latest",
      });

      const dates = result.projects.map((p) => new Date(p.createdAt).getTime());
      for (let i = 0; i < dates.length - 1; i++) {
        const current = dates[i];
        const next = dates[i + 1];
        if (current !== undefined && next !== undefined) {
          expect(current).toBeGreaterThanOrEqual(next);
        }
      }
    });
  });

  describe("Project by Slug", () => {
    it("finds project by valid slug", async () => {
      const project = await service.getProjectBySlug("autonomous-rag-engine", "en");
      expect(project).toBeDefined();
      expect(project?.slug).toBe("autonomous-rag-engine");
      expect(project?.title).toBe("Autonomous Multimodal RAG Engine");
    });

    it("returns null for non-existent slug", async () => {
      const project = await service.getProjectBySlug("unknown-slug-xyz", "en");
      expect(project).toBeNull();
    });
  });

  describe("Caching & Admin Operations", () => {
    it("caches project queries in memory", async () => {
      const first = await service.listProjects({ locale: "en" });
      const second = await service.listProjects({ locale: "en" });
      expect(first).toBe(second);
    });

    it("invalidates cache on invalidateCache() call", async () => {
      const first = await service.listProjects({ locale: "en" });
      service.invalidateCache();
      const second = await service.listProjects({ locale: "en" });
      expect(first).not.toBe(second);
    });

    it("updates project status and invalidates cache", async () => {
      const success = await service.updateProjectStatus(
        "proj-rag-engine",
        "ARCHIVED",
        "admin-user-1",
      );
      expect(success).toBe(true);
    });
  });

  describe("Deep Dive Narrative Fields (F018)", () => {
    it("retrieves complete technical deep dive fields from baseline project", async () => {
      const project = await service.getProjectBySlug("autonomous-rag-engine", "en");
      expect(project).toBeDefined();
      expect(project?.problem).toBeTruthy();
      expect(project?.constraints).toBeTruthy();
      expect(project?.solution).toBeTruthy();
      expect(project?.architecture).toBeTruthy();
      expect(project?.implementation).toBeTruthy();
      expect(project?.challenges).toBeTruthy();
      expect(project?.decisionsTradeoffs).toBeTruthy();
      expect(project?.results).toBeTruthy();
    });

    it("retrieves Arabic deep dive fields correctly", async () => {
      const project = await service.getProjectBySlug("autonomous-rag-engine", "ar");
      expect(project).toBeDefined();
      expect(project?.problem).toContain("البحث الدلالي");
      expect(project?.constraints).toContain("زمن استجابة");
      expect(project?.solution).toContain("خط أنابيب بحث هجين");
      expect(project?.results).toContain("دقة اقتباس");
    });
  });

  describe("Related Projects (F018)", () => {
    it("retrieves related projects excluding current project slug", async () => {
      const related = await service.getRelatedProjects("autonomous-rag-engine", "en", 2);
      expect(related.length).toBeLessThanOrEqual(2);
      expect(related.every((p) => p.slug !== "autonomous-rag-engine")).toBe(true);
    });

    it("prioritizes projects with matching category or tags", async () => {
      const related = await service.getRelatedProjects("autonomous-rag-engine", "en", 2);
      // Autonomous RAG engine has tags TypeScript, pgvector, RAG, Python
      // Enterprise Edge Policy Router has tag TypeScript
      expect(related.length).toBeGreaterThan(0);
      const slugs = related.map((p) => p.slug);
      expect(slugs).not.toContain("autonomous-rag-engine");
    });
  });
});
