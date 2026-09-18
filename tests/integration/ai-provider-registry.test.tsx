import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { NextRequest } from "next/server";
import { AiRegistryManager } from "@/modules/admin/presentation";
import { LocalizationProvider } from "@/modules/localization/presentation/localization-provider";
import {
  BASELINE_PROVIDERS,
  BASELINE_MODELS,
  BASELINE_ASSIGNMENTS,
  BASELINE_RUNTIME_POLICY,
} from "@/ai/contracts/baseline-registry";
import type {
  DisplaySafeProvider,
  DisplaySafeModel,
  DisplaySafeAssignment,
} from "@/ai/contracts/provider-registry";
import { GET as getProvidersRoute } from "@/app/api/admin/ai/providers/route";
import { GET as getAssignmentsRoute } from "@/app/api/admin/ai/assignments/route";
import { GET as getPolicyRoute } from "@/app/api/admin/ai/policy/route";

const dictEn: Record<string, string> = {
  "admin.ai.registry.title": "AI Provider & Model Registry",
  "admin.ai.registry.subtitle":
    "Configure providers, register models, and manage capability assignments dynamically.",
  "admin.ai.tabs.assignments": "Capability Assignments",
  "admin.ai.tabs.providers": "Providers",
  "admin.ai.tabs.models": "Models & Verification",
  "admin.ai.tabs.policy": "Runtime Policy",
  "admin.ai.capabilities.generation": "Conversational Generation",
  "admin.ai.capabilities.embedding": "Multilingual Embedding",
  "admin.ai.capabilities.reranking": "Neural Reranking",
  "admin.ai.capabilities.router": "Query Intent Router",
  "admin.ai.capabilities.rewrite": "Query Rewriter",
  "admin.ai.capabilities.evaluator": "Evaluation & Safety",
  "admin.ai.test.button": "Test",
  "admin.ai.test.running": "Testing...",
  "admin.ai.test.success": "Healthy",
  "admin.ai.test.failed": "Check Failed",
};

const dictAr: Record<string, string> = {
  "admin.ai.registry.title": "سجل مزودي ونماذج الذكاء الاصطناعي",
  "admin.ai.registry.subtitle":
    "إدارة مزودي ونماذج الذكاء الاصطناعي وتعيين الأدوار والسياسات التشغيلية.",
  "admin.ai.tabs.assignments": "تعيينات القدرات النشطة",
  "admin.ai.tabs.providers": "المزودون",
  "admin.ai.tabs.models": "النماذج والفحص",
  "admin.ai.tabs.policy": "السياسة التشغيلية",
  "admin.ai.capabilities.generation": "توليد المحادثة والإجابات",
  "admin.ai.capabilities.embedding": "التضمين الشعاعي",
  "admin.ai.capabilities.reranking": "إعادة الترتيب العصبي",
  "admin.ai.capabilities.router": "توجيه النوايا والاستعلامات",
  "admin.ai.capabilities.rewrite": "إعادة صياغة الاستعلام",
  "admin.ai.capabilities.evaluator": "التقييم وضمان السلامة",
  "admin.ai.test.button": "فحص",
  "admin.ai.test.running": "جارٍ الفحص...",
  "admin.ai.test.success": "سليم ومطابق",
  "admin.ai.test.failed": "فشل التحقق",
};

const safeProviders: DisplaySafeProvider[] = BASELINE_PROVIDERS.map((p) => ({
  ...p,
  modelsCount: 2,
  activeModelsCount: 1,
}));

const safeModels: DisplaySafeModel[] = BASELINE_MODELS.map((m) => ({
  ...m,
  providerName: "OpenAI Compatible High-Throughput Gateway",
  providerType: "openai_compatible",
  isCurrentlyAssigned: m.modelId === "gpt-4o-mini" || m.modelId === "BAAI/bge-m3",
}));

const safeAssignments: DisplaySafeAssignment[] = BASELINE_ASSIGNMENTS.map((a) => ({
  ...a,
  modelName: a.modelId,
  providerId: "prov-openai-gateway",
  providerName: "OpenAI Gateway",
  providerType: "openai_compatible",
}));

describe("AI Provider & Model Registry Integration (F019)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Presentation UI", () => {
    it("renders AI Registry Manager with all 4 navigation tabs", () => {
      render(
        <LocalizationProvider locale="en" dictionary={dictEn}>
          <AiRegistryManager
            initialProviders={safeProviders}
            initialModels={safeModels}
            initialAssignments={safeAssignments}
            initialPolicy={BASELINE_RUNTIME_POLICY}
            locale="en"
          />
        </LocalizationProvider>,
      );

      expect(screen.getByText("AI Provider & Model Registry")).toBeInTheDocument();
      expect(screen.getByText("Capability Assignments")).toBeInTheDocument();
      expect(screen.getByText(/Providers \(\d+\)/)).toBeInTheDocument();
      expect(screen.getByText(/Models & Verification \(\d+\)/)).toBeInTheDocument();
      expect(screen.getByText("Runtime Policy")).toBeInTheDocument();
    });

    it("displays all 6 capability assignment cards in default tab", () => {
      render(
        <LocalizationProvider locale="en" dictionary={dictEn}>
          <AiRegistryManager
            initialProviders={safeProviders}
            initialModels={safeModels}
            initialAssignments={safeAssignments}
            initialPolicy={BASELINE_RUNTIME_POLICY}
            locale="en"
          />
        </LocalizationProvider>,
      );

      expect(screen.getByText("Conversational Generation")).toBeInTheDocument();
      expect(screen.getByText("Multilingual Embedding")).toBeInTheDocument();
      expect(screen.getByText("Neural Reranking")).toBeInTheDocument();
      expect(screen.getByText("Query Intent Router")).toBeInTheDocument();
      expect(screen.getByText("Query Rewriter")).toBeInTheDocument();
      expect(screen.getByText("Evaluation & Safety")).toBeInTheDocument();
    });

    it("switches to Providers tab and shows configured provider list", () => {
      render(
        <LocalizationProvider locale="en" dictionary={dictEn}>
          <AiRegistryManager
            initialProviders={safeProviders}
            initialModels={safeModels}
            initialAssignments={safeAssignments}
            initialPolicy={BASELINE_RUNTIME_POLICY}
            locale="en"
          />
        </LocalizationProvider>,
      );

      const providersTab = screen.getByText(/Providers \(\d+\)/);
      fireEvent.click(providersTab);

      expect(screen.getByText("Configured AI Providers")).toBeInTheDocument();
      expect(screen.getByText("OpenAI Compatible High-Throughput Gateway")).toBeInTheDocument();
      expect(screen.getByText("Anthropic Direct Cloud")).toBeInTheDocument();
    });

    it("switches to Models tab and displays capability test actions", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          testResult: {
            success: true,
            capability: "embedding",
            modelId: "BAAI/bge-m3",
            latencyMs: 32,
            message: "Validated 1024-dimension vector generation with bilingual sample handling.",
          },
        }),
      });

      render(
        <LocalizationProvider locale="en" dictionary={dictEn}>
          <AiRegistryManager
            initialProviders={safeProviders}
            initialModels={safeModels}
            initialAssignments={safeAssignments}
            initialPolicy={BASELINE_RUNTIME_POLICY}
            locale="en"
          />
        </LocalizationProvider>,
      );

      const modelsTab = screen.getByText(/Models & Verification \(\d+\)/);
      fireEvent.click(modelsTab);

      expect(screen.getByText(/Registered Models & Capability Verification/i)).toBeInTheDocument();
      expect(screen.getByText("BAAI/bge-m3")).toBeInTheDocument();

      const testButtons = screen.getAllByRole("button", { name: /Test/i });
      expect(testButtons.length).toBeGreaterThan(0);

      fireEvent.click(testButtons[0]!);

      await waitFor(() => {
        expect(screen.getByText("32ms")).toBeInTheDocument();
      });
    });

    it("switches to Runtime Policy tab and displays timeout and retry parameters", () => {
      render(
        <LocalizationProvider locale="en" dictionary={dictEn}>
          <AiRegistryManager
            initialProviders={safeProviders}
            initialModels={safeModels}
            initialAssignments={safeAssignments}
            initialPolicy={BASELINE_RUNTIME_POLICY}
            locale="en"
          />
        </LocalizationProvider>,
      );

      const policyTab = screen.getByText("Runtime Policy");
      fireEvent.click(policyTab);

      expect(screen.getByText(/AI Runtime Policy Configuration/i)).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(String(BASELINE_RUNTIME_POLICY.timeoutMs)),
      ).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(String(BASELINE_RUNTIME_POLICY.maxRetries)),
      ).toBeInTheDocument();
    });

    it("renders properly in Arabic locale", () => {
      render(
        <LocalizationProvider locale="ar" dictionary={dictAr}>
          <AiRegistryManager
            initialProviders={safeProviders}
            initialModels={safeModels}
            initialAssignments={safeAssignments}
            initialPolicy={BASELINE_RUNTIME_POLICY}
            locale="ar"
          />
        </LocalizationProvider>,
      );

      expect(screen.getByText("سجل مزودي ونماذج الذكاء الاصطناعي")).toBeInTheDocument();
      expect(screen.getByText("توليد المحادثة والإجابات")).toBeInTheDocument();
      expect(screen.getByText("التضمين الشعاعي")).toBeInTheDocument();
    });
  });

  describe("API Route Security Guard Verification", () => {
    it("GET /api/admin/ai/providers returns 401 when unauthenticated", async () => {
      const request = new NextRequest("http://localhost:3000/api/admin/ai/providers");
      const res = await getProvidersRoute(request);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe("Unauthorized");
    });

    it("GET /api/admin/ai/assignments returns 401 when unauthenticated", async () => {
      const request = new NextRequest("http://localhost:3000/api/admin/ai/assignments");
      const res = await getAssignmentsRoute(request);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe("Unauthorized");
    });

    it("GET /api/admin/ai/policy returns 401 when unauthenticated", async () => {
      const request = new NextRequest("http://localhost:3000/api/admin/ai/policy");
      const res = await getPolicyRoute(request);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe("Unauthorized");
    });
  });
});
