import { describe, it, expect, vi, beforeEach } from "vitest";
import { encryptString, decryptString, maskSecretValue } from "@/lib/security/encryption";
import { validateOutboundUrl } from "@/lib/security/ssrf-defense";
import { redactSensitiveString, redactSensitiveObject } from "@/lib/security/redaction";
import { SecretsService } from "@/lib/security/secrets-service";

// Mock Drizzle DB
vi.mock("@/lib/db/client", () => ({
  db: {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
        orderBy: vi.fn().mockResolvedValue([]),
      }),
    }),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockResolvedValue([]),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    }),
    delete: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue([]),
    }),
  },
}));

describe("Secrets Management & Security Service (F020)", () => {
  describe("AES-256-GCM Encryption & Decryption", () => {
    it("encrypts plaintext and decrypts back to original string", () => {
      const secret = "sk-proj-super-secret-api-key-123456789";
      const payload = encryptString(secret);

      expect(payload.encryptedValue).toBeDefined();
      expect(payload.iv).toBeDefined();
      expect(payload.tag).toBeDefined();
      expect(payload.encryptedValue).not.toBe(secret);

      const decrypted = decryptString(payload);
      expect(decrypted).toBe(secret);
    });

    it("throws error when ciphertext is tampered with (Auth Tag verification)", () => {
      const secret = "top-secret-credentials";
      const payload = encryptString(secret);

      // Tamper with encrypted value
      const tamperedValue =
        payload.encryptedValue.slice(0, -2) +
        (payload.encryptedValue.slice(-2) === "aa" ? "bb" : "aa");

      expect(() =>
        decryptString({
          ...payload,
          encryptedValue: tamperedValue,
        }),
      ).toThrow();
    });

    it("throws error when auth tag is invalid", () => {
      const secret = "another-secret";
      const payload = encryptString(secret);

      expect(() =>
        decryptString({
          ...payload,
          tag: "0123456789abcdef0123456789abcdef",
        }),
      ).toThrow();
    });

    it("masks secret values safely with fingerprint preview", () => {
      expect(maskSecretValue("sk-1234567890abcdef")).toBe("sk-...cdef");
      expect(maskSecretValue("short")).toBe("********");
      expect(maskSecretValue("")).toBe("");
    });
  });

  describe("SSRF Defense Validation (03_SECRETS_AND_PROVIDER_ENDPOINTS.md)", () => {
    it("approves valid external HTTPS endpoints", () => {
      const result = validateOutboundUrl("https://api.openai.com/v1");
      expect(result.isValid).toBe(true);
      expect(result.sanitizedUrl).toBe("https://api.openai.com/v1");
    });

    it("rejects non-HTTP protocols", () => {
      expect(validateOutboundUrl("ftp://files.internal/secret").isValid).toBe(false);
      expect(validateOutboundUrl("javascript:alert(1)").isValid).toBe(false);
      expect(validateOutboundUrl("file:///etc/passwd").isValid).toBe(false);
    });

    it("blocks loopback and localhost addresses by default", () => {
      expect(validateOutboundUrl("http://localhost:8000").isValid).toBe(false);
      expect(validateOutboundUrl("http://127.0.0.1:11434").isValid).toBe(false);
      expect(validateOutboundUrl("http://[::1]:8080").isValid).toBe(false);
    });

    it("blocks cloud metadata service destinations", () => {
      expect(validateOutboundUrl("http://169.254.169.254/latest/meta-data/").isValid).toBe(false);
      expect(
        validateOutboundUrl("http://metadata.google.internal/computeMetadata/v1").isValid,
      ).toBe(false);
    });

    it("requires HTTPS in production mode for public destinations", () => {
      const result = validateOutboundUrl("http://api.external-ai.com/v1", {
        isProduction: true,
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("HTTPS is strictly required");
    });

    it("blocks sensitive standard internal ports", () => {
      expect(validateOutboundUrl("https://external-host.com:22").isValid).toBe(false);
      expect(validateOutboundUrl("https://external-host.com:5432").isValid).toBe(false);
      expect(validateOutboundUrl("https://external-host.com:6379").isValid).toBe(false);
    });
  });

  describe("Log and Payload Redaction", () => {
    it("redacts Bearer tokens and API keys from text", () => {
      const log =
        "Request failed with Authorization: Bearer eyJhbGciOiJIUzI1NiJ9 and sk-test123456789secretKey";
      const redacted = redactSensitiveString(log);

      expect(redacted).not.toContain("eyJhbGciOiJIUzI1NiJ9");
      expect(redacted).not.toContain("secretKey");
      expect(redacted).toContain("[REDACTED]");
    });

    it("redacts sensitive fields in nested objects", () => {
      const payload = {
        userId: "user-123",
        headers: {
          authorization: "Bearer secret-token-xyz",
          cookie: "session_id=123456",
        },
        apiKey: "sk-live-123456789",
        config: {
          password: "super-password",
        },
      };

      const redacted = redactSensitiveObject(payload);
      expect(redacted.userId).toBe("user-123");
      expect(redacted.headers.authorization).toBe("[REDACTED]");
      expect(redacted.headers.cookie).toBe("[REDACTED]");
      expect(redacted.apiKey).toBe("[REDACTED]");
      expect(redacted.config.password).toBe("[REDACTED]");
    });
  });

  describe("SecretsService Store & Retrieval", () => {
    let service: SecretsService;

    beforeEach(() => {
      service = new SecretsService();
    });

    it("stores encrypted secret and returns display-safe metadata", async () => {
      const meta = await service.setSecret(
        "ai_provider_groq_key",
        "gsk_1234567890abcdefghijklmn",
        "admin-user-uuid",
      );

      expect(meta.key).toBe("ai_provider_groq_key");
      expect(meta.exists).toBe(true);
      expect(meta.maskedPreview).toBe("gsk...klmn");
      // Raw secret must NOT be in metadata
      expect((meta as unknown as Record<string, unknown>)["value"]).toBeUndefined();
    });

    it("decrypts stored secret on server side only", async () => {
      await service.setSecret(
        "ai_provider_anthropic_key",
        "sk-ant-api03-abcdef123456",
        "admin-user-uuid",
      );

      const decrypted = await service.getSecret("ai_provider_anthropic_key");
      expect(decrypted).toBe("sk-ant-api03-abcdef123456");
    });

    it("returns null for non-existent secret key", async () => {
      const value = await service.getSecret("non_existent_key");
      expect(value).toBeNull();
    });

    it("verifies existence without decrypting", async () => {
      await service.setSecret("test_secret_key", "secret_value_12345", "admin-user-uuid");

      const exists = await service.hasSecret("test_secret_key");
      expect(exists).toBe(true);

      const notExists = await service.hasSecret("unknown_key");
      expect(notExists).toBe(false);
    });

    it("deletes secret and removes from cache", async () => {
      await service.setSecret("to_delete_key", "value", "admin-user-uuid");
      const deleted = await service.deleteSecret("to_delete_key", "admin-user-uuid");

      expect(deleted).toBe(true);
      const after = await service.getSecret("to_delete_key");
      expect(after).toBeNull();
    });
  });
});
