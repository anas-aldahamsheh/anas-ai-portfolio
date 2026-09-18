import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST as generateTestRoute } from "@/app/api/admin/ai/generate/test/route";
import * as serverAuth from "@/modules/auth/infrastructure/server-auth";

vi.mock("@/ai/generation", async () => {
  const actual = await vi.importActual<typeof import("@/ai/generation")>("@/ai/generation");
  return {
    ...actual,
    groundedGenerator: {
      generate: vi.fn().mockResolvedValue({
        content:
          "According to verified architectural specifications: - Semantic Search System: Anas designed a production semantic search platform. [cit:proj_search:c1]",
        rawContent:
          "According to verified architectural specifications: - Semantic Search System: Anas designed a production semantic search platform. [cit:proj_search:c1]",
        language: "en",
        conversationMode: "technical",
        citations: [
          {
            citationId: "proj_search:c1",
            sourceId: "proj-search",
            sourceType: "project",
            title: "Semantic Search System",
            locale: "en",
            occurrences: 1,
          },
        ],
        validation: {
          isValid: true,
          citedIds: ["proj_search:c1"],
          validCitedIds: ["proj_search:c1"],
          invalidCitedIds: [],
          missingRequiredCitations: false,
          cleanedText:
            "According to verified architectural specifications: - Semantic Search System: Anas designed a production semantic search platform. [cit:proj_search:c1]",
          citations: [
            {
              citationId: "proj_search:c1",
              sourceId: "proj-search",
              sourceType: "project",
              title: "Semantic Search System",
              locale: "en",
              occurrences: 1,
            },
          ],
          languageConsistent: true,
        },
        hasInsufficientEvidence: false,
        telemetry: {
          modelUsed: "heuristic-grounded-fallback",
          providerType: "heuristic",
          promptTokens: 50,
          completionTokens: 25,
          totalTokens: 75,
          latencyMs: 1,
          citedSourcesCount: 1,
          hasInsufficientEvidence: false,
          strategy: "fallback",
        },
      }),
    },
  };
});

describe("Admin AI Generate Test Route (/api/admin/ai/generate/test)", () => {
  const adminHeaders = new Headers({
    authorization: "Bearer admin-mock-token",
  });

  const adminAuthContext: serverAuth.AuthenticatedContext = {
    user: {
      id: "admin-uuid",
      email: "admin@example.com",
      name: "Admin",
    },
    role: "ADMIN",
    session: {
      id: "sess-gen-test",
      userId: "admin-uuid",
      token: "tok-gen-test",
      expiresAt: new Date(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects unauthenticated requests with 401", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockRejectedValueOnce(
      new serverAuth.UnauthorizedError("Unauthorized"),
    );

    const req = new NextRequest("http://localhost/api/admin/ai/generate/test", {
      method: "POST",
      body: JSON.stringify({ userMessage: "Hello" }),
    });

    const res = await generateTestRoute(req);
    expect(res.status).toBe(401);
  });

  it("rejects non-admin users with 403", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockRejectedValueOnce(
      new serverAuth.ForbiddenError("Forbidden: Admin role required"),
    );

    const req = new NextRequest("http://localhost/api/admin/ai/generate/test", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({ userMessage: "Hello" }),
    });

    const res = await generateTestRoute(req);
    expect(res.status).toBe(403);
  });

  it("rejects invalid input with 400", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

    const req = new NextRequest("http://localhost/api/admin/ai/generate/test", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({
        // userMessage is missing
        contextChunks: [],
      }),
    });

    const res = await generateTestRoute(req);
    expect(res.status).toBe(400);

    const json = (await res.json()) as { error: string };
    expect(json.error).toBe("Invalid test input");
  });

  it("successfully processes generation test with context and returns structured answer", async () => {
    vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue(adminAuthContext);

    const req = new NextRequest("http://localhost/api/admin/ai/generate/test", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({
        userMessage: "What search system did Anas build?",
        contextChunks: [
          {
            id: "chk-1",
            citationId: "proj_search:c1",
            sourceId: "proj-search",
            sourceType: "project",
            title: "Semantic Search System",
            locale: "en",
            content:
              "Anas designed a production semantic search platform powered by dense vector embeddings and BM25 hybrid ranking.",
            score: 0.95,
            rerankScore: 0.98,
          },
        ],
        responseLanguage: "en",
        conversationMode: "technical",
      }),
    });

    const res = await generateTestRoute(req);
    expect(res.status).toBe(200);

    const json = (await res.json()) as {
      success: boolean;
      answer: {
        content: string;
        language: string;
        conversationMode: string;
        citations: Array<{ citationId: string; title: string }>;
        telemetry: { strategy: string };
        hasInsufficientEvidence: boolean;
      };
    };

    expect(json.success).toBe(true);
    expect(json.answer).toBeDefined();
    expect(json.answer.language).toBe("en");
    expect(json.answer.conversationMode).toBe("technical");
    expect(json.answer.citations.length).toBeGreaterThan(0);
    expect(json.answer.citations[0]?.citationId).toBe("proj_search:c1");
    expect(json.answer.hasInsufficientEvidence).toBe(false);
  });
});
