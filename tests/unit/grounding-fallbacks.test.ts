import { describe, it, expect } from "vitest";
import {
  createInsufficientEvidenceAnswer,
  isInsufficientEvidenceText,
  INSUFFICIENT_EVIDENCE_RESPONSES,
} from "@/ai/generation/grounding-fallbacks";

describe("Grounding Fallbacks & Insufficient Evidence Guardrails", () => {
  it("creates English insufficient evidence answer with zero tokens and clean validation", () => {
    const answer = createInsufficientEvidenceAnswer("en", "general");

    expect(answer.hasInsufficientEvidence).toBe(true);
    expect(answer.language).toBe("en");
    expect(answer.conversationMode).toBe("general");
    expect(answer.content).toBe(INSUFFICIENT_EVIDENCE_RESPONSES.en);
    expect(answer.citations).toEqual([]);
    expect(answer.validation.isValid).toBe(true);
    expect(answer.validation.missingRequiredCitations).toBe(false);
    expect(answer.telemetry.strategy).toBe("insufficient_evidence");
    expect(answer.telemetry.promptTokens).toBe(0);
  });

  it("creates Arabic insufficient evidence answer with Arabic text", () => {
    const answer = createInsufficientEvidenceAnswer("ar", "technical");

    expect(answer.hasInsufficientEvidence).toBe(true);
    expect(answer.language).toBe("ar");
    expect(answer.conversationMode).toBe("technical");
    expect(answer.content).toBe(INSUFFICIENT_EVIDENCE_RESPONSES.ar);
    expect(answer.citations).toEqual([]);
    expect(answer.validation.languageConsistent).toBe(true);
  });

  it("correctly identifies insufficient evidence phrases in English and Arabic", () => {
    expect(
      isInsufficientEvidenceText(
        "The portfolio knowledge base does not contain verified information about this topic.",
      ),
    ).toBe(true);

    expect(
      isInsufficientEvidenceText(
        "There is insufficient verified evidence in the portfolio to answer.",
      ),
    ).toBe(true);

    expect(
      isInsufficientEvidenceText("لا تحتوي قاعدة معارف ملف الأعمال على معلومات موثقة كافية"),
    ).toBe(true);

    expect(
      isInsufficientEvidenceText(
        "Anas implemented a hybrid retrieval engine with dense vectors and BM25.",
      ),
    ).toBe(false);
  });
});
