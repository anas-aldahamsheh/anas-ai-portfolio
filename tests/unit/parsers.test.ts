import { describe, it, expect, vi } from "vitest";
import { parseCv } from "@/ai/ingestion/parsers/cv-parser";
import { parseSections } from "@/ai/ingestion/parsers/section-parser";
import { parseAllSources } from "@/ai/ingestion/parsers";
import { cvService } from "@/modules/cv/infrastructure/cv-service";
import { sectionService } from "@/modules/content/infrastructure/section-service";

describe("Knowledge Source Parsers (F022)", () => {
  describe("parseCv", () => {
    it("parses published CV into both English and Arabic RawDocuments", async () => {
      vi.spyOn(cvService, "getPublishedCv").mockResolvedValueOnce({
        id: "cv-mock-id",
        cvVersionId: "ver-mock-id",
        versionNumber: 2,
        fileUrl: "/api/cv/download",
        fileName: "Anas_Resume.pdf",
        fileSize: 450000,
        mimeType: "application/pdf",
        changelog: "Updated RAG competencies",
        publishedAt: new Date().toISOString(),
      });

      const docs = await parseCv();
      expect(docs).toHaveLength(2);

      const enDoc = docs.find((d) => d.locale === "en");
      expect(enDoc).toBeDefined();
      expect(enDoc?.sourceType).toBe("cv");
      expect(enDoc?.content).toContain("Curriculum Vitae");
      expect(enDoc?.content).toContain("Version: 2");

      const arDoc = docs.find((d) => d.locale === "ar");
      expect(arDoc).toBeDefined();
      expect(arDoc?.sourceType).toBe("cv");
      expect(arDoc?.content).toContain("السيرة الذاتية");
      expect(arDoc?.content).toContain("رقم الإصدار: 2");
    });
  });

  describe("parseSections", () => {
    it("parses page sections with cards and metrics into RawDocuments", async () => {
      vi.spyOn(sectionService, "getPageSections").mockImplementation(async (_page, locale) => [
        {
          id: `sec-hero-${locale}`,
          pageId: "page-home",
          sectionType: "hero",
          orderIndex: 1,
          isVisible: true,
          status: "PUBLISHED",
          title: locale === "ar" ? "العنوان الرئيسي" : "Main Title",
          subtitle: locale === "ar" ? "الوصف الفرعي" : "Subtitle",
          blocks: [
            {
              id: "b1",
              blockType: "card_collection",
              orderIndex: 1,
              isVisible: true,
              config: {},
              content: {
                items: [
                  { title: "Service A", description: "Desc A", badge: "AI" },
                  { title: "Service B", description: "Desc B" },
                ],
              },
            },
          ],
        },
      ]);

      const docs = await parseSections();
      expect(docs.length).toBeGreaterThanOrEqual(2);

      const enDoc = docs.find((d) => d.locale === "en");
      expect(enDoc).toBeDefined();
      expect(enDoc?.sourceType).toBe("section");
      expect(enDoc?.content).toContain("# Main Title");
      expect(enDoc?.content).toContain("Service A");

      const arDoc = docs.find((d) => d.locale === "ar");
      expect(arDoc).toBeDefined();
      expect(arDoc?.sourceType).toBe("section");
      expect(arDoc?.content).toContain("# العنوان الرئيسي");
      expect(arDoc?.content).toContain("Service A");
    });
  });

  describe("parseAllSources", () => {
    it("filters by sourceType when specified", async () => {
      const cvDocs = await parseAllSources({ sourceType: "cv" });
      expect(cvDocs.every((d) => d.sourceType === "cv")).toBe(true);
    });
  });
});
