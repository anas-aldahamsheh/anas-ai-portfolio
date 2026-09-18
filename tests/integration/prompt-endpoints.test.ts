import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET as getPrompts, POST as createPrompt } from "@/app/api/admin/prompts/route";
import {
  GET as getPromptDetail,
  POST as createPromptVersion,
} from "@/app/api/admin/prompts/[slug]/route";
import { POST as rollbackPrompt } from "@/app/api/admin/prompts/[slug]/rollback/route";
import { GET as comparePrompts } from "@/app/api/admin/prompts/[slug]/compare/route";
import { POST as testPrompt } from "@/app/api/admin/prompts/test/route";
import { promptService } from "@/ai/prompts";
import * as serverAuth from "@/modules/auth/infrastructure/server-auth";
import type {
  PromptSummary,
  PromptDetail,
  PromptVersion,
  PromptDiff,
  PromptTestResult,
} from "@/ai/contracts/prompt-registry";

vi.mock("@/ai/prompts", () => ({
  promptService: {
    listPrompts: vi.fn(),
    getPromptBySlug: vi.fn(),
    createVersion: vi.fn(),
    rollbackToVersion: vi.fn(),
    compareVersions: vi.fn(),
    testPrompt: vi.fn(),
  },
}));

describe("Prompt Registry Admin API Endpoints (F021)", () => {
  const adminHeaders = new Headers({
    authorization: "Bearer admin-token",
  });

  const adminAuthContext: serverAuth.AuthenticatedContext = {
    user: {
      id: "admin-user-uuid",
      email: "admin@example.com",
      name: "Admin",
    },
    role: "ADMIN",
    session: {
      id: "sess-1",
      userId: "admin-user-uuid",
      token: "tok",
      expiresAt: new Date(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Security Barriers (requireAdmin)", () => {
    it("returns 401 Unauthorized when no credentials provided", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockRejectedValueOnce(
        new serverAuth.UnauthorizedError(),
      );

      const req = new NextRequest("http://localhost/api/admin/prompts");
      const res = await getPrompts(req);

      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error).toBe("Unauthorized");
    });

    it("returns 403 Forbidden when authenticated as non-admin user", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockRejectedValueOnce(new serverAuth.ForbiddenError());

      const req = new NextRequest("http://localhost/api/admin/prompts", {
        headers: adminHeaders,
      });
      const res = await getPrompts(req);

      expect(res.status).toBe(403);
      const json = await res.json();
      expect(json.error).toContain("Forbidden");
    });
  });

  describe("GET /api/admin/prompts", () => {
    it("returns list of prompts for admin user", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValueOnce(adminAuthContext);
      const mockList: PromptSummary[] = [
        {
          id: "p1",
          slug: "chat_system",
          role: "chat_system",
          name: "Chat Policy",
          description: "Grounded chat",
          activeVersionNumber: 1,
          activeVersionId: "v1",
          totalVersions: 1,
          updatedAt: new Date("2026-01-01"),
        },
      ];
      vi.mocked(promptService.listPrompts).mockResolvedValueOnce(mockList);

      const req = new NextRequest("http://localhost/api/admin/prompts", {
        headers: adminHeaders,
      });
      const res = await getPrompts(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.prompts).toHaveLength(1);
      expect(json.prompts[0].slug).toBe("chat_system");
    });

    it("creates a new prompt version via POST /api/admin/prompts", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValueOnce(adminAuthContext);
      const mockCreated: PromptVersion = {
        id: "v1",
        promptId: "p1",
        versionNumber: 1,
        systemPrompt: "New system prompt",
        userTemplate: null,
        isActive: true,
        changelog: null,
        variables: [],
        createdAt: new Date("2026-01-01"),
      };
      vi.mocked(promptService.createVersion).mockResolvedValueOnce(mockCreated);

      const req = new NextRequest("http://localhost/api/admin/prompts", {
        method: "POST",
        headers: adminHeaders,
        body: JSON.stringify({
          slug: "custom_prompt",
          systemPrompt: "New system prompt",
          makeActive: true,
        }),
      });

      const res = await createPrompt(req);
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.version.versionNumber).toBe(1);
    });
  });

  describe("GET & POST /api/admin/prompts/[slug]", () => {
    it("returns 404 if prompt slug is not found", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValueOnce(adminAuthContext);
      vi.mocked(promptService.getPromptBySlug).mockResolvedValueOnce(null);

      const req = new NextRequest("http://localhost/api/admin/prompts/unknown_slug", {
        headers: adminHeaders,
      });
      const res = await getPromptDetail(req, {
        params: Promise.resolve({ slug: "unknown_slug" }),
      });

      expect(res.status).toBe(404);
    });

    it("returns prompt details and versions when found", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValueOnce(adminAuthContext);
      const mockDetail: PromptDetail = {
        id: "p1",
        slug: "chat_system",
        role: "chat_system",
        name: "Chat System",
        description: null,
        activeVersionNumber: 1,
        activeVersionId: "v1",
        totalVersions: 1,
        updatedAt: new Date("2026-01-01"),
        activeVersion: {
          id: "v1",
          promptId: "p1",
          versionNumber: 1,
          systemPrompt: "System instruction",
          userTemplate: null,
          isActive: true,
          changelog: null,
          variables: [],
          createdAt: new Date("2026-01-01"),
        },
        versions: [
          {
            id: "v1",
            promptId: "p1",
            versionNumber: 1,
            systemPrompt: "System instruction",
            userTemplate: null,
            isActive: true,
            changelog: null,
            variables: [],
            createdAt: new Date("2026-01-01"),
          },
        ],
      };
      vi.mocked(promptService.getPromptBySlug).mockResolvedValueOnce(mockDetail);

      const req = new NextRequest("http://localhost/api/admin/prompts/chat_system", {
        headers: adminHeaders,
      });
      const res = await getPromptDetail(req, {
        params: Promise.resolve({ slug: "chat_system" }),
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.prompt.slug).toBe("chat_system");
      expect(json.prompt.versions).toHaveLength(1);
    });

    it("creates a new version for prompt and returns 201", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValueOnce(adminAuthContext);
      const mockCreated: PromptVersion = {
        id: "v2",
        promptId: "p1",
        versionNumber: 2,
        systemPrompt: "Updated prompt v2",
        userTemplate: null,
        isActive: true,
        changelog: "Upgraded safety guidelines",
        variables: [],
        createdAt: new Date("2026-01-02"),
      };
      vi.mocked(promptService.createVersion).mockResolvedValueOnce(mockCreated);

      const req = new NextRequest("http://localhost/api/admin/prompts/chat_system", {
        method: "POST",
        headers: adminHeaders,
        body: JSON.stringify({
          systemPrompt: "Updated prompt v2",
          changelog: "Upgraded safety guidelines",
          makeActive: true,
        }),
      });

      const res = await createPromptVersion(req, {
        params: Promise.resolve({ slug: "chat_system" }),
      });

      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.version.versionNumber).toBe(2);
    });

    it("rejects invalid payload with empty system prompt", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValueOnce(adminAuthContext);

      const req = new NextRequest("http://localhost/api/admin/prompts/chat_system", {
        method: "POST",
        headers: adminHeaders,
        body: JSON.stringify({
          systemPrompt: "",
        }),
      });

      const res = await createPromptVersion(req, {
        params: Promise.resolve({ slug: "chat_system" }),
      });

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe("Validation failed");
    });
  });

  describe("POST /api/admin/prompts/[slug]/rollback", () => {
    it("successfully rolls back to an earlier version", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValueOnce(adminAuthContext);
      const mockRolledBack: PromptVersion = {
        id: "v1",
        promptId: "p1",
        versionNumber: 1,
        systemPrompt: "Original v1",
        userTemplate: null,
        isActive: true,
        changelog: null,
        variables: [],
        createdAt: new Date("2026-01-01"),
      };
      vi.mocked(promptService.rollbackToVersion).mockResolvedValueOnce(mockRolledBack);

      const req = new NextRequest("http://localhost/api/admin/prompts/chat_system/rollback", {
        method: "POST",
        headers: adminHeaders,
        body: JSON.stringify({ versionNumber: 1 }),
      });

      const res = await rollbackPrompt(req, {
        params: Promise.resolve({ slug: "chat_system" }),
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.version.versionNumber).toBe(1);
    });

    it("rejects invalid version numbers", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValueOnce(adminAuthContext);

      const req = new NextRequest("http://localhost/api/admin/prompts/chat_system/rollback", {
        method: "POST",
        headers: adminHeaders,
        body: JSON.stringify({ versionNumber: -1 }),
      });

      const res = await rollbackPrompt(req, {
        params: Promise.resolve({ slug: "chat_system" }),
      });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/admin/prompts/[slug]/compare", () => {
    it("compares two versions and returns diff", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValueOnce(adminAuthContext);
      const mockDiff: PromptDiff = {
        promptSlug: "chat_system",
        v1Number: 1,
        v2Number: 2,
        systemPromptChanged: true,
        userTemplateChanged: false,
        addedVariables: ["citations"],
        removedVariables: [],
        v1: {
          id: "v1",
          promptId: "p1",
          versionNumber: 1,
          systemPrompt: "v1 prompt",
          userTemplate: null,
          isActive: false,
          changelog: null,
          variables: [],
          createdAt: new Date("2026-01-01"),
        },
        v2: {
          id: "v2",
          promptId: "p1",
          versionNumber: 2,
          systemPrompt: "v2 prompt",
          userTemplate: null,
          isActive: true,
          changelog: null,
          variables: ["citations"],
          createdAt: new Date("2026-01-02"),
        },
      };
      vi.mocked(promptService.compareVersions).mockResolvedValueOnce(mockDiff);

      const req = new NextRequest(
        "http://localhost/api/admin/prompts/chat_system/compare?v1=1&v2=2",
        {
          headers: adminHeaders,
        },
      );

      const res = await comparePrompts(req, {
        params: Promise.resolve({ slug: "chat_system" }),
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.diff.systemPromptChanged).toBe(true);
      expect(json.diff.addedVariables).toContain("citations");
    });

    it("rejects missing v1 or v2 query parameters", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValueOnce(adminAuthContext);

      const req = new NextRequest("http://localhost/api/admin/prompts/chat_system/compare?v1=1", {
        headers: adminHeaders,
      });

      const res = await comparePrompts(req, {
        params: Promise.resolve({ slug: "chat_system" }),
      });

      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/admin/prompts/test", () => {
    it("tests prompt template variables substitution", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValueOnce(adminAuthContext);
      const mockTestResult: PromptTestResult = {
        success: true,
        renderedSystemPrompt: "Answer in Arabic for Anas",
        renderedUserPrompt: null,
        detectedVariables: ["lang", "name"],
        missingVariables: [],
      };
      vi.mocked(promptService.testPrompt).mockReturnValueOnce(mockTestResult);

      const req = new NextRequest("http://localhost/api/admin/prompts/test", {
        method: "POST",
        headers: adminHeaders,
        body: JSON.stringify({
          systemPrompt: "Answer in {{lang}} for {{name}}",
          variables: { lang: "Arabic", name: "Anas" },
        }),
      });

      const res = await testPrompt(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.result.success).toBe(true);
      expect(json.result.renderedSystemPrompt).toBe("Answer in Arabic for Anas");
    });
  });
});
