import { describe, it, expect } from "vitest";
import { healthService } from "@/lib/health/health-service";

describe("HealthService (F046)", () => {
  it("getLiveness returns healthy status, uptime, and memory metrics", () => {
    const liveness = healthService.getLiveness();

    expect(liveness.status).toBe("healthy");
    expect(typeof liveness.uptimeSeconds).toBe("number");
    expect(liveness.uptimeSeconds).toBeGreaterThanOrEqual(0);
    expect(liveness.memory.rssMb).toBeGreaterThan(0);
    expect(liveness.memory.heapUsedMb).toBeGreaterThan(0);
  });

  it("getReadiness aggregates database, vector store, cache, and configuration checks", async () => {
    const readiness = await healthService.getReadiness();

    expect(["ready", "degraded", "unready"]).toContain(readiness.status);
    expect(readiness.checks.cache.status).toBe("up");
    expect(["valid", "down"]).toContain(readiness.checks.configuration.status);
    expect(["up", "degraded"]).toContain(readiness.checks.database.status);
    expect(["up", "fallback"]).toContain(readiness.checks.vectorStore.status);
  });

  it("sanitizes potential database credentials or tokens from check errors", async () => {
    const readiness = await healthService.getReadiness();

    for (const check of Object.values(readiness.checks)) {
      if (check.error) {
        expect(check.error).not.toMatch(/postgres:\/\/[^:]+:[^@]+@/);
        expect(check.error).not.toMatch(/bearer\s+[a-z0-9._-]+/i);
      }
    }
  });
});
