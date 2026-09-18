import { describe, it, expect } from "vitest";
import {
  normalizeArabicText,
  stripHtmlTags,
  cleanWhitespace,
  computeContentHash,
  normalizeDocument,
} from "@/ai/ingestion/normalizers/content-normalizer";
import { RawDocument } from "@/ai/contracts/ingestion";

describe("Content Normalizer (F022)", () => {
  describe("normalizeArabicText", () => {
    it("strips Arabic diacritics / tashkeel correctly", () => {
      const input = "مُهَنْدِسُ بَرْمَجِيَّاتٍ وَذَكَاءٍ اصْطِنَاعِيّ";
      const normalized = normalizeArabicText(input);
      // Diacritics removed, alef/teh marbuta normalized
      expect(normalized).toBe("مهندس برمجيات وذكاء اصطناعي");
    });

    it("removes tatweel (kashida ـ) without breaking words", () => {
      const input = "مــهــنــدس";
      const normalized = normalizeArabicText(input);
      expect(normalized).toBe("مهندس");
    });

    it("normalizes Alef forms (أ, إ, آ, ٱ) into bare Alef (ا)", () => {
      const input = "أنس إبراهيم آفاق ٱستخراج";
      const normalized = normalizeArabicText(input);
      expect(normalized).toBe("انس ابراهيم افاق استخراج");
    });

    it("normalizes Teh Marbuta (ة) to Heh (ه)", () => {
      const input = "هندسة معمارية تقنية";
      const normalized = normalizeArabicText(input);
      expect(normalized).toBe("هندسه معماريه تقنيه");
    });

    it("normalizes Alef Maksura (ى) to Yeh (ي)", () => {
      const input = "علي ومصطفى والهدى";
      const normalized = normalizeArabicText(input);
      expect(normalized).toBe("علي ومصطفي والهدي");
    });

    it("handles empty or blank string gracefully", () => {
      expect(normalizeArabicText("")).toBe("");
    });
  });

  describe("stripHtmlTags", () => {
    it("removes simple and nested HTML tags", () => {
      const input = "<p>This is <strong>strong</strong> and <em>emphasized</em> text.</p>";
      const stripped = stripHtmlTags(input);
      expect(stripped).toContain("This is  strong  and  emphasized  text.");
      expect(stripped).not.toContain("<p>");
      expect(stripped).not.toContain("<strong>");
    });

    it("completely removes script and style blocks", () => {
      const input =
        "Text before<script>alert('hack');</script> and after<style>.cls{color:red;}</style>";
      const stripped = stripHtmlTags(input);
      expect(stripped).not.toContain("alert");
      expect(stripped).not.toContain(".cls");
      expect(stripped).toContain("Text before");
      expect(stripped).toContain("and after");
    });
  });

  describe("cleanWhitespace", () => {
    it("collapses multiple consecutive spaces and empty lines", () => {
      const input = "  Hello    world!  \n\n\n\n\nNew   line  ";
      const cleaned = cleanWhitespace(input);
      expect(cleaned).toBe("Hello world! \n\nNew line");
    });
  });

  describe("computeContentHash", () => {
    it("produces deterministic 64-char hex SHA-256 hash", () => {
      const text = "Consistent test content for RAG pipeline";
      const hash1 = computeContentHash(text);
      const hash2 = computeContentHash(text);
      expect(hash1).toHaveLength(64);
      expect(hash1).toBe(hash2);
    });

    it("changes hash when content changes", () => {
      const hash1 = computeContentHash("Version A");
      const hash2 = computeContentHash("Version B");
      expect(hash1).not.toBe(hash2);
    });

    it("includes metadata in hash computation if provided", () => {
      const text = "Same text";
      const hashWithoutMeta = computeContentHash(text);
      const hashWithMeta = computeContentHash(text, { version: 2 });
      expect(hashWithMeta).not.toBe(hashWithoutMeta);
    });
  });

  describe("normalizeDocument", () => {
    it("normalizes English raw document", () => {
      const doc: RawDocument = {
        sourceType: "project",
        sourceId: "proj-123",
        title: "AI Portfolio",
        locale: "en",
        content: "<p>Building a <strong>modern</strong> RAG platform.</p>",
      };

      const normalized = normalizeDocument(doc);
      expect(normalized.content).toBe("Building a modern RAG platform.");
      expect(normalized.contentHash).toBeDefined();
      expect(normalized.contentHash).toHaveLength(64);
    });

    it("normalizes Arabic raw document with full diacritics stripping", () => {
      const doc: RawDocument = {
        sourceType: "cv",
        sourceId: "cv-123",
        title: "السيرة الذاتية",
        locale: "ar",
        content: "<h2>مُهَنْدِسُ ذَكَاءٍ اصْطِنَاعِيّ</h2><p>بِنَاءُ مَنْظُومَاتِ RAG</p>",
      };

      const normalized = normalizeDocument(doc);
      expect(normalized.content).toBe("مهندس ذكاء اصطناعي بناء منظومات RAG");
      expect(normalized.contentHash).toBeDefined();
    });
  });
});
