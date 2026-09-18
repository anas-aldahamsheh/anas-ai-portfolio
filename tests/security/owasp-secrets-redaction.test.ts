import { describe, it, expect } from "vitest";
import {
  redactSensitiveString,
  redactSensitiveObject,
} from "@/lib/security/redaction";
import { sanitizeErrorMessage } from "@/lib/health/health-service";

describe("OWASP Secrets Management & Anti-Leakage (OWASP A09:2021)", () => {
  describe("String Pattern Redaction", () => {
    it("redacts Bearer authorization tokens", () => {
      const log = "Request failed with Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xyz";
      const redacted = redactSensitiveString(log);
      expect(redacted).not.toContain("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xyz");
      expect(redacted).toContain("Bearer [REDACTED]");
    });

    it("redacts OpenAI-style secret API keys", () => {
      const log = "Failed to call provider with api_key=sk-12345678abcdefghijklmnop";
      const redacted = redactSensitiveString(log);
      expect(redacted).not.toContain("sk-12345678abcdefghijklmnop");
      expect(redacted).toMatch(/\[REDACTED\]/);
    });

    it("redacts credentials from database connection URI strings", () => {
      const errorMsg = "Connection failed to postgresql://postgres:superSecretPass123@db.internal:5432/production";
      const sanitized = sanitizeErrorMessage(errorMsg);
      expect(sanitized).not.toContain("superSecretPass123");
      expect(sanitized).toContain("[REDACTED]");
    });
  });

  describe("Object Deep Redaction", () => {
    it("deeply replaces sensitive keys in payloads and nested logs", () => {
      const payload = {
        userId: "user-123",
        auth: {
          token: "secret-token-abc",
          apiKey: "my-api-key",
        },
        credentials: {
          password: "MySecurePassword123!",
          email: "user@example.com",
        },
      };

      const sanitized = redactSensitiveObject(payload);

      expect(sanitized.userId).toBe("user-123");
      expect(sanitized.credentials.email).toBe("user@example.com");
      expect(sanitized.auth.token).toBe("[REDACTED]");
      expect(sanitized.auth.apiKey).toBe("[REDACTED]");
      expect(sanitized.credentials.password).toBe("[REDACTED]");
    });
  });
});
