import { describe, it, expect } from "vitest";
import { validatePdfBytes } from "@/modules/cv/domain/cv";

describe("OWASP File Upload Security & Magic-Byte Validation (OWASP A04:2021)", () => {
  it("authenticates valid PDF documents by verifying '%PDF-' header bytes", () => {
    // 0x25, 0x50, 0x44, 0x46, 0x2D is "%PDF-" in ASCII
    const validPdfBuffer = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]);
    expect(validatePdfBytes(validPdfBuffer)).toBe(true);
  });

  it("rejects malicious executables (ELF / Windows PE) disguised with .pdf extension", () => {
    // Windows PE executable header: "MZ" (0x4D, 0x5A)
    const fakePePdf = Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00]);
    expect(validatePdfBytes(fakePePdf)).toBe(false);

    // Linux ELF executable header: 0x7F 'E' 'L' 'F' (0x7F, 0x45, 0x4C, 0x46)
    const fakeElfPdf = Buffer.from([0x7f, 0x45, 0x4c, 0x46, 0x02, 0x01]);
    expect(validatePdfBytes(fakeElfPdf)).toBe(false);
  });

  it("rejects HTML or script files disguised with .pdf extension", () => {
    const fakeHtmlPdf = Buffer.from("<html><script>alert(1)</script></html>", "utf-8");
    expect(validatePdfBytes(fakeHtmlPdf)).toBe(false);

    const fakeJsPdf = Buffer.from("console.log('malicious code');", "utf-8");
    expect(validatePdfBytes(fakeJsPdf)).toBe(false);
  });

  it("rejects truncated or empty buffers (< 5 bytes)", () => {
    expect(validatePdfBytes(Buffer.from([]))).toBe(false);
    expect(validatePdfBytes(Buffer.from([0x25, 0x50]))).toBe(false);
  });
});
