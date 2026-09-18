# Current State

Last updated: F017 completed.

## Current feature
F017 — Project catalog (DONE). Next is F018 — Project Deep Dive.

## Repository state
- Branch: `feat/f017-project-catalog`
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
- Project Catalog & Filtering Architecture implemented:
  - Dynamic localization keys registered for all catalog titles, filter labels, sorting options, badges, and empty states (Rule 18: zero hardcoded strings).
  - Pure domain models (`Project`, `ProjectCategory`, `ProjectTag`, `ProjectFilterParams`) and baseline fallback dataset in Arabic & English.
  - `ProjectService` with TTL in-memory caching, database querying across project tables, category/tag relations, multi-criteria filtering, multi-field sorting, and audit-logged admin status updates.
  - Public `/api/projects` endpoint with cache headers and admin `/api/admin/projects/[id]/status` guarded by `requireAdmin`.
  - Presentation components: `ProjectCard` with graceful media fallback, `ProjectFilters` utilizing custom Radix UI Selects, and `ProjectCatalog` with staggered grid animation, live count, and empty state reset.
  - Public server-rendered route `app/[locale]/(public)/projects/page.tsx` with dynamic localized metadata.
- 199 unit and integration tests passing in Vitest across 35 test suites.
- Full verification passed (Prettier 100%, ESLint 0 errors/warnings, TypeScript strict 0 errors, Vitest 199/199, Next.js build clean).

## Last successful commands
- `pnpm format:check` (passed, 100% clean)
- `pnpm lint` (passed, 0 errors, 0 warnings)
- `pnpm typecheck` (passed, strict mode, 0 errors)
- `pnpm test` (passed, 199/199 tests passed across 35 suites)
- `pnpm build` (passed, all 19 static SSG and dynamic routes compiled cleanly)

## Database migrations
- `drizzle/0000_great_wendell_vaughn.sql` (committed)

## Active blockers
None.

## Next action
Begin **F018 — Project Deep Dive**:
1. Review `docs/features/09_PROJECT_DEEP_DIVE.md` and `docs/features/12_ASK_AI_PROJECT.md`.
2. Implement content-driven dynamic project detail page `app/[locale]/(public)/projects/[slug]/page.tsx`.
3. Support rich composable detail blocks (overview, problem, constraints, solution, architecture, challenges, results, evidence, media).
4. Integrate with `EditableRegion` for admin inline edits.
5. Add unit and integration tests for Project Deep Dive.

## Important reminders
- Update this file before ending an agent session.
- Update `FEATURE_TRACKER.md`.
- Never claim DONE without tests meeting Definition of Done.
