import { describe, it, expect, vi, beforeEach } from "vitest";
import { ConversationModeService } from "@/ai/modes/conversation-mode-service";
import { BASELINE_CONVERSATION_MODES } from "@/ai/modes/baseline-modes";
import { db } from "@/lib/db/client";

describe("ConversationModeService (F032)", () => {
  let service: ConversationModeService;

  beforeEach(() => {
    service = new ConversationModeService();
    vi.restoreAllMocks();
  });

  it("returns baseline modes when database is empty or returns 0 rows", async () => {
    vi.spyOn(db, "select").mockReturnValue({
      from: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockResolvedValue([]),
      }),
    } as unknown as ReturnType<typeof db.select>);

    const configs = await service.getAllConfigs();
    expect(configs).toHaveLength(BASELINE_CONVERSATION_MODES.length);
    expect(configs[0]?.slug).toBe("general");
    expect(configs[1]?.slug).toBe("recruiter");
    expect(configs[2]?.slug).toBe("technical");
  });

  it("handles database query failures gracefully by falling back to baseline modes", async () => {
    vi.spyOn(db, "select").mockReturnValue({
      from: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockRejectedValue(new Error("Connection terminated")),
      }),
    } as unknown as ReturnType<typeof db.select>);

    const configs = await service.getAllConfigs();
    expect(configs).toHaveLength(3);
    expect(configs.map((c) => c.slug)).toEqual(["general", "recruiter", "technical"]);
  });

  it("returns localized modes for English and Arabic", async () => {
    vi.spyOn(db, "select").mockReturnValue({
      from: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockResolvedValue([]),
      }),
    } as unknown as ReturnType<typeof db.select>);

    const enModes = await service.listModes("en");
    expect(enModes[0]?.name).toBe("General");
    expect(enModes[1]?.name).toBe("Recruiter");
    expect(enModes[2]?.name).toBe("Technical");

    service.clearCache();
    const arModes = await service.listModes("ar");
    expect(arModes[0]?.name).toBe("عام");
    expect(arModes[1]?.name).toBe("مسؤول توظيف");
    expect(arModes[2]?.name).toBe("تقني متعمق");
    expect(arModes[0]?.description).toContain("شرح متوازن");
  });

  it("retrieves mode configuration by slug", async () => {
    vi.spyOn(db, "select").mockReturnValue({
      from: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockResolvedValue([]),
      }),
    } as unknown as ReturnType<typeof db.select>);

    const recruiter = await service.getModeBySlug("recruiter");
    expect(recruiter).not.toBeNull();
    expect(recruiter?.slug).toBe("recruiter");
    expect(recruiter?.toneGuidelines).toContain("Direct");

    const nonExistent = await service.getModeBySlug("non_existent_mode");
    expect(nonExistent).toBeNull();
  });

  describe("verifyMode", () => {
    it("returns requested mode if enabled and published", async () => {
      vi.spyOn(db, "select").mockReturnValue({
        from: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue([]),
        }),
      } as unknown as ReturnType<typeof db.select>);

      const verified = await service.verifyMode("technical");
      expect(verified).toBe("technical");
    });

    it("falls back to general when mode is undefined, null, or empty string", async () => {
      vi.spyOn(db, "select").mockReturnValue({
        from: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue([]),
        }),
      } as unknown as ReturnType<typeof db.select>);

      expect(await service.verifyMode(undefined)).toBe("general");
      expect(await service.verifyMode(null)).toBe("general");
      expect(await service.verifyMode("")).toBe("general");
    });

    it("falls back to general when an invalid or unknown mode string is provided", async () => {
      vi.spyOn(db, "select").mockReturnValue({
        from: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue([]),
        }),
      } as unknown as ReturnType<typeof db.select>);

      const verified = await service.verifyMode("hacker_mode" as unknown as string);
      expect(verified).toBe("general");
    });

    it("falls back to general if the mode exists but is disabled or unpublished", async () => {
      vi.spyOn(db, "select").mockReturnValue({
        from: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue([
            {
              id: "m-gen",
              slug: "general",
              nameEn: "General",
              nameAr: "عام",
              descriptionEn: "desc",
              descriptionAr: "desc",
              toneGuidelines: "tone",
              focusAreas: "focus",
              promptSlug: "chat_system",
              isEnabled: true,
              isPublished: true,
              sortOrder: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: "m-rec",
              slug: "recruiter",
              nameEn: "Recruiter",
              nameAr: "مسؤول توظيف",
              descriptionEn: "desc",
              descriptionAr: "desc",
              toneGuidelines: "tone",
              focusAreas: "focus",
              promptSlug: "chat_system",
              isEnabled: false, // Disabled!
              isPublished: true,
              sortOrder: 2,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ]),
        }),
      } as unknown as ReturnType<typeof db.select>);

      const verified = await service.verifyMode("recruiter");
      expect(verified).toBe("general");
    });
  });

  describe("updateMode", () => {
    it("updates mode configuration and invalidates cache", async () => {
      vi.spyOn(db, "select").mockReturnValue({
        from: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue([]),
        }),
      } as unknown as ReturnType<typeof db.select>);

      const updateSpy = vi.spyOn(db, "update").mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([
              {
                id: "mode-technical",
                slug: "technical",
                nameEn: "Advanced Technical",
                nameAr: "تقني متقدم",
                descriptionEn: "Updated description",
                descriptionAr: "وصف محدث",
                toneGuidelines: "Deep engineering focus",
                focusAreas: "Architecture",
                promptSlug: "chat_system",
                isEnabled: true,
                isPublished: true,
                sortOrder: 3,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ]),
          }),
        }),
      } as unknown as ReturnType<typeof db.update>);

      const insertSpy = vi.spyOn(db, "insert").mockReturnValue({
        values: vi.fn().mockResolvedValue({}),
      } as unknown as ReturnType<typeof db.insert>);

      const result = await service.updateMode(
        "mode-technical",
        {
          nameEn: "Advanced Technical",
          toneGuidelines: "Deep engineering focus",
        },
        "admin-user-123",
      );

      expect(result.nameEn).toBe("Advanced Technical");
      expect(result.toneGuidelines).toBe("Deep engineering focus");
      expect(updateSpy).toHaveBeenCalled();
      expect(insertSpy).toHaveBeenCalled();
    });

    it("throws an error when attempting to update non-existent mode ID", async () => {
      vi.spyOn(db, "select").mockReturnValue({
        from: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue([]),
        }),
      } as unknown as ReturnType<typeof db.select>);

      await expect(service.updateMode("unknown-id", { nameEn: "Test" }, "admin-1")).rejects.toThrow(
        'Conversation mode with ID "unknown-id" not found',
      );
    });
  });
});
