import { describe, it, expect } from "vitest";
import {
  buildVectorSearchFilter,
  matchesRetrievalFilter,
  createProjectScopeFilter,
  createCvFilter,
  createSectionScopeFilter,
} from "@/ai/retrieval/filters/filter-builder";
import { RetrievalFilter } from "@/ai/contracts/retrieval";

describe("Retrieval Filter Builder & Matcher", () => {
  it("builds Qdrant SearchFilter from RetrievalFilter", () => {
    const filter: RetrievalFilter = {
      locale: "ar",
      sourceType: "project",
      sourceId: "proj-123",
      sectionScope: "hero",
      customFilters: { isFeatured: true },
    };

    const vectorFilter = buildVectorSearchFilter(filter);
    expect(vectorFilter?.must).toHaveLength(5);
    expect(vectorFilter?.must).toContainEqual({ key: "locale", match: { value: "ar" } });
    expect(vectorFilter?.must).toContainEqual({ key: "sourceType", match: { value: "project" } });
    expect(vectorFilter?.must).toContainEqual({ key: "sourceId", match: { value: "proj-123" } });
    expect(vectorFilter?.must).toContainEqual({ key: "sectionScope", match: { value: "hero" } });
    expect(vectorFilter?.must).toContainEqual({ key: "isFeatured", match: { value: true } });
  });

  it("returns undefined when filter is empty or not provided", () => {
    expect(buildVectorSearchFilter(undefined)).toBeUndefined();
    expect(buildVectorSearchFilter({})).toBeUndefined();
  });

  it("evaluates in-memory filter matching accurately", () => {
    const record = {
      sourceType: "project",
      sourceId: "proj-ai-agent",
      locale: "en",
      sectionScope: "details",
      tags: ["ai", "rag", "nextjs"],
    };

    expect(matchesRetrievalFilter(record, { sourceType: "project" })).toBe(true);
    expect(matchesRetrievalFilter(record, { sourceType: "cv" })).toBe(false);

    expect(matchesRetrievalFilter(record, { locale: "en" })).toBe(true);
    expect(matchesRetrievalFilter(record, { locale: "ar" })).toBe(false);

    expect(matchesRetrievalFilter(record, { sourceId: "proj-ai-agent" })).toBe(true);
    expect(matchesRetrievalFilter(record, { sourceId: "proj-other" })).toBe(false);

    expect(matchesRetrievalFilter(record, { tags: ["rag"] })).toBe(true);
    expect(matchesRetrievalFilter(record, { tags: ["python"] })).toBe(false);

    // Array sourceType
    expect(matchesRetrievalFilter(record, { sourceType: ["project", "cv"] })).toBe(true);
    expect(matchesRetrievalFilter(record, { sourceType: ["cv", "section"] })).toBe(false);
  });

  it("creates specialized scoped filters", () => {
    const projectFilter = createProjectScopeFilter("proj-456", "ar");
    expect(projectFilter).toEqual({
      sourceType: "project",
      sourceId: "proj-456",
      locale: "ar",
    });

    const cvFilter = createCvFilter("en");
    expect(cvFilter).toEqual({
      sourceType: "cv",
      locale: "en",
    });

    const sectionFilter = createSectionScopeFilter("experience", "ar");
    expect(sectionFilter).toEqual({
      sourceType: "section",
      sectionScope: "experience",
      locale: "ar",
    });
  });
});
