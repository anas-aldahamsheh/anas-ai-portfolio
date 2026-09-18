import { describe, it, expect, beforeEach } from "vitest";
import { navigationService } from "@/modules/navigation/infrastructure/navigation-service";
import { isNavigationItemVisible, type NavigationItem } from "@/modules/navigation/domain/types";

describe("Navigation Service & Domain Logic (F011)", () => {
  beforeEach(() => {
    navigationService.invalidateCache();
  });

  it("retrieves default navigation items for header sorted by orderIndex", async () => {
    const items = await navigationService.getNavigationItems("header", "GUEST");

    expect(items.length).toBeGreaterThan(0);
    // Ensure all items are sorted ascending
    for (let i = 0; i < items.length - 1; i++) {
      expect(items[i]!.orderIndex).toBeLessThanOrEqual(items[i + 1]!.orderIndex);
    }
    // All items should have isVisible === true
    expect(items.every((item) => item.isVisible)).toBe(true);
  });

  it("retrieves footer navigation items excluding header-only items", async () => {
    const footerItems = await navigationService.getNavigationItems("footer", "GUEST");

    expect(footerItems.length).toBeGreaterThan(0);
    expect(
      footerItems.every((item) => item.placement === "footer" || item.placement === "both"),
    ).toBe(true);
  });

  describe("isNavigationItemVisible", () => {
    const baseItem: NavigationItem = {
      id: "test-item",
      destinationType: "internal",
      target: "/test",
      labelKey: "nav.test",
      orderIndex: 1,
      isVisible: true,
      openInNewTab: false,
      authVisibility: "all",
      placement: "both",
    };

    it("returns false if isVisible is false", () => {
      expect(isNavigationItemVisible({ ...baseItem, isVisible: false }, "header")).toBe(false);
    });

    it("respects placement rules", () => {
      expect(isNavigationItemVisible({ ...baseItem, placement: "header" }, "header")).toBe(true);
      expect(isNavigationItemVisible({ ...baseItem, placement: "header" }, "footer")).toBe(false);
      expect(isNavigationItemVisible({ ...baseItem, placement: "footer" }, "footer")).toBe(true);
      expect(isNavigationItemVisible({ ...baseItem, placement: "footer" }, "header")).toBe(false);
      expect(isNavigationItemVisible({ ...baseItem, placement: "both" }, "header")).toBe(true);
      expect(isNavigationItemVisible({ ...baseItem, placement: "both" }, "footer")).toBe(true);
    });

    it("respects authVisibility rules", () => {
      const guestOnly: NavigationItem = { ...baseItem, authVisibility: "guests_only" };
      expect(isNavigationItemVisible(guestOnly, "header", "GUEST")).toBe(true);
      expect(isNavigationItemVisible(guestOnly, "header", "USER")).toBe(false);
      expect(isNavigationItemVisible(guestOnly, "header", "ADMIN")).toBe(false);

      const adminOnly: NavigationItem = { ...baseItem, authVisibility: "admin_only" };
      expect(isNavigationItemVisible(adminOnly, "header", "GUEST")).toBe(false);
      expect(isNavigationItemVisible(adminOnly, "header", "USER")).toBe(false);
      expect(isNavigationItemVisible(adminOnly, "header", "ADMIN")).toBe(true);

      const authOnly: NavigationItem = { ...baseItem, authVisibility: "authenticated_only" };
      expect(isNavigationItemVisible(authOnly, "header", "GUEST")).toBe(false);
      expect(isNavigationItemVisible(authOnly, "header", "USER")).toBe(true);
      expect(isNavigationItemVisible(authOnly, "header", "ADMIN")).toBe(true);
    });
  });

  it("caches items in memory and honors cache invalidation", async () => {
    const firstCall = await navigationService.getAllItems();
    const secondCall = await navigationService.getAllItems();

    expect(firstCall).toBe(secondCall); // Reference equality from cache

    navigationService.invalidateCache();
    const thirdCall = await navigationService.getAllItems();
    expect(thirdCall).toEqual(firstCall);
  });
});
