import { describe, it, expect } from "vitest";
import { validateEnv } from "@/lib/config/env";

describe("Environment Validation (src/lib/config/env.ts)", () => {
  const validEnv = {
    NODE_ENV: "test",
    PORT: "3000",
    NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/portfolio",
    BETTER_AUTH_SECRET: "a_very_secure_secret_key_that_is_at_least_32_chars",
    BETTER_AUTH_URL: "http://localhost:3000",
    ENCRYPTION_MASTER_KEY: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    LOG_LEVEL: "info",
  };

  it("successfully validates a complete valid environment configuration", () => {
    const parsed = validateEnv(validEnv);
    expect(parsed.NODE_ENV).toBe("test");
    expect(parsed.PORT).toBe(3000);
    expect(parsed.NEXT_PUBLIC_APP_URL).toBe("http://localhost:3000");
    expect(parsed.DATABASE_URL).toBe("postgresql://postgres:postgres@localhost:5432/portfolio");
    expect(parsed.ENCRYPTION_MASTER_KEY).toHaveLength(64);
  });

  it("fails when BETTER_AUTH_SECRET is shorter than 32 characters", () => {
    const invalid = {
      ...validEnv,
      BETTER_AUTH_SECRET: "short_secret",
    };
    expect(() => validateEnv(invalid)).toThrow(/BETTER_AUTH_SECRET/);
  });

  it("fails when ENCRYPTION_MASTER_KEY is not a valid 64-char hex string", () => {
    const invalidHex = {
      ...validEnv,
      ENCRYPTION_MASTER_KEY: "not_a_valid_hex_string_too_short",
    };
    expect(() => validateEnv(invalidHex)).toThrow(/ENCRYPTION_MASTER_KEY/);

    const nonHexChars = {
      ...validEnv,
      ENCRYPTION_MASTER_KEY: "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",
    };
    expect(() => validateEnv(nonHexChars)).toThrow(/ENCRYPTION_MASTER_KEY/);
  });

  it("fails when NEXT_PUBLIC_APP_URL is not a valid URL", () => {
    const invalidUrl = {
      ...validEnv,
      NEXT_PUBLIC_APP_URL: "not-a-url",
    };
    expect(() => validateEnv(invalidUrl)).toThrow(/NEXT_PUBLIC_APP_URL/);
  });

  it("applies default values for optional settings", () => {
    const parsed = validateEnv(validEnv);
    expect(parsed.LOG_LEVEL).toBe("info");
  });
});
