import { describe, it, expect } from "vitest";
import { GET as healthGet } from "@/app/api/health/route";
import { GET as readinessGet } from "@/app/api/readiness/route";

describe("Health & Readiness Endpoints (F046)", () => {
  it("GET /api/health returns HTTP 200 with healthy status and metadata", async () => {
    const response = await healthGet();
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.status).toBe("healthy");
    expect(body.timestamp).toBeDefined();
    expect(body.uptime).toBeTypeOf("number");
    expect(body.environment).toBeDefined();
  });

  it("GET /api/readiness returns HTTP 200 with ready status when config is valid", async () => {
    const response = await readinessGet();
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(["ready", "degraded"]).toContain(body.status);
    expect(body.timestamp).toBeDefined();
  });
});
