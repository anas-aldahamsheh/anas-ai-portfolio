import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RagDebugModal } from "@/modules/chat/presentation/rag-debug-modal";
import { LocalizationProvider } from "@/modules/localization/presentation/localization-provider";
import { RagDebugTelemetry } from "@/ai/contracts/rag-debug";

describe("RagDebugModal Component (F036)", () => {
  const mockTelemetry: RagDebugTelemetry = {
    routeId: "project",
    routeLabel: "Project Scope & Architecture Intent",
    language: "en",
    direction: "ltr",
    conversationMode: "technical",
    rewriteCount: 2,
    retrievalMethod: "hybrid",
    retrievedCount: 15,
    rerankedCount: 6,
    selectedChunksCount: 4,
    tokenCount: 1840,
    modelId: "gpt-4o-mini",
    providerType: "openai_compatible",
    latencies: {
      routingMs: 12,
      rewriteMs: 34,
      retrievalMs: 56,
      rerankingMs: 42,
      contextMs: 8,
      generationMs: 120,
      totalMs: 272,
    },
    sources: [
      {
        id: "chunk-1",
        title: "Microservices Architecture Deep Dive",
        sourceType: "project",
        score: 0.9421,
        snippet: "Decoupled domain services communicating via gRPC and Kafka event mesh.",
      },
      {
        id: "chunk-2",
        title: "Senior AI Engineer CV Experience",
        sourceType: "cv",
        score: 0.8854,
        snippet: "Designed end-to-end RAG architecture with sub-300ms SLA and hybrid search.",
      },
    ],
    validationState: {
      isValid: true,
      citationsCount: 2,
      ungroundedCount: 0,
    },
    isScopedRetrieval: true,
    projectScopeId: "proj-arch",
    isAdminView: false,
  };

  const testDictionaryEn: Record<string, string> = {
    "chat.debug.button": "RAG Trace",
    "chat.debug.title": "RAG Pipeline Telemetry",
    "chat.debug.subtitle": "Inspect stage latencies, routing intent, and verified evidence.",
    "chat.debug.stages": "Pipeline Stages & Latency",
    "chat.debug.routing": "Intent & Routing",
    "chat.debug.rewrite": "Query Rewriting",
    "chat.debug.retrieval": "Hybrid Retrieval",
    "chat.debug.reranking": "Cross-Encoder Rerank",
    "chat.debug.context": "Context Budgeting",
    "chat.debug.generation": "Grounded Generation",
    "chat.debug.latency": "Total Latency",
    "chat.debug.sources": "Inspected Sources & Evidence",
    "chat.debug.tokens": "Context Tokens",
    "chat.debug.valid": "Citation Grounding Status",
    "chat.debug.valid.grounded": "Verified Grounded",
    "chat.debug.valid.insufficient": "Insufficient Evidence",
    "chat.debug.model": "Model & Provider",
    "chat.debug.route_id": "Resolved Route",
    "chat.debug.safety_notice":
      "Engineering transparency mode. System prompts, internal reasoning, and secret credentials are strictly protected.",
    "chat.debug.close": "Close Trace",
  };

  const testDictionaryAr: Record<string, string> = {
    "chat.debug.button": "تتبع RAG",
    "chat.debug.title": "بيانات خط معالجة RAG",
    "chat.debug.subtitle": "فحص أزمنة المراحل، توجيه القصد، والأدلة الموثقة بشفافية هندسية.",
    "chat.debug.stages": "مراحل المعالجة وزمن الاستجابة",
    "chat.debug.routing": "توجيه القصد",
    "chat.debug.rewrite": "إعادة صياغة الاستعلام",
    "chat.debug.retrieval": "الاسترجاع الهجين",
    "chat.debug.reranking": "إعادة الترتيب بالمرمز",
    "chat.debug.context": "تجهيز وتنسيق السياق",
    "chat.debug.generation": "التوليد المسند بالأدلة",
    "chat.debug.latency": "إجمالي زمن الاستجابة",
    "chat.debug.sources": "المصادر والأدلة المفحوصة",
    "chat.debug.tokens": "رموز السياق التقديرية",
    "chat.debug.valid": "حالة توثيق الاستشهادات",
    "chat.debug.valid.grounded": "موثق ومسند بالكامل",
    "chat.debug.valid.insufficient": "أدلة غير كافية",
    "chat.debug.model": "النموذج ومزود الخدمة",
    "chat.debug.route_id": "المسار المعتمد",
    "chat.debug.safety_notice":
      "نمط الشفافية الهندسية. التعليمات التأسيسية، سلاسل التفكير الداخلية، والمفاتيح السرية محمية بالكامل.",
    "chat.debug.close": "إغلاق التتبع",
  };

  const renderModal = (
    props: {
      isOpen: boolean;
      onClose?: () => void;
      telemetry?: RagDebugTelemetry;
    },
    locale: "en" | "ar" = "en",
  ) => {
    const dict = locale === "ar" ? testDictionaryAr : testDictionaryEn;
    return render(
      <LocalizationProvider locale={locale} dictionary={dict}>
        <RagDebugModal
          isOpen={props.isOpen}
          onClose={props.onClose || vi.fn()}
          telemetry={props.telemetry || mockTelemetry}
        />
      </LocalizationProvider>,
    );
  };

  it("does not render when isOpen is false", () => {
    renderModal({ isOpen: false });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders modal dialog with header and subtitle when isOpen is true", () => {
    renderModal({ isOpen: true });

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText("RAG Pipeline Telemetry")).toBeInTheDocument();
    expect(
      screen.getByText("Inspect stage latencies, routing intent, and verified evidence."),
    ).toBeInTheDocument();
  });

  it("renders key metrics grid (latency, tokens, route ID, grounding status)", () => {
    renderModal({ isOpen: true });

    expect(screen.getByText("Total Latency")).toBeInTheDocument();
    expect(screen.getByText("272")).toBeInTheDocument();

    expect(screen.getByText("Context Tokens")).toBeInTheDocument();
    expect(screen.getByText("1840")).toBeInTheDocument();

    expect(screen.getByText("Resolved Route")).toBeInTheDocument();
    expect(screen.getAllByText("project").length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText("Citation Grounding Status")).toBeInTheDocument();
    expect(screen.getByText("Verified Grounded")).toBeInTheDocument();
  });

  it("renders all 6 waterfall pipeline stages with latencies", () => {
    renderModal({ isOpen: true });

    expect(screen.getByTestId("rag-stage-routing")).toBeInTheDocument();
    expect(screen.getByText("Intent & Routing")).toBeInTheDocument();
    expect(screen.getByText("12 ms")).toBeInTheDocument();

    expect(screen.getByTestId("rag-stage-rewrite")).toBeInTheDocument();
    expect(screen.getByText("Query Rewriting")).toBeInTheDocument();
    expect(screen.getByText("34 ms")).toBeInTheDocument();

    expect(screen.getByTestId("rag-stage-retrieval")).toBeInTheDocument();
    expect(screen.getByText("Hybrid Retrieval")).toBeInTheDocument();
    expect(screen.getByText("56 ms")).toBeInTheDocument();

    expect(screen.getByTestId("rag-stage-reranking")).toBeInTheDocument();
    expect(screen.getByText("Cross-Encoder Rerank")).toBeInTheDocument();
    expect(screen.getByText("42 ms")).toBeInTheDocument();

    expect(screen.getByTestId("rag-stage-context")).toBeInTheDocument();
    expect(screen.getByText("Context Budgeting")).toBeInTheDocument();
    expect(screen.getByText("8 ms")).toBeInTheDocument();

    expect(screen.getByTestId("rag-stage-generation")).toBeInTheDocument();
    expect(screen.getByText("Grounded Generation")).toBeInTheDocument();
    expect(screen.getByText("120 ms")).toBeInTheDocument();
  });

  it("renders inspected sources list with scores and snippets", () => {
    renderModal({ isOpen: true });

    expect(screen.getByText("Inspected Sources & Evidence")).toBeInTheDocument();
    expect(screen.getByText("2 sources")).toBeInTheDocument();

    const source0 = screen.getByTestId("rag-source-item-0");
    expect(source0).toBeInTheDocument();
    expect(screen.getByText("Microservices Architecture Deep Dive")).toBeInTheDocument();
    expect(screen.getByText("Score: 0.9421")).toBeInTheDocument();
    expect(
      screen.getByText("Decoupled domain services communicating via gRPC and Kafka event mesh."),
    ).toBeInTheDocument();

    const source1 = screen.getByTestId("rag-source-item-1");
    expect(source1).toBeInTheDocument();
    expect(screen.getByText("Senior AI Engineer CV Experience")).toBeInTheDocument();
    expect(screen.getByText("Score: 0.8854")).toBeInTheDocument();
  });

  it("renders Admin Trace badge when isAdminView is true", () => {
    renderModal({
      isOpen: true,
      telemetry: {
        ...mockTelemetry,
        isAdminView: true,
      },
    });

    expect(screen.getByText("Admin Trace")).toBeInTheDocument();
  });

  it("renders safety guarantee notice", () => {
    renderModal({ isOpen: true });

    expect(
      screen.getByText(/Engineering transparency mode. System prompts, internal reasoning/i),
    ).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    renderModal({ isOpen: true, onClose: handleClose });

    const closeBtn = screen.getByTestId("rag-debug-close-btn");
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", () => {
    const handleClose = vi.fn();
    renderModal({ isOpen: true, onClose: handleClose });

    const backdrop = screen.getByTestId("rag-debug-modal-backdrop");
    fireEvent.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", () => {
    const handleClose = vi.fn();
    renderModal({ isOpen: true, onClose: handleClose });

    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("renders correctly in Arabic with RTL orientation", () => {
    renderModal({ isOpen: true }, "ar");

    const backdrop = screen.getByTestId("rag-debug-modal-backdrop");
    expect(backdrop).toHaveAttribute("dir", "rtl");
    expect(screen.getByText("بيانات خط معالجة RAG")).toBeInTheDocument();
    expect(screen.getByText("إجمالي زمن الاستجابة")).toBeInTheDocument();
    expect(screen.getByText("توجيه القصد")).toBeInTheDocument();
    expect(screen.getByText("الاسترجاع الهجين")).toBeInTheDocument();
    expect(screen.getByText("المصادر والأدلة المفحوصة")).toBeInTheDocument();
    expect(screen.getByText("موثق ومسند بالكامل")).toBeInTheDocument();
  });
});
