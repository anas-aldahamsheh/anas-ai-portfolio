# Current State

Last updated: F018 completed.

## Current feature
F018 — Project Deep Dive (DONE). Next is F019 — AI provider/model registry.

## Repository state
- Branch: `feat/f018-project-deep-dive`
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
- Project Deep Dive Architecture implemented:
  - Dynamic localization keys registered for all narrative section headers, tech stack, scoped AI retrieval badge, prompt suggestions, and 404 text in Arabic & English (Rule 18: zero hardcoded strings).
  - Enriched domain models with `problem`, `constraints`, `solution`, `architecture`, `implementation`, `challenges`, `decisionsTradeoffs`, and `results`.
  - Rich bilingual baseline dataset in `src/modules/projects/domain/baseline.ts` with authentic technical engineering details.
  - `ProjectService` updated with narrative fields querying and `getRelatedProjects(slug, locale, limit)`.
  - `ProjectDeepDive` presentation component strictly omitting empty sections to avoid broken empty headings, providing scoped "Ask AI About This Project" affordance linking to `/chat?project=${slug}&projectId=${id}`, related projects grid, and admin `EditableRegion` wrappers.
  - Dynamic server-rendered route `app/[locale]/(public)/projects/[slug]/page.tsx` with dynamic localized metadata and `notFound()` handling.
- 208 unit and integration tests passing in Vitest across 36 test suites.
- Full verification passed (Prettier 100%, ESLint 0 errors/warnings, TypeScript strict 0 errors, Vitest 208/208, Next.js build clean with `/[locale]/projects/[slug]` route).

## Last successful commands
- `pnpm format:check` (passed, 100% clean)
- `pnpm lint` (passed, 0 errors, 0 warnings)
- `pnpm typecheck` (passed, strict mode, 0 errors)
- `pnpm test` (passed, 208/208 tests passed across 36 suites)
- `pnpm build` (passed, all static SSG and dynamic SSR routes compiled cleanly)

## Database migrations
- `drizzle/0000_great_wendell_vaughn.sql` (committed)

## Active blockers
None.

## Next action
Begin **F019 — AI provider/model registry**:
1. Review `docs/ai/` and `docs/admin/` blueprints.
2. Implement AI provider schema and repository for generation, embedding, and reranker models.
3. Implement admin AI provider registry management service and endpoints.
4. Support active provider/model selection, fallback ordering, and status management.
5. Create unit/integration tests and run all quality gates.

## Important reminders
- Update this file before ending an agent session.
- Update `FEATURE_TRACKER.md`.
- Never claim DONE without tests meeting Definition of Done.
