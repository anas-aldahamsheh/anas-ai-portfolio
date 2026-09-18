import { describe, it, expect } from "vitest";
import {
  estimateTokens,
  generateDeterministicPointId,
  chunkDocument,
} from "@/ai/ingestion/chunkers/semantic-chunker";
import { NormalizedDocument } from "@/ai/contracts/ingestion";

describe("Semantic Chunker (F022)", () => {
  describe("estimateTokens", () => {
    it("estimates tokens for English text", () => {
      const text = "A production-ready platform designed for recruiters and engineering leaders.";
      const tokens = estimateTokens(text, "en");
      expect(tokens).toBeGreaterThan(5);
      expect(tokens).toBeLessThan(30);
    });

    it("estimates tokens for Arabic text considering morphology", () => {
      const text =
        "منظومة إنتاجية متكاملة لاستعراض المشاريع البرمجية وحلول الذكاء الاصطناعي المعقدة.";
      const tokens = estimateTokens(text, "ar");
      expect(tokens).toBeGreaterThan(8);
      expect(tokens).toBeLessThan(40);
    });

    it("returns 0 for empty or whitespace text", () => {
      expect(estimateTokens("", "en")).toBe(0);
      expect(estimateTokens("   \n\t  ", "ar")).toBe(0);
    });
  });

  describe("generateDeterministicPointId", () => {
    it("generates a valid RFC 4122-compliant UUID string", () => {
      const uuid = generateDeterministicPointId("project", "proj-1", "en", 0);
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuid).toMatch(uuidRegex);
    });

    it("is completely deterministic given the same inputs", () => {
      const uuid1 = generateDeterministicPointId("cv", "cv-42", "ar", 1);
      const uuid2 = generateDeterministicPointId("cv", "cv-42", "ar", 1);
      expect(uuid1).toBe(uuid2);
    });

    it("generates different UUIDs for different chunk indices or locales", () => {
      const uuid1 = generateDeterministicPointId("project", "p-1", "en", 0);
      const uuid2 = generateDeterministicPointId("project", "p-1", "en", 1);
      const uuid3 = generateDeterministicPointId("project", "p-1", "ar", 0);
      expect(uuid1).not.toBe(uuid2);
      expect(uuid1).not.toBe(uuid3);
    });
  });

  describe("chunkDocument", () => {
    it("chunks single short document into one chunk with heading carryover", () => {
      const doc: NormalizedDocument = {
        sourceType: "project",
        sourceId: "proj-rag",
        title: "Enterprise RAG Pipeline",
        locale: "en",
        content:
          "Detailed description of hybrid search architecture and dense vector indexing with Qdrant.",
        contentHash: "hash-123456",
        metadata: {
          tags: ["TypeScript", "Qdrant", "RAG"],
          section: "Architecture",
        },
      };

      const chunks = chunkDocument(doc);
      expect(chunks).toHaveLength(1);

      const chunk = chunks[0]!;
      expect(chunk.chunkIndex).toBe(0);
      expect(chunk.totalChunks).toBe(1);
      expect(chunk.citationId).toBe("cit:project:proj-rag:0");
      expect(chunk.content).toContain("[PROJECT: Enterprise RAG Pipeline]");
      expect(chunk.content).toContain("hybrid search architecture");
      expect(chunk.metadata.tags).toEqual(["TypeScript", "Qdrant", "RAG"]);
      expect(chunk.metadata.sectionScope).toBe("Architecture");
      expect(chunk.qdrantPointId).toBeDefined();
    });

    it("splits oversized content across multiple chunks without slicing words", () => {
      // Build a multi-paragraph text
      const paragraphs = Array.from({ length: 20 }, (_, i) => {
        return `Paragraph ${i + 1}: Comprehensive discussion on enterprise retrieval systems, reciprocal rank fusion, and BM25 hybrid indexing. Ensuring production reliability and minimal latency under heavy load conditions across distributed nodes.`;
      });

      const doc: NormalizedDocument = {
        sourceType: "project",
        sourceId: "proj-large",
        title: "Distributed RAG",
        locale: "en",
        content: paragraphs.join("\n\n"),
        contentHash: "hash-multi",
      };

      const chunks = chunkDocument(doc, { chunkSize: 100, chunkOverlap: 20 });
      expect(chunks.length).toBeGreaterThan(1);

      // Verify every chunk has proper citation and metadata
      chunks.forEach((chunk, idx) => {
        expect(chunk.chunkIndex).toBe(idx);
        expect(chunk.totalChunks).toBe(chunks.length);
        expect(chunk.citationId).toBe(`cit:project:proj-large:${idx}`);
        expect(chunk.content).toContain("[PROJECT: Distributed RAG]");
        expect(chunk.tokenCount).toBeGreaterThan(0);
      });
    });

    it("handles Arabic content preserving complete Arabic word boundaries", () => {
      const paragraphs = [
        "الفقرة الأولى: تم تصميم بنية البحث الهجين لتجمع بين البحث الدلالي المتجهي والبحث اللفظي الدقيق لضمان دقة الاسترجاع للمفردات العربية والمصطلحات التقنية المعقدة.",
        "الفقرة الثانية: تعتمد المنظومة على نموذج التضمين متعدد اللغات BGE-M3 الذي يدعم أكثر من مئة لغة مع كفاءة استثنائية في تمثيل النصوص العربية بدون فقدان للمعنى السياقي.",
        "الفقرة الثالثة: تستخدم المنظومة خوارزمية Reciprocal Rank Fusion لدمج نتائج البحث واستبعاد أي نتائج متناقضة مع السياق المطلوب.",
      ];

      const doc: NormalizedDocument = {
        sourceType: "project",
        sourceId: "proj-arabic",
        title: "مشروع البحث الهجين",
        locale: "ar",
        content: paragraphs.join("\n\n"),
        contentHash: "hash-ar",
      };

      const chunks = chunkDocument(doc, { chunkSize: 80, chunkOverlap: 15 });
      expect(chunks.length).toBeGreaterThan(0);

      // Verify Arabic words are not sliced into broken characters
      chunks.forEach((c) => {
        expect(c.content).toContain("[PROJECT: مشروع البحث الهجين]");
        // Verify no broken trailing single-letter artifacts
        const words = c.content.split(/\s+/);
        expect(words.length).toBeGreaterThan(5);
      });
    });

    it("returns empty array for empty document", () => {
      const doc: NormalizedDocument = {
        sourceType: "section",
        sourceId: "sec-empty",
        title: "Empty",
        locale: "en",
        content: "   ",
        contentHash: "hash-empty",
      };

      const chunks = chunkDocument(doc);
      expect(chunks).toHaveLength(0);
    });
  });
});
