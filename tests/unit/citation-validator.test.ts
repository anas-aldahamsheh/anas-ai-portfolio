import { describe, it, expect } from "vitest";
import { CitationValidator, stripChainOfThought } from "@/ai/citations/citation-validator";
import { CitationReference } from "@/ai/contracts";

describe("CitationValidator & CoT Stripping", () => {
  const validator = new CitationValidator();

  const mockAvailableCitations: CitationReference[] = [
    {
      citationId: "proj_ai_search:c1",
      sourceId: "project-ai-search",
      sourceType: "project",
      title: "Enterprise AI Search",
      locale: "en",
      headingHierarchy: ["Architecture", "Retrieval"],
    },
    {
      citationId: "cv_experience:c2",
      sourceId: "cv-experience",
      sourceType: "cv",
      title: "Senior AI Engineer Experience",
      locale: "en",
    },
    {
      citationId: "skills_rag:c1",
      sourceId: "skills-rag",
      sourceType: "knowledge_item",
      title: "RAG & Vector Pipelines",
      locale: "ar",
    },
  ];

  it("strips reasoning tokens inside <think>...</think> tags", () => {
    const rawWithCot = `<think>
The user is asking about Anas's experience with RAG.
Let me check the context...
Found chunk proj_ai_search:c1.
I should cite it.
</think>
Anas designed an enterprise hybrid search engine [cit:proj_ai_search:c1].`;

    const cleaned = stripChainOfThought(rawWithCot);
    expect(cleaned).toBe(
      "Anas designed an enterprise hybrid search engine [cit:proj_ai_search:c1].",
    );
    expect(cleaned).not.toContain("<think>");
    expect(cleaned).not.toContain("Let me check the context");
  });

  it("extracts valid explicit [cit:ID] markers and maps metadata", () => {
    const text =
      "Anas built a high-performance RAG pipeline [cit:proj_ai_search:c1] during his tenure as a senior engineer [cit:cv_experience:c2].";

    const result = validator.validate(text, mockAvailableCitations, "en");

    expect(result.isValid).toBe(true);
    expect(result.validCitedIds).toEqual(["proj_ai_search:c1", "cv_experience:c2"]);
    expect(result.invalidCitedIds).toEqual([]);
    expect(result.missingRequiredCitations).toBe(false);
    expect(result.citations).toHaveLength(2);
    expect(result.citations[0]?.title).toBe("Enterprise AI Search");
    expect(result.citations[1]?.title).toBe("Senior AI Engineer Experience");
    expect(result.citations[0]?.occurrences).toBe(1);
  });

  it("detects and strips hallucinated/unknown citation IDs from cleanedText", () => {
    const textWithHallucination =
      "Anas implemented custom CUDA kernels [cit:hallucinated_cuda_proj] and hybrid retrieval [cit:proj_ai_search:c1].";

    const result = validator.validate(textWithHallucination, mockAvailableCitations, "en");

    expect(result.isValid).toBe(false);
    expect(result.validCitedIds).toEqual(["proj_ai_search:c1"]);
    expect(result.invalidCitedIds).toEqual(["hallucinated_cuda_proj"]);
    // Hallucinated tag should be pruned from cleanedText
    expect(result.cleanedText).not.toContain("[cit:hallucinated_cuda_proj]");
    expect(result.cleanedText).toContain("[cit:proj_ai_search:c1]");
    expect(result.warnings).toBeDefined();
    expect(result.warnings?.[0]).toContain("Hallucinated citation IDs detected and pruned");
  });

  it("matches citation by sourceId when cited as [cit:sourceId]", () => {
    const text = "Anas led engineering initiatives at top tier organizations [cit:cv-experience].";

    const result = validator.validate(text, mockAvailableCitations, "en");

    expect(result.validCitedIds).toContain("cv-experience");
    expect(result.citations[0]?.sourceId).toBe("cv-experience");
    expect(result.citations[0]?.sourceType).toBe("cv");
  });

  it("falls back to generic bracket [SOURCE_ID] when model omits 'cit:' prefix", () => {
    const text = "Anas architected vector databases [project-ai-search].";

    const result = validator.validate(text, mockAvailableCitations, "en");

    expect(result.validCitedIds).toContain("project-ai-search");
    expect(result.cleanedText).toContain("[cit:project-ai-search]");
  });

  it("flags missingRequiredCitations when evidence is available but no citations were output", () => {
    const text = "Anas has 8 years of experience building distributed systems.";

    const result = validator.validate(text, mockAvailableCitations, "en");

    expect(result.missingRequiredCitations).toBe(true);
    expect(result.warnings).toBeDefined();
    expect(result.warnings?.[0]).toContain(
      "Retrieved evidence was available, but no valid citations were generated.",
    );
  });

  it("does not flag missing citations if answer states insufficient evidence", () => {
    const insufficientText =
      "The portfolio knowledge base does not contain verified information regarding quantum computing.";

    const result = validator.validate(insufficientText, mockAvailableCitations, "en");

    expect(result.missingRequiredCitations).toBe(false);
  });

  it("validates language script consistency for Arabic responses", () => {
    const arabicText =
      "قام أنس بتطوير نظام استرجاع هجين يدعم اللغتين العربية والإنجليزية [cit:skills_rag:c1].";

    const result = validator.validate(arabicText, mockAvailableCitations, "ar");
    expect(result.languageConsistent).toBe(true);

    const englishTextForArabicReq =
      "Anas built a multilingual hybrid retrieval pipeline [cit:proj_ai_search:c1].";
    const invalidLangResult = validator.validate(
      englishTextForArabicReq,
      mockAvailableCitations,
      "ar",
    );
    expect(invalidLangResult.languageConsistent).toBe(false);
  });
});
