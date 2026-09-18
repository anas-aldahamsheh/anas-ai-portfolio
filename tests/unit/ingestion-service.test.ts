import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";
import { IngestionService } from "@/ai/ingestion/jobs/ingestion-service";
import { RagIndexer } from "@/ai/ingestion/indexers/rag-indexer";
import { db } from "@/lib/db/client";
import { QdrantVectorStore } from "@/lib/qdrant/vector-store";
import * as parsers from "@/ai/ingestion/parsers";

vi.mock("@/lib/db/client", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@/lib/observability/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

describe("Ingestion Service (F022)", () => {
  let service: IngestionService;
  let mockVectorStore: QdrantVectorStore;
  let indexer: RagIndexer;

  const mockSelect = db.select as unknown as Mock;
  const mockInsert = db.insert as unknown as Mock;
  const mockUpdate = db.update as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockVectorStore = new QdrantVectorStore({ forceInMemory: true });
    indexer = new RagIndexer({ vectorStore: mockVectorStore });
    service = new IngestionService(indexer);
  });

  describe("getRagConfiguration", () => {
    it("returns existing active RAG configuration", async () => {
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                id: "cfg-1",
                isCurrent: true,
                chunkSize: 512,
                chunkOverlap: 64,
                topK: 10,
                rerankTopN: 5,
                rerankThreshold: "0.35",
                hybridAlpha: "0.6",
                contextTokenBudget: 3500,
                updatedAt: new Date("2026-09-18T12:00:00Z"),
              },
            ]),
          }),
        }),
      });

      const config = await service.getRagConfiguration();
      expect(config.id).toBe("cfg-1");
      expect(config.chunkSize).toBe(512);
      expect(config.rerankThreshold).toBe(0.35);
      expect(config.hybridAlpha).toBe(0.6);
    });

    it("inserts default configuration if none exists", async () => {
      // First select returns empty
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      // Insert returns newly created default
      mockInsert.mockReturnValueOnce({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([
            {
              id: "cfg-default",
              isCurrent: true,
              chunkSize: 512,
              chunkOverlap: 64,
              topK: 10,
              rerankTopN: 5,
              rerankThreshold: "0.3",
              hybridAlpha: "0.5",
              contextTokenBudget: 3000,
              updatedAt: new Date(),
            },
          ]),
        }),
      });

      const config = await service.getRagConfiguration();
      expect(config.id).toBe("cfg-default");
      expect(config.chunkSize).toBe(512);
      expect(config.topK).toBe(10);
    });
  });

  describe("updateRagConfiguration", () => {
    it("updates RAG runtime settings and returns updated config", async () => {
      // Mock existing config retrieval
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                id: "cfg-1",
                isCurrent: true,
                chunkSize: 512,
                chunkOverlap: 64,
                topK: 10,
                rerankTopN: 5,
                rerankThreshold: "0.3",
                hybridAlpha: "0.5",
                contextTokenBudget: 3000,
                updatedAt: new Date(),
              },
            ]),
          }),
        }),
      });

      // Mock update
      mockUpdate.mockReturnValueOnce({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([
              {
                id: "cfg-1",
                isCurrent: true,
                chunkSize: 768,
                chunkOverlap: 96,
                topK: 15,
                rerankTopN: 7,
                rerankThreshold: "0.4",
                hybridAlpha: "0.7",
                contextTokenBudget: 4000,
                updatedAt: new Date(),
              },
            ]),
          }),
        }),
      });

      const updated = await service.updateRagConfiguration({
        chunkSize: 768,
        chunkOverlap: 96,
        topK: 15,
        rerankTopN: 7,
        rerankThreshold: 0.4,
        hybridAlpha: 0.7,
        contextTokenBudget: 4000,
      });

      expect(updated.chunkSize).toBe(768);
      expect(updated.chunkOverlap).toBe(96);
      expect(updated.rerankThreshold).toBe(0.4);
      expect(updated.hybridAlpha).toBe(0.7);
    });
  });

  describe("getRagIndexStatus", () => {
    it("returns active index version, doc counts, chunk counts, and latest job", async () => {
      // Mock getOrCreateActiveIndexVersion select
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                id: "ver-1",
                versionTag: "v1.0.0-bge-m3",
                embeddingModel: "BAAI/bge-m3",
                denseDimension: 1024,
                isCurrent: true,
                indexedChunkCount: 42,
              },
            ]),
          }),
        }),
      });

      // Mock doc count
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockResolvedValue([{ value: 12 }]),
      });

      // Mock chunk count
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockResolvedValue([{ value: 42 }]),
      });

      // Mock latest job
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                id: "job-101",
                status: "completed",
                totalDocuments: 12,
                processedDocuments: 12,
                errorMessage: null,
                startedAt: new Date("2026-09-18T10:00:00Z"),
                completedAt: new Date("2026-09-18T10:01:00Z"),
              },
            ]),
          }),
        }),
      });

      const status = await service.getRagIndexStatus();
      expect(status.activeVersionTag).toBe("v1.0.0-bge-m3");
      expect(status.totalDocuments).toBe(12);
      expect(status.totalChunks).toBe(42);
      expect(status.lastIngestionJob?.status).toBe("completed");
    });
  });

  describe("triggerIngestion", () => {
    it("runs complete ingestion lifecycle and updates job status", async () => {
      // 1. Mock active index version query
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                id: "ver-1",
                versionTag: "v1.0.0-bge-m3",
                embeddingModel: "BAAI/bge-m3",
                denseDimension: 1024,
                isCurrent: true,
              },
            ]),
          }),
        }),
      });

      // 2. Mock getRagConfiguration query
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                id: "cfg-1",
                isCurrent: true,
                chunkSize: 512,
                chunkOverlap: 64,
                topK: 10,
                rerankTopN: 5,
                rerankThreshold: "0.3",
                hybridAlpha: "0.5",
                contextTokenBudget: 3000,
                updatedAt: new Date(),
              },
            ]),
          }),
        }),
      });

      // 3. Mock job insertion
      mockInsert.mockReturnValueOnce({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ id: "job-created-1" }]),
        }),
      });

      // Mock parseAllSources
      vi.spyOn(parsers, "parseAllSources").mockResolvedValueOnce([
        {
          sourceType: "project",
          sourceId: "p-1",
          title: "Test Project",
          locale: "en",
          content: "Comprehensive project details about modern AI development.",
        },
      ]);

      // Mock job update (totalDocuments)
      mockUpdate.mockReturnValueOnce({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      // Mock indexer.indexDocument dependencies
      // Existing doc check inside indexDocument
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]), // new document
          }),
        }),
      });

      // Insert source document record
      mockInsert.mockReturnValueOnce({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ id: "doc-rec-1" }]),
        }),
      });

      // Insert source chunks
      mockInsert.mockReturnValueOnce({
        values: vi.fn().mockResolvedValue([]),
      });

      // Progress update for job
      mockUpdate.mockReturnValueOnce({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      // Chunks count after ingestion
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockResolvedValue([{ value: 1 }]),
      });

      // Final job complete update
      mockUpdate.mockReturnValueOnce({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      // Index version update
      mockUpdate.mockReturnValueOnce({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      const result = await service.triggerIngestion({ forceReindex: false });

      expect(result.jobId).toBe("job-created-1");
      expect(result.status).toBe("completed");
      expect(result.totalDocuments).toBe(1);
      expect(result.processedDocuments).toBe(1);
      expect(result.chunksIndexed).toBeGreaterThan(0);
      expect(result.skippedDocuments).toBe(0);
    });
  });
});
