# Current State

Last updated: F015 completed.

## Current feature
F015 — GitHub profile popover (DONE). Next is F016 — LinkedIn profile popover.

## Repository state
- Branch: `feat/f015-github-profile-popover`
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
- GitHub Profile Popover & Social Architecture implemented:
  - Dynamic localization keys registered for all social interactions and labels (Rule 18: zero hardcoded strings).
  - Pure domain baseline isolation in `src/modules/social/domain/baseline.ts` prevents Node.js database drivers from leaking into client-side bundles.
  - `SocialService` provides memory caching, database queries with locale translations, admin updates with audit logging, and domain baseline fallbacks.
  - REST endpoint `/api/social/[platform]` supporting public GET and guarded PATCH (admin only).
  - Accessible `GitHubPopover` with direct profile link, copy URL with feedback, Escape key listener, outside click detection, and RTL/LTR alignment.
  - Seamlessly mounted in desktop and mobile `Navbar` with optional Admin Edit overlay support.
- 170 unit and integration tests passing in Vitest across 32 test suites.
- Full verification passed (Prettier 100%, ESLint 0 errors/warnings, TypeScript strict 0 errors, Vitest 170/170, Next.js build clean).

## Last successful commands
- `pnpm format:check` (passed, 100% clean)
- `pnpm lint` (passed, 0 errors, 0 warnings)
- `pnpm typecheck` (passed, strict mode, 0 errors)
- `pnpm test` (passed, 170/170 tests passed across 32 suites)
- `pnpm build` (passed, all 16 static SSG and dynamic routes compiled cleanly)

## Database migrations
- `drizzle/0000_great_wendell_vaughn.sql` (committed)

## Active blockers
None.

## Next action
Begin **F016 — LinkedIn profile popover**:
1. Review `docs/features/07_GITHUB_LINKEDIN.md` and `docs/features/19_SOCIAL_POPOVER_UX.md`.
2. Implement LinkedIn popover reusing `SocialService`, social domain models, and `SocialIcon`.
3. Register LinkedIn localization keys in `core-system-keys.ts`.
4. Ensure zero hardcoded social URLs (Rule 18), clean RTL/LTR layout, and admin inline edit support.
5. Add unit and integration tests for LinkedIn social popover.

## Important reminders
- Update this file before ending an agent session.
- Update `FEATURE_TRACKER.md`.
- Never claim DONE without tests meeting Definition of Done.
