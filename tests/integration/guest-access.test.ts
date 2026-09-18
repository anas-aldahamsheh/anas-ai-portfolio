import { describe, it, expect } from "vitest";
import { resolveRequestContext } from "@/modules/auth/infrastructure/request-context";
import {
  PUBLIC_FEATURES,
  canAccessFeature,
  assertPublicFeature,
} from "@/modules/auth/domain/access-policy";
import { GET as healthGet } from "@/app/api/health/route";
import { GET as readinessGet } from "@/app/api/readiness/route";
import { GET as adminGuardGet } from "@/app/api/admin/guard-check/route";

describe("Guest-First Public Access Integration (F005)", () => {
  it("allows a simulated fresh private browser window to resolve GUEST context seamlessly", async () => {
    // Fresh guest request: no session cookies, no auth headers
    const guestHeaders = new Headers({
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "accept-language": "ar,en;q=0.9",
    });

    const context = await resolveRequestContext(guestHeaders);

    expect(context.isAuthenticated).toBe(false);
    expect(context.isGuest).toBe(true);
    expect(context.role).toBe("GUEST");
    expect(context.user).toBeNull();
    expect(context.session).toBeNull();
  });

  it("verifies public endpoints (/api/health, /api/readiness) are 100% accessible to unauthenticated guests", async () => {
    const healthRes = await healthGet();
    expect(healthRes.status).toBe(200);
    const healthBody = await healthRes.json();
    expect(healthBody.status).toBe("healthy");

    const readinessRes = await readinessGet();
    expect(readinessRes.status).toBe(200);
    const readinessBody = await readinessRes.json();
    expect(["ready", "degraded"]).toContain(readinessBody.status);
  });

  it("enforces that while public services are accessible to guests, admin endpoints remain strictly protected (401)", async () => {
    const adminRes = await adminGuardGet();
    expect(adminRes.status).toBe(401);
  });

  it("asserts that all 12 public capabilities from 01_GUEST_ACCESS.md are unlocked for GUEST", async () => {
    const guestContext = await resolveRequestContext(new Headers());

    for (const feature of PUBLIC_FEATURES) {
      assertPublicFeature(feature);
      expect(canAccessFeature(guestContext.role, feature)).toBe(true);
    }
  });
});
