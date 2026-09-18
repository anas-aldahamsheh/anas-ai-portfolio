import { describe, it, expect } from "vitest";
import { QueryRouter } from "@/ai/router/query-router";
import { RouterOutputSchema } from "@/ai/contracts/router";

describe("QueryRouter Service (F025)", () => {
  const router = new QueryRouter();

  it("routes queries and binds valid retrieval policy and output schema", async () => {
    const output = await router.route("Show me all AI projects and applications");

    // Output strictly conforms to RouterOutputSchema
    const validated = RouterOutputSchema.safeParse(output);
    expect(validated.success).toBe(true);

    expect(output.route_id).toBe("project");
    expect(output.confidence).toBeGreaterThan(0.5);
    expect(output.needs_rewrite).toBe(true);
    expect(output.retrieval_policy_id).toBe("policy-project");

    // Attached policy verification
    expect(output.policy).toBeDefined();
    expect(output.policy?.id).toBe("policy-project");
    expect(output.policy?.sourceTypes).toEqual(["project"]);
    expect(output.policy?.denseEnabled).toBe(true);
  });

  it("routes CV queries with needs_rewrite: false", async () => {
    const output = await router.route("I want to download his resume pdf and CV");

    expect(output.route_id).toBe("cv");
    expect(output.needs_rewrite).toBe(false);
    expect(output.retrieval_policy_id).toBe("policy-cv-experience");
    expect(output.policy?.sourceTypes).toEqual(["cv"]);
  });

  it("supports forced route override", async () => {
    const output = await router.route("Generic text", { forceRouteId: "skills" });

    expect(output.route_id).toBe("skills");
    expect(output.confidence).toBe(1.0);
    expect(output.retrieval_policy_id).toBe("policy-skills");
    expect(output.policy?.id).toBe("policy-skills");
  });

  it("falls back to broad portfolio when confidence is below minimum threshold", async () => {
    const customRouter = new QueryRouter({
      classifier: () => ({
        route_id: "skills",
        confidence: 0.2, // Below 0.5 threshold
        entity_hints: [],
        matched_keywords: [],
      }),
    });

    const output = await customRouter.route("Uncertain query", { minConfidenceThreshold: 0.5 });
    expect(output.route_id).toBe("broad_portfolio");
    expect(output.retrieval_policy_id).toBe("policy-broad");
    expect(output.policy?.isDefault).toBe(true);
  });

  it("handles classifier exception gracefully and falls back to broad portfolio", async () => {
    const failingRouter = new QueryRouter({
      classifier: () => {
        throw new Error("Classifier crashed unexpectedly");
      },
    });

    const output = await failingRouter.route("Any query");
    expect(output.route_id).toBe("broad_portfolio");
    expect(output.confidence).toBe(0.5);
    expect(output.retrieval_policy_id).toBe("policy-broad");
    expect(output.policy?.id).toBe("policy-broad");
  });
});
