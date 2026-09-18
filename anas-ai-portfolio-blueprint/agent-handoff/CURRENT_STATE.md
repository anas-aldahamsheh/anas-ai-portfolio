# Current State

Last updated: F014 completed.

## Current feature
F014 — CV viewer/download/versioning (DONE). Next is F015 — GitHub profile popover.

## Repository state
- Branch: `feat/f014-cv-viewer-download-versioning`
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
- CV Viewer, Download & Versioning System architecture implemented:
  - Dynamic localization keys registered for all CV labels, badges, and admin controls (Rule 18: zero hardcoded strings).
  - Strict PDF binary validation via magic bytes (`%PDF-`) and 10MB limit enforcement.
  - `CvStorageService` provides memory caching and filesystem persistence for fast binary delivery.
  - `CvService` manages versioning, publishing, rollback, audit logging into `audit_events`, and in-memory TTL caching.
  - Public streaming route `GET /api/cv/download` with cache headers, inline/attachment disposition.
  - Admin management route `app/api/admin/cv/route.ts` guarded by `requireAdmin`.
  - Responsive `CvViewer` with high-fidelity desktop `<object>` embed and mobile `<CvFallbackCard>` preventing miniature iframe trapping.
  - Integrated with `EditableRegion` and `CvAdminControls` when admin inline edit mode is active.
- 158 unit and integration tests passing in Vitest across 30 test suites.
- Full verification passed (Prettier, ESLint, TypeScript strict, Vitest, Next.js build).

## Last successful commands
- `pnpm format:check` (passed, 100% clean)
- `pnpm lint` (passed, 0 errors, 0 warnings)
- `pnpm typecheck` (passed, strict mode, 0 errors)
- `pnpm test` (passed, 158/158 tests passed)
- `pnpm build` (passed, all static SSG and dynamic routes compiled cleanly)

## Database migrations
- `drizzle/0000_great_wendell_vaughn.sql` (committed)

## Active blockers
None.

## Next action
Begin **F015 — GitHub profile popover**:
1. Review `docs/features/07_GITHUB_LINKEDIN.md` and `docs/features/19_SOCIAL_POPOVER_UX.md`.
2. Implement dynamic GitHub account card/popover with copy/open actions, live metadata, and admin management.
3. Ensure zero hardcoded social URLs (Rule 18) and clean RTL/LTR layout.
4. Add unit and integration tests for GitHub social popover.

## Important reminders
- Update this file before ending an agent session.
- Update `FEATURE_TRACKER.md`.
- Never claim DONE without tests meeting Definition of Done.
