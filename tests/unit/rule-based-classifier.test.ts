import { describe, it, expect } from "vitest";
import { classifyQueryRules } from "@/ai/router/rule-based-classifier";

describe("Rule-Based Query Intent Classifier (F025)", () => {
  describe("Arabic Query Classification", () => {
    it("routes profile queries correctly", () => {
      const result = classifyQueryRules("من هو أنس؟ حدثني عن خلفيته");
      expect(result.route_id).toBe("profile");
      expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    });

    it("routes project queries correctly", () => {
      const result = classifyQueryRules("ما هي أبرز مشاريع أنس في الذكاء الاصطناعي؟");
      expect(result.route_id).toBe("project");
      expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    });

    it("routes skills queries correctly", () => {
      const result = classifyQueryRules("ما هي المهارات والتقنيات التي يتقنها أنس؟");
      expect(result.route_id).toBe("skills");
      expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    });

    it("routes work experience queries correctly", () => {
      const result = classifyQueryRules("ما هو التاريخ المهني والخبرات السابقة في الشركات؟");
      expect(result.route_id).toBe("experience");
      expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    });

    it("routes certification queries correctly", () => {
      const result = classifyQueryRules("هل حصل أنس على شهادات أكاديمية أو اعتمادات مهنية؟");
      expect(result.route_id).toBe("certification");
      expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    });

    it("routes technical deep dive queries correctly", () => {
      const result = classifyQueryRules("اشرح لي معمارية الخوارزميات وتفاصيل التنفيذ");
      expect(result.route_id).toBe("technical_detail");
      expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    });

    it("routes job fit queries correctly", () => {
      const result = classifyQueryRules("هل يناسب أنس متطلبات هذه الوظيفة للتوظيف؟");
      expect(result.route_id).toBe("job_fit");
      expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    });

    it("routes CV and resume requests correctly", () => {
      const result = classifyQueryRules("أريد تحميل السيرة الذاتية بصيغة pdf");
      expect(result.route_id).toBe("cv");
      expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    });

    it("routes general greetings to broad portfolio", () => {
      const result = classifyQueryRules("مرحباً، أهلاً بك");
      expect(result.route_id).toBe("broad_portfolio");
    });
  });

  describe("English Query Classification", () => {
    it("routes profile queries correctly", () => {
      const result = classifyQueryRules("Who is Anas? Give me an introduction to his bio");
      expect(result.route_id).toBe("profile");
      expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    });

    it("routes project queries correctly", () => {
      const result = classifyQueryRules("Show me your built projects and GitHub portfolio");
      expect(result.route_id).toBe("project");
      expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    });

    it("routes skills and tech stack queries correctly", () => {
      const result = classifyQueryRules("What is your tech stack and programming skills?");
      expect(result.route_id).toBe("skills");
      expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    });

    it("routes experience queries correctly", () => {
      const result = classifyQueryRules("What is his past work history and career positions?");
      expect(result.route_id).toBe("experience");
      expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    });

    it("routes certification queries correctly", () => {
      const result = classifyQueryRules(
        "What degrees and university certifications do you possess?",
      );
      expect(result.route_id).toBe("certification");
      expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    });

    it("routes technical architecture queries correctly", () => {
      const result = classifyQueryRules("Explain the system design, benchmarks, and architecture");
      expect(result.route_id).toBe("technical_detail");
      expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    });

    it("routes job fit queries correctly", () => {
      const result = classifyQueryRules(
        "Is he a good job fit for this role? We want to hire an engineer",
      );
      expect(result.route_id).toBe("job_fit");
      expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    });

    it("routes CV requests correctly", () => {
      const result = classifyQueryRules("Where can I download your resume pdf or cv?");
      expect(result.route_id).toBe("cv");
      expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    });

    it("routes vague greetings to broad portfolio", () => {
      const result = classifyQueryRules("Hello there, what can you do?");
      expect(result.route_id).toBe("broad_portfolio");
    });
  });

  describe("Entity Hints Extraction", () => {
    it("extracts tech and role entities from query", () => {
      const result = classifyQueryRules(
        "Does Anas have experience with Next.js, Qdrant, and TypeScript as an AI Engineer?",
      );

      expect(result.entity_hints).toContain("next.js");
      expect(result.entity_hints).toContain("qdrant");
      expect(result.entity_hints).toContain("typescript");
      expect(result.entity_hints).toContain("engineer");
    });

    it("handles empty and whitespace-only queries gracefully", () => {
      const empty = classifyQueryRules("");
      expect(empty.route_id).toBe("broad_portfolio");
      expect(empty.confidence).toBe(1.0);

      const whitespace = classifyQueryRules("   \n\t  ");
      expect(whitespace.route_id).toBe("broad_portfolio");
      expect(whitespace.confidence).toBe(1.0);
    });
  });
});
