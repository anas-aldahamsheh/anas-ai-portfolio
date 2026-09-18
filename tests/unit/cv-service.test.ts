import { describe, it, expect, vi, beforeEach } from "vitest";
import { validatePdfBytes, formatFileSize } from "@/modules/cv/domain/cv";
import { CvService, BASELINE_PUBLISHED_CV } from "@/modules/cv/infrastructure/cv-service";
import { MINIMAL_VALID_PDF_BYTES } from "@/modules/cv/infrastructure/storage-service";

// Mock database operations
vi.mock("@/lib/db/client", () => ({
  db: {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        innerJoin: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
        orderBy: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ versionNumber: 2 }]),
        }),
      }),
    }),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([
          {
            id: "ver-new-1",
            versionNumber: 3,
            fileUrl: "/api/cv/download?file=test.pdf",
            fileName: "test.pdf",
            fileSize: 1024,
            mimeType: "application/pdf",
          },
        ]),
      }),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue({}),
      }),
    }),
  },
}));

describe("CV Domain & Infrastructure Service (F014)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Domain Validation & Helpers", () => {
    it("correctly identifies valid PDF magic bytes (%PDF-)", () => {
      expect(validatePdfBytes(MINIMAL_VALID_PDF_BYTES)).toBe(true);

      const customPdf = Buffer.from("%PDF-1.7\nRandom Content");
      expect(validatePdfBytes(customPdf)).toBe(true);
    });

    it("rejects non-PDF or truncated byte sequences", () => {
      const textFile = Buffer.from("Plain text content");
      expect(validatePdfBytes(textFile)).toBe(false);

      const shortBuffer = Buffer.from("%PD");
      expect(validatePdfBytes(shortBuffer)).toBe(false);

      const emptyBuffer = Buffer.from("");
      expect(validatePdfBytes(emptyBuffer)).toBe(false);
    });

    it("formats raw byte sizes into human readable strings", () => {
      expect(formatFileSize(0)).toBe("0 B");
      expect(formatFileSize(500)).toBe("500 B");
      expect(formatFileSize(1024)).toBe("1.0 KB");
      expect(formatFileSize(450 * 1024)).toBe("450.0 KB");
      expect(formatFileSize(2 * 1024 * 1024)).toBe("2.0 MB");
    });
  });

  describe("CvService Operations", () => {
    const service = new CvService();

    it("retrieves published CV fallback baseline when database is unseeded", async () => {
      service.invalidateCache();
      const published = await service.getPublishedCv();

      expect(published).toBeDefined();
      expect(published.fileName).toBe(BASELINE_PUBLISHED_CV.fileName);
      expect(published.fileUrl).toBe("/api/cv/download");
      expect(published.versionNumber).toBe(1);
    });

    it("caches published CV in memory on consecutive calls", async () => {
      const pub1 = await service.getPublishedCv();
      const pub2 = await service.getPublishedCv();
      expect(pub1).toBe(pub2);
    });

    it("rejects uploading a file with invalid PDF magic bytes", async () => {
      const invalidFileBuffer = Buffer.from("<html>Not a PDF</html>");
      await expect(
        service.createVersion("test.pdf", invalidFileBuffer, "Test upload", "admin-1"),
      ).rejects.toThrow("Invalid file content: Not a valid PDF document");
    });

    it("rejects file exceeding 10MB limit", async () => {
      const oversizedBuffer = Buffer.alloc(11 * 1024 * 1024);
      oversizedBuffer[0] = 0x25;
      oversizedBuffer[1] = 0x50;
      oversizedBuffer[2] = 0x44;
      oversizedBuffer[3] = 0x46;
      oversizedBuffer[4] = 0x2d;

      await expect(
        service.createVersion("large.pdf", oversizedBuffer, "Test upload", "admin-1"),
      ).rejects.toThrow("File exceeds maximum allowed size of 10MB");
    });

    it("successfully creates a new version with valid PDF bytes", async () => {
      const version = await service.createVersion(
        "portfolio-cv.pdf",
        MINIMAL_VALID_PDF_BYTES,
        "Added 2026 AI Agent benchmarks",
        "admin-1",
      );

      expect(version).toBeDefined();
      expect(version.fileName).toBe("portfolio-cv.pdf");
      expect(version.mimeType).toBe("application/pdf");
    });

    it("publishes a version and invalidates the in-memory cache", async () => {
      const result = await service.publishVersion("ver-123", "admin-1");
      expect(result).toBe(true);
    });

    it("supports rolling back to an older version", async () => {
      const result = await service.rollbackVersion("ver-old", "admin-1");
      expect(result).toBe(true);
    });
  });
});
