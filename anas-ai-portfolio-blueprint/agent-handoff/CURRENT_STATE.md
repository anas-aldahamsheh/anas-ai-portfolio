# Current State

Last updated: F021 completed.

## Current feature
F021 — Prompt registry & versioning (DONE). Next is F022 — RAG ingestion pipeline.

## Repository state
- Branch: `feat/f021-prompt-registry-versioning`
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
- Prompt Registry & Versioning Architecture implemented:
  - Domain & Contracts (`src/ai/contracts/prompt-registry.ts`): Typed prompt roles union, version/summary/detail models, diff types, and Zod input validation schemas.
  - Template Engine (`src/ai/prompts/prompt-template.ts`): Safe placeholder extraction (`{{var}}`, `{var}`), template interpolation, and schema validation.
  - Production Baselines (`src/ai/prompts/baseline-prompts.ts`): 7 production-grade prompt templates for `chat_system`, `query_router`, `query_rewriter`, `job_fit`, `evaluator`, `conversation_mode`, `summarizer`.
  - Diff Engine (`src/ai/prompts/prompt-diff.ts`): Computes structural differences, text modifications, and variable changes between version pairs.
  - Core Prompt Service (`src/ai/prompts/prompt-service.ts`): Authoritative database persistence on `prompts` and `promptVersions`, TTL in-memory active cache, automatic version numbering, one-click rollback, dry-run template tester, and audit logging to `auditEvents`.
  - Admin REST APIs (`app/api/admin/prompts/`): Endpoints for listing, details, new versions, rollback, diff comparison, and testing guarded by `requireAdmin`.
  - Admin UI (`src/modules/admin/presentation/prompt-registry-manager.tsx` and `app/[locale]/admin/prompts/page.tsx`): Interactive control panel with version inspection, history, one-click rollback, version drafting, diff comparison, and interactive variable tester with full RTL/LTR Arabic/English localization.
- 291 unit and integration tests passing in Vitest across 43 test suites.
- Full verification passed (Prettier 100%, ESLint 0 errors/warnings, TypeScript strict 0 errors, Vitest 291/291, Next.js build clean with all 30 static & dynamic routes compiled).

## Last successful commands
- `pnpm format:check` (passed, 100% clean)
- `pnpm lint` (passed, 0 errors, 0 warnings)
- `pnpm typecheck` (passed, strict mode, 0 errors)
- `pnpm test` (passed, 291/291 tests passed across 43 suites)
- `pnpm build` (passed, all 30 static SSG and dynamic SSR routes compiled cleanly)

## Database migrations
- `drizzle/0000_great_wendell_vaughn.sql` (committed)

## Active blockers
None.

## Next action
Begin **F022 — RAG ingestion pipeline**:
1. Review `docs/ai/01_MODULAR_RAG_OVERVIEW.md`, `docs/ai/02_INGESTION_PIPELINE.md`, and `docs/ai/03_CHUNKING.md`.
2. Implement chunking and content normalization service for projects, CV, sections, and portfolio knowledge items.
3. Build document embedding and vector/metadata indexing storage.
4. Implement sync triggers on content update and deletion.
5. Add unit and integration tests.

## Important reminders
- Update this file before ending an agent session.
- Update `FEATURE_TRACKER.md`.
- Never claim DONE without tests meeting Definition of Done.


## Important reminders
- Update this file before ending an agent session.
- Update `FEATURE_TRACKER.md`.
- Never claim DONE without tests meeting Definition of Done.
