import { describe, it, expect } from "vitest";
import { GET as healthGet } from "@/app/api/health/route";
import { GET as readinessGet } from "@/app/api/readiness/route";
import { GET as metricsGet } from "@/app/api/metrics/route";
import { GET as adminContentPagesGet } from "@/app/api/admin/content/pages/route";
import { runDeploymentVerification } from "../../scripts/verify-deployment";
import { NextRequest } from "next/server";

describe("Production Smoke Verification Suite (F050)", () => {
  it("verifies /api/health returns HTTP 200 with healthy status and process metrics", async () => {
    const response = await healthGet();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.status).toBe("healthy");
    expect(data.timestamp).toBeDefined();
    expect(data.uptimeSeconds).toBeTypeOf("number");
    expect(data.memory).toBeDefined();
    expect(data.memory.rssMb).toBeGreaterThan(0);
  });

  it("verifies /api/readiness returns HTTP 200 with operational subsystem checks", async () => {
    const response = await readinessGet();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(["ready", "degraded"]).toContain(data.status);
    expect(data.checks).toBeDefined();
    expect(data.checks.database).toBeDefined();
    expect(data.checks.vectorStore).toBeDefined();
    expect(data.checks.cache).toBeDefined();
    expect(data.checks.configuration).toBeDefined();
  });

  it("verifies /api/metrics exposes Prometheus metrics with text/plain content type", async () => {
    const response = await metricsGet();
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/plain");

    const text = await response.text();
    expect(text).toContain("# HELP http_requests_total");
    expect(text).toContain("# TYPE http_requests_total counter");
    expect(text).toContain("nodejs_uptime_seconds");
  });

  it("verifies admin control plane endpoints strictly reject unauthenticated requests (401)", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/content/pages", {
      headers: new Headers(),
    });
    const response = await adminContentPagesGet(req);
    expect(response.status).toBe(401);

    const body = await response.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("executes automated deployment verification script with 100% checks passing", async () => {
    const report = await runDeploymentVerification();
    expect(report.success).toBe(true);
    expect(report.totalChecks).toBeGreaterThanOrEqual(5);
    expect(report.passedChecks).toBe(report.totalChecks);
  });
});
