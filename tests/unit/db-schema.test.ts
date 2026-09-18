import { describe, it, expect } from "vitest";
import * as schema from "@/lib/db/schema";
import { getTableColumns } from "drizzle-orm";

describe("Database Schema Foundation (F002)", () => {
  it("exports all required identity tables", () => {
    expect(schema.users).toBeDefined();
    expect(schema.sessions).toBeDefined();
    expect(schema.accounts).toBeDefined();
    expect(schema.verifications).toBeDefined();
    expect(schema.userRoles).toBeDefined();
    expect(schema.roleEnum.enumValues).toEqual(["GUEST", "USER", "ADMIN"]);
  });

  it("exports all required localization tables", () => {
    expect(schema.locales).toBeDefined();
    expect(schema.uiTextKeys).toBeDefined();
    expect(schema.uiTextTranslations).toBeDefined();
  });

  it("exports all required CMS and dynamic section tables", () => {
    expect(schema.pages).toBeDefined();
    expect(schema.pageTranslations).toBeDefined();
    expect(schema.sections).toBeDefined();
    expect(schema.sectionTranslations).toBeDefined();
    expect(schema.sectionBlocks).toBeDefined();
    expect(schema.sectionBlockTranslations).toBeDefined();
    expect(schema.publishRevisions).toBeDefined();
    expect(schema.publishStatusEnum.enumValues).toEqual(["DRAFT", "PUBLISHED", "ARCHIVED"]);
  });

  it("exports all required project and deep dive tables", () => {
    expect(schema.projects).toBeDefined();
    expect(schema.projectTranslations).toBeDefined();
    expect(schema.projectCategories).toBeDefined();
    expect(schema.projectCategoryLinks).toBeDefined();
    expect(schema.projectTags).toBeDefined();
    expect(schema.projectTagLinks).toBeDefined();
    expect(schema.projectBlocks).toBeDefined();
    expect(schema.projectBlockTranslations).toBeDefined();
    expect(schema.projectLinks).toBeDefined();
    expect(schema.projectMedia).toBeDefined();
  });

  it("exports all required CV and social tables", () => {
    expect(schema.cvVersions).toBeDefined();
    expect(schema.cvPublications).toBeDefined();
    expect(schema.socialProfiles).toBeDefined();
    expect(schema.socialProfileTranslations).toBeDefined();
  });

  it("exports all required AI control plane and RAG tables", () => {
    expect(schema.aiProviders).toBeDefined();
    expect(schema.aiModels).toBeDefined();
    expect(schema.aiModelAssignments).toBeDefined();
    expect(schema.aiRuntimePolicies).toBeDefined();
    expect(schema.prompts).toBeDefined();
    expect(schema.promptVersions).toBeDefined();
    expect(schema.ragConfigurations).toBeDefined();
    expect(schema.ragIndexVersions).toBeDefined();
    expect(schema.ingestionJobs).toBeDefined();
    expect(schema.sourceDocuments).toBeDefined();
    expect(schema.sourceChunks).toBeDefined();
    expect(schema.conversationModes).toBeDefined();
  });

  it("exports all required evaluation and admin control plane tables", () => {
    expect(schema.evaluationDatasets).toBeDefined();
    expect(schema.evaluationCases).toBeDefined();
    expect(schema.evaluationRuns).toBeDefined();
    expect(schema.evaluationResults).toBeDefined();
    expect(schema.evaluationMetrics).toBeDefined();
    expect(schema.featureFlags).toBeDefined();
    expect(schema.themeConfigurations).toBeDefined();
    expect(schema.auditEvents).toBeDefined();
    expect(schema.systemSettings).toBeDefined();
    expect(schema.secretReferences).toBeDefined();
  });

  it("ensures key columns have UUID defaults and proper types", () => {
    const userCols = getTableColumns(schema.users);
    expect(userCols.id.dataType).toBe("string"); // uuid
    expect(userCols.email.notNull).toBe(true);

    const projectCols = getTableColumns(schema.projects);
    expect(projectCols.id.dataType).toBe("string");
    expect(projectCols.slug.notNull).toBe(true);

    const cvPubCols = getTableColumns(schema.cvPublications);
    expect(cvPubCols.isCurrent.dataType).toBe("boolean");
  });
});
