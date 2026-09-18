import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RagPipelineManager } from "@/modules/admin/presentation/rag-pipeline-manager";
import { RagConfiguration, RagIndexStatus } from "@/ai/contracts/ingestion";

describe("RagPipelineManager UI Component (F022)", () => {
  const mockStatus: RagIndexStatus = {
    activeVersionTag: "v1.0.0-bge-m3",
    embeddingModel: "BAAI/bge-m3",
    denseDimension: 1024,
    totalDocuments: 12,
    totalChunks: 48,
    lastIngestionJob: {
      id: "job-ui-1",
      status: "completed",
      processedDocuments: 12,
      totalDocuments: 12,
      errorMessage: null,
      startedAt: new Date("2026-09-18T12:00:00Z"),
      completedAt: new Date("2026-09-18T12:01:00Z"),
    },
  };

  const mockConfig: RagConfiguration = {
    id: "cfg-ui-1",
    isCurrent: true,
    chunkSize: 512,
    chunkOverlap: 64,
    topK: 10,
    rerankTopN: 5,
    rerankThreshold: 0.3,
    hybridAlpha: 0.5,
    contextTokenBudget: 3000,
    updatedAt: new Date("2026-09-18T12:00:00Z"),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockImplementation((url: string, init?: RequestInit) => {
      if (url.includes("/api/admin/rag/ingest") && init?.method === "POST") {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              jobId: "job-triggered",
              processedDocuments: 12,
              chunksIndexed: 48,
              skippedDocuments: 0,
            }),
        });
      }
      if (url.includes("/api/admin/rag/config") && init?.method === "PATCH") {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              config: { ...mockConfig, chunkSize: 768 },
            }),
        });
      }
      if (url.includes("/api/admin/rag/status")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: mockStatus }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });
  });

  it("renders status telemetry, embedding model, and counts in English", () => {
    render(
      <RagPipelineManager initialStatus={mockStatus} initialConfig={mockConfig} locale="en" />,
    );

    expect(screen.getByText("RAG Knowledge Pipeline")).toBeInTheDocument();
    expect(screen.getByText("v1.0.0-bge-m3")).toBeInTheDocument();
    expect(screen.getByText("BAAI/bge-m3")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("48")).toBeInTheDocument();
    expect(screen.getByText("Trigger Ingestion Now")).toBeInTheDocument();
  });

  it("renders Arabic interface when locale is ar", () => {
    render(
      <RagPipelineManager initialStatus={mockStatus} initialConfig={mockConfig} locale="ar" />,
    );

    expect(screen.getByText("منظومة الاسترجاع المعزز (RAG Pipeline)")).toBeInTheDocument();
    expect(screen.getByText("إصدار الفهرس النشط")).toBeInTheDocument();
    expect(screen.getByText("الوثائق المفهرسة")).toBeInTheDocument();
    expect(screen.getByText("المقاطع الدلالية (Chunks)")).toBeInTheDocument();
    expect(screen.getByText("بدء مزامنة الفهرس الآن")).toBeInTheDocument();
  });

  it("triggers ingestion when clicking trigger button and shows success banner", async () => {
    render(
      <RagPipelineManager initialStatus={mockStatus} initialConfig={mockConfig} locale="en" />,
    );

    const triggerBtn = screen.getByRole("button", { name: /Trigger Ingestion Now/i });
    fireEvent.click(triggerBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/admin/rag/ingest",
        expect.objectContaining({ method: "POST" }),
      );
      expect(screen.getByText(/Ingestion completed successfully/i)).toBeInTheDocument();
    });
  });

  it("allows updating configuration and shows success banner", async () => {
    render(
      <RagPipelineManager initialStatus={mockStatus} initialConfig={mockConfig} locale="en" />,
    );

    const saveBtn = screen.getByRole("button", { name: /Save Configuration/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/admin/rag/config",
        expect.objectContaining({ method: "PATCH" }),
      );
      expect(screen.getByText(/RAG configuration saved successfully/i)).toBeInTheDocument();
    });
  });
});
