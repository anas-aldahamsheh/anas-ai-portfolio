# Current State

Last updated: F029 completed.

## Current feature
F029 — Grounded generation & citations (DONE). Next is F030 — Conversation language matching.

## Repository state
- Branch: `feat/f029-grounded-generation`
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
  - F029: Grounded generation & citations (DONE)
- Grounded Generation & Citation Architecture implemented:
  - Contracts (`src/ai/contracts/generation.ts`): `ConversationMode`, `ResponseLanguage`, `CitationMapping`, `CitationValidationResult`, `GroundedGenerationTelemetry`, `GroundedAnswer`, `GenerationOptions`, `GenerationInput`, `GenerationPort`, `CitationValidatorPort`, Zod validation schemas.
  - Citation Validator (`src/ai/citations/citation-validator.ts`): `stripChainOfThought` removing `<think>` reasoning tokens, `CitationValidator` parsing `[cit:ID]` and `[ID]` patterns against citation catalogs, pruning hallucinated markers, validating language consistency, and mapping verified citations.
  - Grounding Fallbacks (`src/ai/generation/grounding-fallbacks.ts`): `createInsufficientEvidenceAnswer` providing deterministic bilingual fallback when context chunks are empty with 0 API tokens and <1ms latency, `isInsufficientEvidenceText` detector.
  - Heuristic Generation Fallback (`src/ai/generation/adapters/heuristic-generation-adapter.ts`): `generateHeuristicAnswer` deterministic offline fallback synthesizer creating factual, cited answers directly from context chunks.
  - Grounded Generator Service (`src/ai/generation/grounded-generator.ts`): `GroundedGenerator` orchestrator dynamically resolving active generation model assignment from model registry, decrypting API keys from `secretsService`, rendering prompt templates via `promptService`, calling OpenAI-compatible `/chat/completions` endpoints with bounded timeout, falling back seamlessly to offline heuristic generation on network or provider errors, validating citations, and compiling structured telemetry.
  - Admin Testing API (`app/api/admin/ai/generate/test/route.ts`): Admin route for testing grounded generation.
  - Test suites: 488 unit and integration tests passing in Vitest across 78 test suites (78/78 passing).
- Full verification passed (Prettier 100%, ESLint 0 errors/warnings, TypeScript strict 0 errors, Vitest 488/488, Next.js build clean with all 41 static & dynamic routes compiled).

## Last successful commands
- `pnpm format:check` (passed, 100% clean)
- `pnpm lint` (passed, 0 errors, 0 warnings)
- `pnpm typecheck` (passed, strict mode, 0 errors)
- `pnpm test` (passed, 488/488 tests passed across 78 suites)
- `pnpm build` (passed, all 41 static SSG and dynamic SSR routes compiled cleanly)

## Database migrations
- `drizzle/0000_great_wendell_vaughn.sql` (committed)

## Active blockers
None.

## Next action
Begin **F030 — Conversation language matching**:
1. Review `docs/ai/11_LANGUAGE_RESOLUTION.md` and blueprint specs.
2. Create branch `feat/f030-conversation-language-matching`.
3. Implement deterministic script heuristic (Arabic vs Latin Unicode detection), conversation locale weak signal, language classifier fallback, and direction matching.
4. Author unit/integration tests and verify all 5 quality gates.
