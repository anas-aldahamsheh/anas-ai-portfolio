import { describe, it, expect } from "vitest";
import {
  PUBLIC_FEATURES,
  ADMIN_ONLY_FEATURES,
  canAccessFeature,
  isPublicFeature,
  assertPublicFeature,
  type PublicFeature,
  type AdminOnlyFeature,
} from "@/modules/auth/domain/access-policy";

describe("Access Policy & Guest Permissions (domain/access-policy.ts)", () => {
  it("includes all required public capabilities from 01_GUEST_ACCESS.md", () => {
    const requiredSpecs = [
      "PAGES",
      "PROJECTS",
      "DEEP_DIVES",
      "CV_VIEW",
      "CV_DOWNLOAD",
      "AI_CHAT",
      "CONVERSATION_MODE",
      "PROJECT_SCOPED_AI",
      "JOB_FIT_ANALYZER",
      "AI_LAB_DEMOS",
      "EVALUATION_DASHBOARD",
      "SOCIAL_ACTIONS",
    ] as const;

    for (const spec of requiredSpecs) {
      expect(PUBLIC_FEATURES).toContain(spec);
      expect(isPublicFeature(spec)).toBe(true);
    }
  });

  it("permits unauthenticated GUEST access to every public feature", () => {
    for (const feature of PUBLIC_FEATURES) {
      expect(canAccessFeature("GUEST", feature)).toBe(true);
      expect(canAccessFeature(null, feature)).toBe(true);
      expect(canAccessFeature(undefined, feature)).toBe(true);
    }
  });

  it("permits authenticated USER and ADMIN access to all public features without unlocking gated content", () => {
    for (const feature of PUBLIC_FEATURES) {
      expect(canAccessFeature("USER", feature)).toBe(true);
      expect(canAccessFeature("ADMIN", feature)).toBe(true);
    }
  });

  it("strictly restricts admin-only capabilities from GUEST and regular USER", () => {
    for (const adminFeature of ADMIN_ONLY_FEATURES) {
      expect(canAccessFeature("GUEST", adminFeature)).toBe(false);
      expect(canAccessFeature(null, adminFeature)).toBe(false);
      expect(canAccessFeature(undefined, adminFeature)).toBe(false);
      expect(canAccessFeature("USER", adminFeature)).toBe(false);
      expect(canAccessFeature("ADMIN", adminFeature)).toBe(true);
    }
  });

  it("assertPublicFeature throws error when non-public feature is asserted", () => {
    expect(() => assertPublicFeature("PAGES" as PublicFeature)).not.toThrow();
    expect(() => assertPublicFeature("CV_DOWNLOAD" as PublicFeature)).not.toThrow();
    expect(() => assertPublicFeature("ADMIN_DASHBOARD" as AdminOnlyFeature)).toThrow(
      /Access policy violation/,
    );
  });
});
