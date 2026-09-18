import { describe, it, expect, vi, beforeEach } from "vitest";
import { socialProfileUpdateSchema } from "@/modules/social/domain/types";
import {
  SocialService,
  BASELINE_GITHUB_PROFILE,
} from "@/modules/social/infrastructure/social-service";

// Mock database operations
vi.mock("@/lib/db/client", () => ({
  db: {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        leftJoin: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockResolvedValue([]),
          }),
        }),
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    }),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: "social-new-1" }]),
      }),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue({}),
      }),
    }),
  },
}));

describe("Social Profile Domain & Service (F015)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Validation Schema (socialProfileUpdateSchema)", () => {
    it("validates well-formed social profile update", () => {
      const input = {
        url: "https://github.com/anas-ai-engineer",
        handle: "anas-ai-engineer",
        displayName: "GitHub",
        description: "AI engineer portfolio",
        isVisible: true,
      };

      const result = socialProfileUpdateSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("rejects invalid URL", () => {
      const input = {
        url: "not-a-url",
        handle: "anas",
        displayName: "GitHub",
      };

      const result = socialProfileUpdateSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("rejects missing handle", () => {
      const input = {
        url: "https://github.com/anas",
        handle: "",
        displayName: "GitHub",
      };

      const result = socialProfileUpdateSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe("SocialService Operations", () => {
    const service = new SocialService();

    it("returns baseline GitHub profile when database is unseeded", async () => {
      service.invalidateCache();
      const profile = await service.getProfile("github", "en");

      expect(profile).toBeDefined();
      expect(profile.platform).toBe("github");
      expect(profile.handle).toBe(BASELINE_GITHUB_PROFILE.handle);
      expect(profile.url).toBe(BASELINE_GITHUB_PROFILE.url);
      expect(profile.isVisible).toBe(true);
    });

    it("caches profiles in memory across multiple calls", async () => {
      const list1 = await service.listProfiles("en");
      const list2 = await service.listProfiles("en");
      expect(list1).toBe(list2);
    });

    it("clears cache when invalidateCache is called", async () => {
      const list1 = await service.listProfiles("en");
      service.invalidateCache();
      const list2 = await service.listProfiles("en");
      // New instance created after cache clear
      expect(list1).not.toBe(list2);
    });

    it("persists updated profile and clears cache", async () => {
      const updated = await service.updateProfile(
        "github",
        {
          url: "https://github.com/updated-anas",
          handle: "updated-anas",
          displayName: "GitHub Main",
          description: "Updated bio",
          isVisible: true,
        },
        "admin-user-1",
        "en",
      );

      expect(updated).toBeDefined();
      expect(updated.handle).toBe("updated-anas");
      expect(updated.url).toBe("https://github.com/updated-anas");
    });
  });
});
