import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";
import { PromptService } from "@/ai/prompts/prompt-service";
import {
  extractVariables,
  interpolateTemplate,
  validateTemplateVariables,
} from "@/ai/prompts/prompt-template";
import { computePromptDiff } from "@/ai/prompts/prompt-diff";
import { PromptVersion } from "@/ai/contracts/prompt-registry";
import { db } from "@/lib/db/client";

// Mock db module
vi.mock("@/lib/db/client", () => ({
  db: {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockResolvedValue([]),
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
          orderBy: vi.fn().mockResolvedValue([]),
        }),
        limit: vi.fn().mockResolvedValue([]),
      }),
    }),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([]),
      }),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]),
        }),
      }),
    }),
    delete: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue([]),
    }),
  },
}));

// Mock logger
vi.mock("@/lib/observability/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

describe("Prompt Registry & Versioning (F021)", () => {
  let service: PromptService;
  const mockSelect = db.select as unknown as Mock;
  const mockInsert = db.insert as unknown as Mock;
  const mockUpdate = db.update as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new PromptService();
  });

  describe("Variable Extraction & Template Interpolation", () => {
    it("extracts double-brace {{var}} and single-brace {var} placeholders correctly", () => {
      const template =
        "Hello {{name}}, your role is {role}. Please reply in {{response_language}} using {{name}}.";
      const vars = extractVariables(template);
      expect(vars).toEqual(["name", "response_language", "role"]);
    });

    it("handles empty or null templates gracefully", () => {
      expect(extractVariables("")).toEqual([]);
      expect(extractVariables(null)).toEqual([]);
      expect(extractVariables(undefined)).toEqual([]);
    });

    it("interpolates variables properly and tracks missing variables", () => {
      const template =
        "Answer in {{response_language}} about project {{project_name}} for {{user}}.";
      const { rendered, missingVariables } = interpolateTemplate(template, {
        response_language: "Arabic",
        project_name: "Anas Portfolio",
      });

      expect(rendered).toBe("Answer in Arabic about project Anas Portfolio for {{user}}.");
      expect(missingVariables).toEqual(["user"]);
    });

    it("validates that all required variables are present", () => {
      const template = "{{greeting}} {{name}}!";
      const valid = validateTemplateVariables(template, { greeting: "Hi", name: "Anas" });
      expect(valid.isValid).toBe(true);
      expect(valid.missingVariables).toEqual([]);

      const invalid = validateTemplateVariables(template, { greeting: "Hi" });
      expect(invalid.isValid).toBe(false);
      expect(invalid.missingVariables).toEqual(["name"]);
    });
  });

  describe("Baseline Prompt Fallbacks", () => {
    it("returns all 7 baseline prompts when database returns empty rows", async () => {
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue([]),
        }),
      });

      const summaries = await service.listPrompts();
      expect(summaries.length).toBeGreaterThanOrEqual(7);

      const slugs = summaries.map((s) => s.slug);
      expect(slugs).toContain("chat_system");
      expect(slugs).toContain("query_router");
      expect(slugs).toContain("query_rewriter");
      expect(slugs).toContain("job_fit");
      expect(slugs).toContain("evaluator");
      expect(slugs).toContain("conversation_mode");
      expect(slugs).toContain("summarizer");

      const chatPrompt = summaries.find((s) => s.slug === "chat_system");
      expect(chatPrompt?.activeVersionNumber).toBe(1);
    });

    it("retrieves baseline prompt details for chat_system with full version details", async () => {
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      const detail = await service.getPromptBySlug("chat_system");
      expect(detail).not.toBeNull();
      expect(detail?.slug).toBe("chat_system");
      expect(detail?.activeVersionNumber).toBe(1);
      expect(detail?.activeVersion).toBeDefined();
      expect(detail?.activeVersion?.systemPrompt).toContain("EVIDENCE GROUNDING");
      expect(detail?.activeVersion?.variables).toContain("context_chunks");
      expect(detail?.activeVersion?.variables).toContain("citation_catalog");
    });
  });

  describe("Active Prompt Resolution & Rendering", () => {
    it("resolves active prompt and interpolates variables safely", async () => {
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      const result = await service.renderPrompt("conversation_mode", {
        mode: "Technical",
        tone_guidelines: "In-depth architecture details",
        focus_areas: "Distributed systems, RAG",
      });

      expect(result.systemPrompt).toContain("Active Mode: Technical");
      expect(result.systemPrompt).toContain("Tone Guidelines:\nIn-depth architecture details");
      expect(result.systemPrompt).toContain("Focus Areas:\nDistributed systems, RAG");
      expect(result.userPrompt).toContain("Mode: Technical");
      expect(result.missingVariables).toEqual([]);
      expect(result.versionNumber).toBe(1);
    });

    it("reports missing variables when required placeholders are omitted", async () => {
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      const result = await service.renderPrompt("conversation_mode", {
        mode: "Recruiter",
      });

      expect(result.systemPrompt).toContain("Active Mode: Recruiter");
      expect(result.missingVariables).toContain("focus_areas");
      expect(result.missingVariables).toContain("tone_guidelines");
    });

    it("throws an error when prompt slug does not exist", async () => {
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      await expect(service.renderPrompt("non_existent_slug", {})).rejects.toThrow(
        "not found in registry",
      );
    });
  });

  describe("Dry-run Prompt Testing", () => {
    it("tests prompt template variables substitution without saving to DB", () => {
      const testResult = service.testPrompt({
        systemPrompt: "You are an assistant for {{user_name}} speaking {{lang}}.",
        userTemplate: "Question: {{question}}",
        variables: {
          user_name: "Ahmed",
          lang: "Arabic",
          question: "How does RAG work?",
        },
      });

      expect(testResult.success).toBe(true);
      expect(testResult.renderedSystemPrompt).toBe(
        "You are an assistant for Ahmed speaking Arabic.",
      );
      expect(testResult.renderedUserPrompt).toBe("Question: How does RAG work?");
      expect(testResult.missingVariables).toEqual([]);
    });

    it("flags missing variables in dry-run test", () => {
      const testResult = service.testPrompt({
        systemPrompt: "System: {{required_var}} and {{other_var}}",
        variables: {
          required_var: "Present",
        },
      });

      expect(testResult.success).toBe(false);
      expect(testResult.missingVariables).toEqual(["other_var"]);
      expect(testResult.errors).toBeDefined();
    });
  });

  describe("Version Diffing", () => {
    it("computes structural differences between two versions", () => {
      const v1: PromptVersion = {
        id: "v1",
        promptId: "p1",
        versionNumber: 1,
        systemPrompt: "Answer from {{context}}.",
        userTemplate: "{{query}}",
        isActive: false,
        changelog: "v1",
        variables: ["context", "query"],
        createdAt: new Date("2026-01-01"),
      };

      const v2: PromptVersion = {
        id: "v2",
        promptId: "p1",
        versionNumber: 2,
        systemPrompt: "Answer from {{context}} with {{citations}}.",
        userTemplate: "{{query}} in {{lang}}",
        isActive: true,
        changelog: "v2 with citations and lang",
        variables: ["citations", "context", "lang", "query"],
        createdAt: new Date("2026-01-02"),
      };

      const diff = computePromptDiff("chat_system", v1, v2);

      expect(diff.promptSlug).toBe("chat_system");
      expect(diff.v1Number).toBe(1);
      expect(diff.v2Number).toBe(2);
      expect(diff.systemPromptChanged).toBe(true);
      expect(diff.userTemplateChanged).toBe(true);
      expect(diff.addedVariables).toContain("citations");
      expect(diff.addedVariables).toContain("lang");
      expect(diff.removedVariables).toEqual([]);
    });
  });

  describe("Version Creation, Rollback & Audit Logging", () => {
    it("creates a new version, auto-increments version number, and records audit event", async () => {
      // 1. Existing prompt mock
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ id: "prompt-uuid-1", slug: "chat_system" }]),
          }),
        }),
      });

      // 2. Existing versions mock
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockResolvedValue([{ versionNumber: 1 }, { versionNumber: 2 }]),
          }),
        }),
      });

      // 3. Update existing versions to isActive=false
      mockUpdate.mockReturnValueOnce({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue({}),
        }),
      });

      // 4. Insert new version
      mockInsert.mockReturnValueOnce({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([
            {
              id: "ver-uuid-3",
              promptId: "prompt-uuid-1",
              versionNumber: 3,
              systemPrompt: "New system prompt v3 {{context_chunks}}",
              userTemplate: null,
              isActive: true,
              changelog: "Added v3 prompt",
              createdAt: new Date(),
            },
          ]),
        }),
      });

      // 5. Insert audit event
      mockInsert.mockReturnValueOnce({
        values: vi.fn().mockResolvedValue({}),
      });

      const newVer = await service.createVersion(
        "chat_system",
        {
          systemPrompt: "New system prompt v3 {{context_chunks}}",
          changelog: "Added v3 prompt",
          makeActive: true,
        },
        "admin-user-uuid",
      );

      expect(newVer.versionNumber).toBe(3);
      expect(newVer.isActive).toBe(true);
      expect(newVer.variables).toEqual(["context_chunks"]);
      expect(db.insert).toHaveBeenCalledTimes(2); // New version + audit event
    });

    it("rolls back to an existing version, sets it active, and records audit event", async () => {
      // Mock prompt lookup
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ id: "prompt-uuid-1", slug: "chat_system" }]),
          }),
        }),
      });

      // Mock target version lookup
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                id: "ver-uuid-1",
                promptId: "prompt-uuid-1",
                versionNumber: 1,
                systemPrompt: "Original system prompt v1",
                userTemplate: null,
                isActive: false,
                changelog: "Initial",
                createdAt: new Date(),
              },
            ]),
          }),
        }),
      });

      // Mock deactivating all versions
      mockUpdate.mockReturnValueOnce({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue({}),
        }),
      });

      // Mock activating target version
      mockUpdate.mockReturnValueOnce({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([
              {
                id: "ver-uuid-1",
                promptId: "prompt-uuid-1",
                versionNumber: 1,
                systemPrompt: "Original system prompt v1",
                userTemplate: null,
                isActive: true,
                changelog: "Initial",
                createdAt: new Date(),
              },
            ]),
          }),
        }),
      });

      // Mock audit log insert
      mockInsert.mockReturnValueOnce({
        values: vi.fn().mockResolvedValue({}),
      });

      const rolledBack = await service.rollbackToVersion("chat_system", 1, "admin-user-uuid");
      expect(rolledBack.versionNumber).toBe(1);
      expect(rolledBack.isActive).toBe(true);
      expect(db.update).toHaveBeenCalledTimes(2); // Deactivate old + activate target
      expect(db.insert).toHaveBeenCalledTimes(1); // Audit event
    });
  });
});
