import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AiControlCenter } from "@/modules/admin/presentation/ai-control-center";
import { LocalizationProvider } from "@/modules/localization/presentation/localization-provider";
import {
  BASELINE_PROVIDERS,
  BASELINE_MODELS,
  BASELINE_ASSIGNMENTS,
  BASELINE_RUNTIME_POLICY,
} from "@/ai/contracts/baseline-registry";
import type { AiControlOverview } from "@/modules/admin/domain/ai-control";

describe("AiControlCenter Component (F040)", () => {
  const mockOverview: AiControlOverview = {
    overallHealth: "healthy",
    subsystems: {
      providersCount: 3,
      activeModelsCount: 4,
      totalModelsCount: 6,
      activeAssignmentsCount: 6,
      ragIndexedDocumentsCount: 14,
      promptTemplatesCount: 5,
      evaluationGateVerdict: "PASSED",
    },
    subsystemHealth: [
      {
        id: "providers",
        name: "AI Providers & Gateways",
        nameAr: "مزودو وبوابات الذكاء الاصطناعي",
        status: "healthy",
        message: "3 providers registered.",
        messageAr: "تم تسجيل 3 مزودين.",
        lastChecked: "2026-09-18T00:00:00Z",
      },
      {
        id: "models",
        name: "Model Registry",
        nameAr: "سجل النماذج",
        status: "healthy",
        message: "6 models configured.",
        messageAr: "تم تكوين 6 نماذج.",
        lastChecked: "2026-09-18T00:00:00Z",
      },
      {
        id: "rag",
        name: "RAG Pipeline",
        nameAr: "محرك المعرفة",
        status: "healthy",
        message: "82 chunks indexed.",
        messageAr: "تمت فهرسة 82 مقطع.",
        lastChecked: "2026-09-18T00:00:00Z",
      },
      {
        id: "prompts",
        name: "Prompt Templates",
        nameAr: "قوالب التوجيه",
        status: "healthy",
        message: "5 templates active.",
        messageAr: "5 قوالب نشطة.",
        lastChecked: "2026-09-18T00:00:00Z",
      },
      {
        id: "eval_gate",
        name: "Quality Gate",
        nameAr: "بوابة الجودة",
        status: "healthy",
        message: "Last evaluation benchmark verdict: PASSED",
        messageAr: "حكم آخر تقييم: PASSED",
        lastChecked: "2026-09-18T00:00:00Z",
      },
    ],
    activeBindings: [
      {
        capability: "generation",
        label: "Answer Generation (LLM)",
        labelAr: "توليد الإجابات",
        modelId: "mod-gpt4o-1",
        modelIdentifier: "gpt-4o",
        providerId: "prov-openai-1",
        providerName: "OpenAI",
        contextWindow: 128000,
        isReady: true,
        notes: "Powers AI Chat.",
      },
      {
        capability: "embedding",
        label: "Knowledge Embedding",
        labelAr: "تضمين المعرفة",
        modelId: "mod-bge-m3-1",
        modelIdentifier: "BAAI/bge-m3",
        providerId: "prov-local-1",
        providerName: "Local Adapter",
        embeddingDimension: 1024,
        isReady: true,
        notes: "Generates vector embeddings.",
      },
    ],
    embeddingCompatibility: {
      activeModelId: "mod-bge-m3-1",
      activeDimension: 1024,
      indexDimension: 1024,
      isCompatible: true,
      requiresReindex: false,
    },
    ragConfig: {
      chunkSize: 512,
      chunkOverlap: 64,
      topK: 10,
      rerankTopN: 5,
      rerankThreshold: 0.35,
      hybridAlpha: 0.7,
      contextTokenBudget: 3500,
    },
  };

  const renderControlCenter = (locale: "en" | "ar" = "en") => {
    return render(
      <LocalizationProvider locale={locale} dictionary={{}}>
        <AiControlCenter
          initialOverview={mockOverview}
          initialProviders={BASELINE_PROVIDERS.map((p) => ({
            ...p,
            modelsCount: 2,
            activeModelsCount: 1,
            hasApiKey: true,
            maskedKey: "sk-***1234",
          }))}
          initialModels={BASELINE_MODELS.map((m) => ({
            ...m,
            providerName: "OpenAI",
            providerType: "openai_compatible" as const,
            isCurrentlyAssigned: true,
          }))}
          initialAssignments={BASELINE_ASSIGNMENTS.map((a) => ({
            ...a,
            modelName: "gpt-4o",
            providerId: "prov-openai-1",
            providerName: "OpenAI",
            providerType: "openai_compatible" as const,
          }))}
          initialPolicy={BASELINE_RUNTIME_POLICY}
          initialRagStatus={{
            totalDocuments: 14,
            totalChunks: 82,
            activeVersionTag: "v1.0.0-bge-m3",
            embeddingModel: "BAAI/bge-m3",
            denseDimension: 1024,
            lastIngestionJob: null,
          }}
          initialRagConfig={{
            id: "cfg-test-1",
            isCurrent: true,
            ...mockOverview.ragConfig,
            updatedAt: new Date("2026-09-18T00:00:00Z"),
          }}
          locale={locale}
        />
      </LocalizationProvider>,
    );
  };

  it("renders executive title and F040 badge", () => {
    renderControlCenter();

    expect(screen.getByText("F040")).toBeInTheDocument();
    expect(screen.getByText("AI Control Center")).toBeInTheDocument();
    expect(screen.getByText("Run Evaluation Gate")).toBeInTheDocument();
  });

  it("renders 5 subsystem health cards", () => {
    renderControlCenter();

    expect(screen.getByText("AI Providers & Gateways")).toBeInTheDocument();
    expect(screen.getByText("Model Registry")).toBeInTheDocument();
    expect(screen.getByText("RAG Pipeline")).toBeInTheDocument();
    expect(screen.getByText("Prompt Templates")).toBeInTheDocument();
    expect(screen.getByText("Quality Gate")).toBeInTheDocument();
  });

  it("renders active bindings capability matrix", () => {
    renderControlCenter();

    expect(screen.getByText("Active AI Capability Matrix")).toBeInTheDocument();
    expect(screen.getByText("Answer Generation (LLM)")).toBeInTheDocument();
    expect(screen.getByText("Knowledge Embedding")).toBeInTheDocument();
  });

  it("navigates between tabs seamlessly", () => {
    renderControlCenter();

    // Click on Change Safety & Quality Gate tab
    const safetyTab = screen.getByText("Change Safety & Quality Gate");
    fireEvent.click(safetyTab);

    expect(screen.getByText("Quality & Regression Release Gate")).toBeInTheDocument();
    expect(screen.getByText("Retrieval Recall@5")).toBeInTheDocument();
    expect(screen.getByText("Generation Faithfulness")).toBeInTheDocument();
  });

  it("supports Arabic RTL layout properly", () => {
    renderControlCenter("ar");

    expect(screen.getByText("مركز التحكم في الذكاء الاصطناعي")).toBeInTheDocument();
    expect(screen.getByText("مزودو وبوابات الذكاء الاصطناعي")).toBeInTheDocument();
  });
});
