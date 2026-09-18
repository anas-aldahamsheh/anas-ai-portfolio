import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logger } from "@/lib/observability/logger";

describe("Structured Logger (src/lib/observability/logger.ts)", () => {
  let infoSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("outputs structured JSON logs for info messages", () => {
    logger.info("server_started", {
      module: "core",
      requestId: "req-123",
      latencyMs: 42,
    });

    expect(infoSpy).toHaveBeenCalledTimes(1);
    const raw = infoSpy.mock.calls[0]?.[0] as string;
    const parsed = JSON.parse(raw);

    expect(parsed.severity).toBe("info");
    expect(parsed.event).toBe("server_started");
    expect(parsed.module).toBe("core");
    expect(parsed.requestId).toBe("req-123");
    expect(parsed.latencyMs).toBe(42);
    expect(parsed.timestamp).toBeDefined();
  });

  it("outputs structured JSON logs for warning messages", () => {
    logger.warn("rate_limit_approaching", {
      module: "rate_limiter",
      metadata: { usagePercent: 85 },
    });

    expect(warnSpy).toHaveBeenCalledTimes(1);
    const raw = warnSpy.mock.calls[0]?.[0] as string;
    const parsed = JSON.parse(raw);

    expect(parsed.severity).toBe("warn");
    expect(parsed.event).toBe("rate_limit_approaching");
    expect(parsed.metadata.usagePercent).toBe(85);
  });

  it("outputs structured JSON logs for error messages with safe error codes", () => {
    logger.error("database_connection_failed", {
      module: "db",
      errorCode: "ECONNREFUSED",
    });

    expect(errorSpy).toHaveBeenCalledTimes(1);
    const raw = errorSpy.mock.calls[0]?.[0] as string;
    const parsed = JSON.parse(raw);

    expect(parsed.severity).toBe("error");
    expect(parsed.event).toBe("database_connection_failed");
    expect(parsed.errorCode).toBe("ECONNREFUSED");
  });

  it("redacts sensitive fields like passwords and API keys from log metadata", () => {
    logger.info("auth_attempt", {
      module: "auth",
      metadata: {
        username: "admin",
        password: "SuperSecretPassword123!",
        apiKey: "sk-live-abcdef123456",
        token: "bearer-token-value",
      },
    });

    expect(infoSpy).toHaveBeenCalledTimes(1);
    const raw = infoSpy.mock.calls[0]?.[0] as string;
    const parsed = JSON.parse(raw);

    expect(parsed.metadata.username).toBe("admin");
    expect(parsed.metadata.password).toBe("[REDACTED]");
    expect(parsed.metadata.apiKey).toBe("[REDACTED]");
    expect(parsed.metadata.token).toBe("[REDACTED]");
  });

  it("creates child loggers with persistent default context", () => {
    const child = logger.createChild({ module: "chat_module" });
    child.info("stream_chunk", { requestId: "req-abc" });

    expect(infoSpy).toHaveBeenCalledTimes(1);
    const parsed = JSON.parse(infoSpy.mock.calls[0]?.[0] as string);
    expect(parsed.module).toBe("chat_module");
    expect(parsed.requestId).toBe("req-abc");
  });
});
