# Current State

Last updated: F004 completed.

## Current feature
F004 — RBAC & admin protection (DONE).
Next: F005 — Guest-first public access (PENDING).

## Repository state
- Branch: `feat/f004-rbac-admin-protection`
- Last commit: `4d10a34`
- Completed features:
  - F001: Foundation & repository quality (DONE)
  - F002: Database & migrations (DONE)
  - F003: Authentication (DONE)
  - F004: RBAC & admin protection (DONE)
- Better Auth setup complete with Drizzle PostgreSQL adapter (`users`, `sessions`, `accounts`, `verifications`).
- Role-based access control implemented (`GUEST`, `USER`, `ADMIN`) with server-enforced deny-by-default checks (`requireUser`, `requireAdmin`).
- Admin route protection active in `app/[locale]/admin/layout.tsx` (redirects unauthenticated to sign-in, denies non-admin users) and admin API route `app/api/admin/guard-check/route.ts`.
- Admin bootstrap CLI tool in `scripts/bootstrap-admin/index.ts` with immutable audit logging.
- 36 unit and integration tests passing in Vitest across 8 test suites.
- Full verification passed (Prettier, ESLint, TypeScript strict, Vitest, Next.js build).

## Last successful commands
- `pnpm format:check` (passed)
- `pnpm lint` (passed, 0 errors, 0 warnings)
- `pnpm typecheck` (passed, strict mode, 0 errors)
- `pnpm test` (passed, 36/36 tests passed)
- `pnpm build` (passed, all routes compiled cleanly)

## Database migrations
- `drizzle/0000_great_wendell_vaughn.sql` (committed)

## Active blockers
None.

## Next action
Begin **F005 — Guest-first public access**:
1. Review `docs/features/01_GUEST_ACCESS.md` and `MASTER_BUILD_SPEC.md` Section 3.
2. Ensure every public feature (projects, deep dives, CV viewer/download, AI assistant, Job Fit Analyzer) functions without login, maintaining GUEST request context and zero forced auth walls.
3. Prepare implementation plan for F005.

## Important reminders
- Update this file before ending an agent session.
- Update `FEATURE_TRACKER.md`.
- Never claim DONE without tests meeting Definition of Done.

