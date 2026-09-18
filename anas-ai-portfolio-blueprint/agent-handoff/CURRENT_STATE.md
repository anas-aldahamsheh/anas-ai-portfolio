# Current State

Last updated: F016 completed.

## Current feature
F016 — LinkedIn profile popover (DONE). Next is F017 — Project catalog.

## Repository state
- Branch: `feat/f016-linkedin-profile-popover`
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
- LinkedIn Profile Popover & Social Architecture implemented:
  - Dynamic localization keys registered for LinkedIn title and description in Arabic and English (Rule 18: zero hardcoded strings).
  - Pure domain baseline isolation in `src/modules/social/domain/baseline.ts` (`BASELINE_LINKEDIN_PROFILE` and `BASELINE_SOCIAL_PROFILES`).
  - `SocialService` resolves LinkedIn profile with cache invalidation, fallback handling, and clone arrays to prevent shared reference mutations.
  - `LinkedInPopover` with accessible trigger, canonical URL with `dir="ltr"` protection, Clipboard API copy with feedback, `target="_blank"` safe external link, Escape/outside-click listeners, and `AdminEditProvider` / `EditableRegion` integration.
  - Integrated in both `Navbar` header controls and `Footer` brand column for complete accessibility across the platform.
- 178 unit and integration tests passing in Vitest across 33 test suites.
- Full verification passed (Prettier 100%, ESLint 0 errors/warnings, TypeScript strict 0 errors, Vitest 178/178, Next.js build clean).

## Last successful commands
- `pnpm format:check` (passed, 100% clean)
- `pnpm lint` (passed, 0 errors, 0 warnings)
- `pnpm typecheck` (passed, strict mode, 0 errors)
- `pnpm test` (passed, 178/178 tests passed across 33 suites)
- `pnpm build` (passed, all 16 static SSG and dynamic routes compiled cleanly)

## Database migrations
- `drizzle/0000_great_wendell_vaughn.sql` (committed)

## Active blockers
None.

## Next action
Begin **F017 — Project catalog**:
1. Review `docs/features/05_PROJECTS.md`, `docs/features/11_SEARCH_FILTER.md`, and `docs/features/17_FILTER_SORT_STATE.md`.
2. Inspect projects schema (`projects`, `project_translations`, `project_media`, `project_tags`, `tags`, etc.).
3. Implement dynamic project catalog with filtering (tags, domains, featured), sorting, search, pagination, and admin publishing status.
4. Ensure zero hardcoded project content (Rule 18) and clean RTL/LTR layout.
5. Add unit and integration tests for Project catalog.

## Important reminders
- Update this file before ending an agent session.
- Update `FEATURE_TRACKER.md`.
- Never claim DONE without tests meeting Definition of Done.
