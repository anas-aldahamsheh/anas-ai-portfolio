# Current State

Last updated: F024 completed.

## Current feature
F024 — Hybrid retrieval (DONE). Next is F025 — Query Router.

## Repository state
- Branch: `feat/f024-hybrid-retrieval`
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
- Hybrid Retrieval Architecture implemented:
  - Retrieval Contracts (`src/ai/contracts/retrieval.ts`): Typed ports for `DenseRetrieverPort`, `SparseRetrieverPort`, `FusionStrategyPort`, `RetrievalFilter`, `RetrievalQuery`, `ScoredCandidate`, `HybridRetrievalOptions`, `RetrievalTelemetry`, `HybridRetrievalResult`, and `HybridSearchSchema`.
  - Scoped Filter Builder (`src/ai/retrieval/filters/filter-builder.ts`): Multi-value vector store search filters and in-memory evaluators for project scopes, CV, sections, and tags.
  - Dense Vector Retriever (`src/ai/retrieval/dense/dense-retriever.ts`): Cosine similarity search over Qdrant collections with dynamic active embedding adapter and metadata projection.
  - Multilingual BM25 Tokenizer & Scorer (`src/ai/retrieval/sparse/arabic-bm25-tokenizer.ts`): Unicode NFKC, Arabic diacritic stripping, tatweel removal, Alef/Teh Marbuta/Alef Maksura normalization, bilingual stopword filtering, and Okapi BM25 scoring.
  - Sparse Retriever (`src/ai/retrieval/sparse/sparse-retriever.ts`): BM25 lexical retriever querying relational chunk database with zero-crash fallback to vector store points.
  - Reciprocal Rank Fusion (`src/ai/retrieval/fusion/rrf-fusion.ts`): Standard RRF fusion ($RRF(d) = \sum \frac{1}{k + rank}$) with configurable $k=60$ default, candidate capping, and comparative Linear Score Fusion.
  - Hybrid Retrieval Orchestrator (`src/ai/retrieval/hybrid/hybrid-retriever.ts`): Concurrent execution of dense and sparse searches via `Promise.all`, RRF fusion, candidate ranking, and latency telemetry.
  - Admin RAG Search API & UI:
    - Admin search endpoint `app/api/admin/rag/search/route.ts` with strict RBAC.
    - Interactive "Hybrid Retrieval Playground" card in `src/modules/admin/presentation/rag-pipeline-manager.tsx`.
  - Test suites: 382 unit and integration tests passing in Vitest across 59 test suites (59/59 passing).
- Full verification passed (Prettier 100%, ESLint 0 errors/warnings, TypeScript strict 0 errors, Vitest 382/382, Next.js build clean with all 36 static & dynamic routes compiled).

## Last successful commands
- `pnpm format:check` (passed, 100% clean)
- `pnpm lint` (passed, 0 errors, 0 warnings)
- `pnpm typecheck` (passed, strict mode, 0 errors)
- `pnpm test` (passed, 382/382 tests passed across 59 suites)
- `pnpm build` (passed, all 36 static SSG and dynamic SSR routes compiled cleanly)

## Database migrations
- `drizzle/0000_great_wendell_vaughn.sql` (committed)

## Active blockers
None.

## Next action
Begin **F025 — Query Router**:
1. Review `docs/ai/06_QUERY_ROUTER.md`.
2. Define `QueryRouterPort`, intent types (greeting, general portfolio, specific project, recruiter/skills, contact, out-of-scope), retrieval scope policies, and confidence scores.
3. Implement fast rule-based classifier + lightweight LLM router using active router model from registry.
4. Implement scoped retrieval policy mapping.
5. Create tests and verify quality gates.
