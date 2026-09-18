import { describe, it, expect } from "vitest";
import { validateOutboundUrl } from "@/lib/security/ssrf-defense";

describe("OWASP SSRF Protection (OWASP A10:2021)", () => {
  it("blocks localhost and loopback IPv4/IPv6 addresses", () => {
    const loopbacks = [
      "http://localhost:8080/api",
      "http://127.0.0.1:3000",
      "http://[::1]:8000",
      "http://0.0.0.0:80",
    ];

    for (const url of loopbacks) {
      const result = validateOutboundUrl(url);
      expect(result.isValid).toBe(false);
      expect(result.error).toMatch(/blocked|Destination/i);
    }
  });

  it("blocks AWS/GCP/Azure cloud metadata service IP (169.254.169.254)", () => {
    const metadataUrls = [
      "http://169.254.169.254/latest/meta-data/",
      "http://169.254.169.254/computeMetadata/v1/",
      "http://metadata.google.internal/computeMetadata/v1/",
      "http://instance-data/latest/meta-data/",
    ];

    for (const url of metadataUrls) {
      const result = validateOutboundUrl(url);
      expect(result.isValid).toBe(false);
      expect(result.error).toMatch(/metadata|blocked/i);
    }
  });

  it("blocks RFC 1918 private subnets in production", () => {
    const privateUrls = [
      "https://10.0.1.5/admin",
      "https://192.168.1.1/internal",
      "https://172.20.0.10/metrics",
    ];

    for (const url of privateUrls) {
      const result = validateOutboundUrl(url, { isProduction: true });
      expect(result.isValid).toBe(false);
      expect(result.error).toMatch(/private network/i);
    }
  });

  it("rejects dangerous non-HTTP/HTTPS protocols", () => {
    const dangerousUrls = [
      "file:///etc/passwd",
      "gopher://127.0.0.1:70",
      "ftp://ftp.internal.net",
      "ldap://ad.internal.corp",
      "javascript:alert(1)",
    ];

    for (const url of dangerousUrls) {
      const result = validateOutboundUrl(url);
      expect(result.isValid).toBe(false);
      expect(result.error).toMatch(/unsupported protocol|malformed/i);
    }
  });

  it("allows verified public HTTPS provider endpoints", () => {
    const validEndpoints = [
      "https://api.openai.com/v1",
      "https://api.anthropic.com/v1",
      "https://generativelanguage.googleapis.com/v1beta",
    ];

    for (const url of validEndpoints) {
      const result = validateOutboundUrl(url, { isProduction: true });
      expect(result.isValid).toBe(true);
      expect(result.sanitizedUrl).toBe(url);
    }
  });
});
