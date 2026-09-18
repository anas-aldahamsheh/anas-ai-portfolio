# Current State

Last updated: F025 completed.

## Current feature
F025 — Query Router (DONE). Next is F026 — Query Rewriting.

## Repository state
- Branch: `feat/f025-query-router`
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
- Query Router Architecture implemented:
  - Contracts (`src/ai/contracts/router.ts`): `RouteId` (`profile`, `project`, `skills`, `experience`, `certification`, `technical_detail`, `job_fit`, `cv`, `broad_portfolio`), `RetrievalPolicy`, `QueryRouteDefinition`, `RouterOutput`, `QueryRouterPort`, and `RouterOutputSchema`.
  - Baseline Configs (`src/ai/router/baseline-routes.ts`): Semantic route catalog with bilingual Arabic and English keyword markers, default broad policy fallback, and scope mappings.
  - Rule-Based Intent Classifier (`src/ai/router/rule-based-classifier.ts`): High-speed regex & keyword classification supporting Arabic diacritic normalization, tatweel removal, and entity hint extraction.
  - Query Router Service (`src/ai/router/query-router.ts`): Orchestrator implementing `QueryRouterPort`, output validation with `RouterOutputSchema`, and guaranteed fallback to `broad_portfolio` on uncertainty.
  - Admin Testing API (`app/api/admin/ai/router/test/route.ts`): Admin route for testing intent classification and policy assignment.
  - Test suites: 411 unit and integration tests passing in Vitest across 62 test suites (62/62 passing).
- Full verification passed (Prettier 100%, ESLint 0 errors/warnings, TypeScript strict 0 errors, Vitest 411/411, Next.js build clean with all 37 static & dynamic routes compiled).

## Last successful commands
- `pnpm format:check` (passed, 100% clean)
- `pnpm lint` (passed, 0 errors, 0 warnings)
- `pnpm typecheck` (passed, strict mode, 0 errors)
- `pnpm test` (passed, 411/411 tests passed across 62 suites)
- `pnpm build` (passed, all 37 static SSG and dynamic SSR routes compiled cleanly)

## Database migrations
- `drizzle/0000_great_wendell_vaughn.sql` (committed)

## Active blockers
None.

## Next action
Begin **F026 — Query Rewriting**:
1. Review `docs/ai/07_QUERY_REWRITING.md`.
2. Define `QueryRewriterPort`, rewrite options (max queries, temperature, multi-query expansion, language preservation).
3. Implement query rewriting adapter leveraging the active rewrite model assignment from model registry.
4. Support both Arabic and English multi-query generation with fallback to original query if rewriter fails or is disabled.
5. Author unit and integration tests and verify quality gates.
