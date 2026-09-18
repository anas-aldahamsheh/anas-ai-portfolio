import { describe, it, expect, vi, beforeEach } from "vitest";
import { FeatureFlagService } from "@/modules/admin/infrastructure/feature-flag-service";

describe("FeatureFlagService (F042)", () => {
  let service: FeatureFlagService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new FeatureFlagService();
    service.invalidateCache();
  });

  it("listFlags returns baseline flags when database query fails or returns empty", async () => {
    const flags = await service.listFlags();
    expect(flags.length).toBeGreaterThan(0);

    const keys = flags.map((f) => f.key);
    expect(keys).toContain("ai.query_rewriting");
    expect(keys).toContain("ai.reranker");
    expect(keys).toContain("security.rate_limiting");
    expect(keys).toContain("ui.inline_admin_edit");
  });

  it("getFlag retrieves a flag by its key", async () => {
    const flag = await service.getFlag("ai.query_rewriting");
    expect(flag).toBeDefined();
    expect(flag?.key).toBe("ai.query_rewriting");
    expect(flag?.category).toBe("ai");
  });

  it("isEnabled returns true for 100% rollout enabled flag", async () => {
    const isEnabled = await service.isEnabled("ai.query_rewriting");
    expect(isEnabled).toBe(true);
  });

  it("isEnabled returns false for disabled flag", async () => {
    const isEnabled = await service.isEnabled("experimental.voice_chat");
    expect(isEnabled).toBe(false);
  });

  it("isEnabled returns false for unknown non-existent flag", async () => {
    const isEnabled = await service.isEnabled("non.existent.flag");
    expect(isEnabled).toBe(false);
  });

  it("isEnabled evaluates canary rollout deterministically for different users", async () => {
    // Mock a 50% rollout flag
    vi.spyOn(service, "getFlag").mockResolvedValue({
      key: "test.canary",
      isEnabled: true,
      description: "Test canary",
      category: "experimental",
      targetRolloutPercentage: 50,
      updatedAt: new Date().toISOString(),
    });

    const userA = await service.isEnabled("test.canary", { userId: "user-alpha-123" });
    const userB = await service.isEnabled("test.canary", { userId: "user-beta-456" });
    expect(typeof userB).toBe("boolean");

    // Deterministic results: repeated calls with same user return same boolean
    const userA2 = await service.isEnabled("test.canary", { userId: "user-alpha-123" });
    expect(userA).toBe(userA2);
  });

  it("updateFlag updates flag in service and invalidates cache", async () => {
    const updated = await service.updateFlag(
      "ai.query_rewriting",
      {
        key: "ai.query_rewriting",
        isEnabled: false,
        targetRolloutPercentage: 0,
      },
      "admin-test-uuid",
    );

    expect(updated.isEnabled).toBe(false);
    expect(updated.targetRolloutPercentage).toBe(0);

    const retrieved = await service.getFlag("ai.query_rewriting");
    expect(retrieved?.isEnabled).toBe(false);
  });
});
