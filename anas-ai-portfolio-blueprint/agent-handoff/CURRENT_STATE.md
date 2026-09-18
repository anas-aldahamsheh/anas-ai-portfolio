# Current State

Last updated: F026 completed.

## Current feature
F026 — Query Rewriting (DONE). Next is F027 — BGE Reranker Adapter.

## Repository state
- Branch: `feat/f026-query-rewriting`
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
- Query Rewriting Architecture implemented:
  - Contracts (`src/ai/contracts/query-rewriter.ts`): `QueryRewriteInput`, `QueryRewriteOptions`, `QueryRewriteResult`, `QueryRewriterPort`, `RewriteQueriesSchema`, and `RewriteTestInputSchema`.
  - Heuristic Rewriter (`src/ai/query-rewrite/heuristic-rewriter.ts`): Deterministic multilingual heuristic rewriter with entity hint expansion, portfolio scope expansion, Arabic diacritic normalization, and stopword cleaning.
  - Query Rewriter Service (`src/ai/query-rewrite/query-rewriter.ts`): Orchestrator resolving active rewrite model assignment from model registry, rendering prompt from prompt registry, performing OpenAI-compatible bounded completions with retry/timeout, safely parsing JSON query arrays, and seamlessly falling back to heuristic expansion on any failure.
  - Admin Testing API (`app/api/admin/ai/rewrite/test/route.ts`): Admin route for testing query rewriting.
  - Test suites: 425 unit and integration tests passing in Vitest across 65 test suites (65/65 passing).
- Full verification passed (Prettier 100%, ESLint 0 errors/warnings, TypeScript strict 0 errors, Vitest 425/425, Next.js build clean with all 38 static & dynamic routes compiled).

## Last successful commands
- `pnpm format:check` (passed, 100% clean)
- `pnpm lint` (passed, 0 errors, 0 warnings)
- `pnpm typecheck` (passed, strict mode, 0 errors)
- `pnpm test` (passed, 425/425 tests passed across 65 suites)
- `pnpm build` (passed, all 38 static SSG and dynamic SSR routes compiled cleanly)

## Database migrations
- `drizzle/0000_great_wendell_vaughn.sql` (committed)

## Active blockers
None.

## Next action
Begin **F027 — BGE Reranker Adapter**:
1. Review `docs/ai/08_RERANKER_BGE_V2_M3.md` and blueprint specs.
2. Create branch `feat/f027-bge-reranker-adapter`.
3. Define `RerankerPort`, `RerankInput`, `RerankResult`, and calibration thresholds.
4. Implement BGE reranker adapter supporting TEI / HuggingFace Inference API / local endpoint with bounded timeouts and score normalization.
5. Author unit/integration tests and verify quality gates.
