# Current State

Last updated: F027 completed.

## Current feature
F027 — BGE Reranker Adapter (DONE). Next is F028 — Context builder/dedup/budget.

## Repository state
- Branch: `feat/f027-bge-reranker-adapter`
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
- BGE Reranker Architecture implemented:
  - Contracts (`src/ai/contracts/reranker.ts`): `RerankFallbackPolicy`, `ScoreCalibrationMethod`, `RerankCandidate`, `RerankedCandidate`, `RerankOptions`, `RerankTelemetry`, `RerankResult`, `RerankerPort`, `RerankCandidateInputSchema`, and `RerankTestInputSchema`.
  - Heuristic Reranker (`src/ai/reranker/heuristic-reranker.ts`): Deterministic bilingual lexical scoring, token overlap calculation, heading/title match bonuses, exact phrase boost, and candidate threshold filtering.
  - BGE Reranker Adapter (`src/ai/reranker/bge-reranker-adapter.ts`): Cross-encoder reranker supporting TEI, OpenAI/Cohere-compatible, and Hugging Face inference endpoints, Sigmoid calibration, top-N truncation, and configurable fallback policies (`degrade_to_fused_ordering` or `fail_safely`).
  - Reranker Factory (`src/ai/reranker/factory.ts`): `getActiveRerankerAdapter` with model registry integration and decrypted secrets.
  - Admin Testing API (`app/api/admin/ai/rerank/test/route.ts`): Admin route for testing cross-encoder reranking.
  - Interactive Admin UI (`src/modules/admin/presentation/rag-pipeline-manager.tsx`): BGE Reranker card integrated into Hybrid Retrieval Playground with rank migrations and telemetry.
  - Test suites: 446 unit and integration tests passing in Vitest across 69 test suites (69/69 passing).
- Full verification passed (Prettier 100%, ESLint 0 errors/warnings, TypeScript strict 0 errors, Vitest 446/446, Next.js build clean with all 39 static & dynamic routes compiled).

## Last successful commands
- `pnpm format:check` (passed, 100% clean)
- `pnpm lint` (passed, 0 errors, 0 warnings)
- `pnpm typecheck` (passed, strict mode, 0 errors)
- `pnpm test` (passed, 446/446 tests passed across 69 suites)
- `pnpm build` (passed, all 39 static SSG and dynamic SSR routes compiled cleanly)

## Database migrations
- `drizzle/0000_great_wendell_vaughn.sql` (committed)

## Active blockers
None.

## Next action
Begin **F028 — Context builder/dedup/budget**:
1. Review `docs/ai/09_CONTEXT_BUILDER.md` and blueprint specs.
2. Create branch `feat/f028-context-builder`.
3. Define `ContextBuilderPort`, context tokens budgeting, deduplication strategy (SHA-256 and lexical/semantic similarity), per-source capping, and deterministic markdown context packing.
4. Author unit/integration tests and verify all 5 quality gates.
