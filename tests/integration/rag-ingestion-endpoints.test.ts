import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET as getRagStatus } from "@/app/api/admin/rag/status/route";
import { POST as triggerIngest } from "@/app/api/admin/rag/ingest/route";
import { GET as getRagConfig, PATCH as patchRagConfig } from "@/app/api/admin/rag/config/route";
import { ingestionService } from "@/ai/ingestion";
import * as serverAuth from "@/modules/auth/infrastructure/server-auth";
import type { RagIndexStatus, RagConfiguration } from "@/ai/contracts/ingestion";

vi.mock("@/ai/ingestion", () => ({
  ingestionService: {
    getRagIndexStatus: vi.fn(),
    getRagConfiguration: vi.fn(),
    updateRagConfiguration: vi.fn(),
    triggerIngestion: vi.fn(),
  },
}));

describe("RAG Ingestion Admin Endpoints (F022)", () => {
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
      id: "sess-rag-1",
      userId: "admin-uuid",
      token: "tok-rag",
      expiresAt: new Date(),
    },
  };

  const mockStatus: RagIndexStatus = {
    activeVersionTag: "v1.0.0-bge-m3",
    embeddingModel: "BAAI/bge-m3",
    denseDimension: 1024,
    totalDocuments: 15,
    totalChunks: 64,
    lastIngestionJob: {
      id: "job-1",
      status: "completed",
      processedDocuments: 15,
      totalDocuments: 15,
      errorMessage: null,
      startedAt: new Date(),
      completedAt: new Date(),
    },
  };

  const mockConfig: RagConfiguration = {
    id: "cfg-1",
    isCurrent: true,
    chunkSize: 512,
    chunkOverlap: 64,
    topK: 10,
    rerankTopN: 5,
    rerankThreshold: 0.3,
    hybridAlpha: 0.5,
    contextTokenBudget: 3000,
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Security Guards (requireAdmin)", () => {
    it("returns 401 when no session or credentials provided", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockRejectedValueOnce(
        new serverAuth.UnauthorizedError(),
      );

      const req = new NextRequest("http://localhost/api/admin/rag/status");
      const res = await getRagStatus(req);
      expect(res.status).toBe(401);
    });

    it("returns 403 when authenticated user lacks ADMIN role", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockRejectedValueOnce(new serverAuth.ForbiddenError());

      const req = new NextRequest("http://localhost/api/admin/rag/status", {
        headers: adminHeaders,
      });
      const res = await getRagStatus(req);
      expect(res.status).toBe(403);
    });
  });

  describe("GET /api/admin/rag/status", () => {
    it("returns active index status and counts for admin", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValueOnce(adminAuthContext);
      vi.mocked(ingestionService.getRagIndexStatus).mockResolvedValueOnce(mockStatus);

      const req = new NextRequest("http://localhost/api/admin/rag/status", {
        headers: adminHeaders,
      });
      const res = await getRagStatus(req);
      expect(res.status).toBe(200);

      const data = (await res.json()) as { status: RagIndexStatus };
      expect(data.status.activeVersionTag).toBe("v1.0.0-bge-m3");
      expect(data.status.totalChunks).toBe(64);
    });
  });

  describe("POST /api/admin/rag/ingest", () => {
    it("triggers ingestion and returns execution metrics", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValueOnce(adminAuthContext);
      vi.mocked(ingestionService.triggerIngestion).mockResolvedValueOnce({
        jobId: "job-new-1",
        status: "completed",
        totalDocuments: 15,
        processedDocuments: 15,
        chunksIndexed: 64,
        skippedDocuments: 0,
      });

      const req = new NextRequest("http://localhost/api/admin/rag/ingest", {
        method: "POST",
        headers: adminHeaders,
        body: JSON.stringify({ forceReindex: true }),
      });

      const res = await triggerIngest(req);
      expect(res.status).toBe(200);

      const data = (await res.json()) as { success: boolean; chunksIndexed: number };
      expect(data.success).toBe(true);
      expect(data.chunksIndexed).toBe(64);
      expect(ingestionService.triggerIngestion).toHaveBeenCalledWith(
        expect.objectContaining({ forceReindex: true }),
      );
    });

    it("handles empty body gracefully defaulting options", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValueOnce(adminAuthContext);
      vi.mocked(ingestionService.triggerIngestion).mockResolvedValueOnce({
        jobId: "job-new-2",
        status: "completed",
        totalDocuments: 10,
        processedDocuments: 10,
        chunksIndexed: 40,
        skippedDocuments: 0,
      });

      const req = new NextRequest("http://localhost/api/admin/rag/ingest", {
        method: "POST",
        headers: adminHeaders,
        body: "",
      });

      const res = await triggerIngest(req);
      expect(res.status).toBe(200);
    });
  });

  describe("GET and PATCH /api/admin/rag/config", () => {
    it("returns current configuration on GET", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValueOnce(adminAuthContext);
      vi.mocked(ingestionService.getRagConfiguration).mockResolvedValueOnce(mockConfig);

      const req = new NextRequest("http://localhost/api/admin/rag/config", {
        headers: adminHeaders,
      });
      const res = await getRagConfig(req);
      expect(res.status).toBe(200);

      const data = (await res.json()) as { config: RagConfiguration };
      expect(data.config.chunkSize).toBe(512);
    });

    it("updates configuration on PATCH with valid input", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValueOnce(adminAuthContext);
      vi.mocked(ingestionService.updateRagConfiguration).mockResolvedValueOnce({
        ...mockConfig,
        chunkSize: 768,
        chunkOverlap: 96,
      });

      const req = new NextRequest("http://localhost/api/admin/rag/config", {
        method: "PATCH",
        headers: adminHeaders,
        body: JSON.stringify({ chunkSize: 768, chunkOverlap: 96 }),
      });

      const res = await patchRagConfig(req);
      expect(res.status).toBe(200);

      const data = (await res.json()) as { success: boolean; config: RagConfiguration };
      expect(data.success).toBe(true);
      expect(data.config.chunkSize).toBe(768);
    });

    it("rejects invalid configuration ranges with 400 Validation Error", async () => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValueOnce(adminAuthContext);

      const req = new NextRequest("http://localhost/api/admin/rag/config", {
        method: "PATCH",
        headers: adminHeaders,
        body: JSON.stringify({ chunkSize: 10 }), // Below min 64
      });

      const res = await patchRagConfig(req);
      expect(res.status).toBe(400);

      const data = (await res.json()) as { error: string };
      expect(data.error).toBe("Validation failed");
    });
  });
});
