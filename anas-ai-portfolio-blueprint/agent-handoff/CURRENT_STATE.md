# Current State

Last updated: F028 completed.

## Current feature
F028 — Context builder/dedup/budget (DONE). Next is F029 — Grounded generation & citations.

## Repository state
- Branch: `feat/f028-context-builder`
- Last commit: Pending commit
- Completed features:
  - F001: Foundation & repository quality (DONE)
  - F002: Database & migrations (DONE)
  - F003: Authentication (DONE)
  - F004: RBAC & admin protection (DONE)
  - F005: Guest-first public access (DONE)
  - F006: Dynamic localization registry (DONE)
  - F007: Automatic RTL/LTR system (DONE)
  - F008: Light/dark theme (DONE)
  - F009: Design system & custom Select (DONE)
  - F010: Motion system (DONE)
  - F011: Dynamic navigation/footer (DONE)
  - F012: Dynamic section builder (DONE)
  - F013: Global admin inline edit mode (DONE)
  - F014: CV viewer/download/versioning (DONE)
  - F015: GitHub profile popover (DONE)
  - F016: LinkedIn profile popover (DONE)
  - F017: Project catalog (DONE)
  - F018: Project Deep Dive (DONE)
  - F019: AI provider/model registry (DONE)
  - F020: Secrets management (DONE)
  - F021: Prompt registry & versioning (DONE)
  - F022: RAG ingestion pipeline (DONE)
  - F023: BGE-M3 embedding adapter (DONE)
  - F024: Hybrid retrieval (DONE)
  - F025: Query Router (DONE)
  - F026: Query Rewriting (DONE)
  - F027: BGE Reranker Adapter (DONE)
  - F028: Context builder/dedup/budget (DONE)
- Context Builder Architecture implemented:
  - Contracts (`src/ai/contracts/context-builder.ts`): `ContextInputCandidate`, `CitationReference`, `ContextChunk`, `ContextBuilderOptions`, `ContextBuilderTelemetry`, `ContextBuilderResult`, `ContextBuilderPort`, `ContextBuilderOptionsSchema`, and `ContextBuilderTestInputSchema`.
  - Deduplicator (`src/ai/context/deduplicator.ts`): `extractTokenShingles`, `computeJaccardSimilarity`, `isNearDuplicate` catching exact hash duplicates and sliding-window / near-identical sentences across English and Arabic.
  - Token Budgeter (`src/ai/context/token-budgeter.ts`): `estimateTokenCount` with calibrated English and Arabic word/character ratios, and `TokenBudgeter` managing cumulative budget allocations.
  - Security Delimiters (`src/ai/context/security-delimiters.ts`): `sanitizeContextContent` escaping breakout tags, and `formatRetrievedContext` packaging evidence into XML delimiters `<retrieved_context>` ... `<source id="..." ...>`.
  - Context Builder Service (`src/ai/context/context-builder.ts`): `ContextBuilder` implementing `ContextBuilderPort`, dynamically querying RAG configuration `contextTokenBudget`, prioritizing reranked scores, enforcing `perSourceCap`, deduplicating overlapping chunks, strictly packing within token limits, and preserving citation references.
  - Admin Testing API (`app/api/admin/ai/context/test/route.ts`): Admin route for testing context packing.
  - Test suites: 468 unit and integration tests passing in Vitest across 74 test suites (74/74 passing).
- Full verification passed (Prettier 100%, ESLint 0 errors/warnings, TypeScript strict 0 errors, Vitest 468/468, Next.js build clean with all 40 static & dynamic routes compiled).

## Last successful commands
- `pnpm format:check` (passed, 100% clean)
- `pnpm lint` (passed, 0 errors, 0 warnings)
- `pnpm typecheck` (passed, strict mode, 0 errors)
- `pnpm test` (passed, 468/468 tests passed across 74 suites)
- `pnpm build` (passed, all 40 static SSG and dynamic SSR routes compiled cleanly)

## Database migrations
- `drizzle/0000_great_wendell_vaughn.sql` (committed)

## Active blockers
None.

## Next action
Begin **F029 — Grounded generation & citations**:
1. Review `docs/ai/10_GENERATION_AND_CITATIONS.md` and blueprint specs.
2. Create branch `feat/f029-grounded-generation`.
3. Define `GenerationPort`, `CitationValidatorPort`, generation options, citation parsing schemas, and grounding fallback when context is insufficient.
4. Author unit/integration tests and verify all 5 quality gates.
