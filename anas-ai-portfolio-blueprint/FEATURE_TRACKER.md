# Feature Tracker

This file is the single progress source of truth.

## State rules

- Only one feature per implementation workstream should normally be `IN_PROGRESS`.
- `DONE` requires Definition of Done.
- `BLOCKED` requires a blocker note and exact unblock condition.
- Keep evidence in the Notes/Evidence section.

| ID | Feature | Area | Status | Definition |
|---|---|---|---|---|
| F001 | Foundation & repository quality | Core | **DONE** | Initialize Next.js, strict TypeScript, lint/format/test/build scripts, env validation and CI baseline. |
| F002 | Database & migrations | Data | **DONE** | PostgreSQL/Drizzle schema foundation, migration workflow and constraints. |
| F003 | Authentication | Auth | **DONE** | Sign-up, sign-in, secure sessions, verification-ready flows. |
| F004 | RBAC & admin protection | Auth | **DONE** | USER/ADMIN roles, deny-by-default server authorization. |
| F005 | Guest-first public access | Core | **DONE** | Every public portfolio feature works without authentication. |
| F006 | Dynamic localization registry | Frontend/Data | **DONE** | Database-backed Arabic/English UI text with no hardcoded portfolio labels. |
| F007 | Automatic RTL/LTR system | Frontend | **DONE** | Correct direction across all layouts, content, overlays, forms and chat. |
| F008 | Light/dark theme | Frontend | **DONE** | System-aware theme plus persistent user/guest override. |
| F009 | Design system & custom Select | Frontend | **DONE** | Minimal design primitives; all dropdowns styled and accessible. |
| F010 | Motion system | Frontend | **DONE** | Subtle reusable animations respecting reduced-motion. |
| F011 | Dynamic navigation/footer | Content | **DONE** | Admin-managed navigation, footer and visibility/order. |
| F012 | Dynamic section builder | Content | **DONE** | Admin can create/delete/reorder sections using composable blocks. |
| F013 | Global admin inline edit mode | Admin | **DONE** | Edit affordance adjacent to dynamic elements for admins only. |
| F014 | CV viewer/download/versioning | Feature | **DONE** | Public CV page, viewer/download, admin upload/publish history. |
| F015 | GitHub profile popover | Feature | **DONE** | Dynamic GitHub account card with copy/open actions. |
| F016 | LinkedIn profile popover | Feature | **DONE** | Dynamic LinkedIn account card with copy/open actions. |
| F017 | Project catalog | Feature | **DONE** | Dynamic projects, filters/tags/order/publishing. |
| F018 | Project Deep Dive | Feature | **DONE** | Block-based rich project detail pages. |
| F019 | AI provider/model registry | AI/Admin | **DONE** | Admin manages generation/embedding/reranker providers/models/endpoints. |
| F020 | Secrets management | Security/Admin | **DONE** | Safe encrypted API credential management and redaction. |
| F021 | Prompt registry & versioning | AI/Admin | **DONE** | Admin-editable prompt versions with rollback. |
| F022 | RAG ingestion pipeline | AI | **DONE** | Normalize, chunk, embed, metadata, index, update/delete sync. |
| F023 | BGE-M3 embedding adapter | AI | **DONE** | Default multilingual embedding integration behind provider interface. |
| F024 | Hybrid retrieval | AI | **DONE** | Dense + sparse retrieval, metadata filtering and fusion. |
| F025 | Query Router | AI | **DONE** | Route intent/scope to relevant retrieval policy. |
| F026 | Query Rewriting | AI | **PENDING** | Configurable multilingual multi-query rewriting. |
| F027 | BGE reranker adapter | AI | **PENDING** | Default multilingual reranking adapter. |
| F028 | Context builder/dedup/budget | AI | **PENDING** | Deterministic context packing and token budget. |
| F029 | Grounded generation & citations | AI | **PENDING** | Evidence-bound answers, source mapping and citation validation. |
| F030 | Conversation language matching | AI/Frontend | **PENDING** | Assistant replies in user's conversational language. |
| F031 | Portfolio AI Chat | Feature | **PENDING** | Public streaming chatbot with citations. |
| F032 | Conversation Mode | Feature | **PENDING** | General / Recruiter / Technical modes. |
| F033 | Ask AI About This Project | Feature | **PENDING** | Hard project scope retrieval filter. |
| F034 | Job Fit Analyzer | Feature | **PENDING** | Maps pasted JD requirements to verified portfolio evidence. |
| F035 | AI Lab | Feature | **PENDING** | Public interactive AI demonstrations configured from admin. |
| F036 | RAG Debug View | Feature | **PENDING** | Safe retrieval telemetry without chain-of-thought. |
| F037 | Evaluation Dashboard | Feature | **PENDING** | Public/admin metrics for retrieval/generation quality. |
| F038 | AI evaluation runner | AI | **PENDING** | Dataset-driven regression evaluation. |
| F039 | Admin content center | Admin | **PENDING** | Manage pages, sections, blocks, projects and publishing. |
| F040 | Admin AI control center | Admin | **PENDING** | Full RAG/model/prompt/API configuration UI. |
| F041 | Audit log | Admin/Security | **PENDING** | Immutable-style audit events for sensitive changes. |
| F042 | Feature flags | Ops/Admin | **PENDING** | Controlled rollout of risky features. |
| F043 | Caching & invalidation | Performance | **PENDING** | Tag/key-based cache strategy with correct invalidation. |
| F044 | Rate limiting & abuse protection | Security | **PENDING** | Chat/auth/job-fit/admin rate limits. |
| F045 | Observability | Ops | **PENDING** | Structured logs, request IDs, metrics, tracing, errors. |
| F046 | Health/readiness endpoints | Ops | **PENDING** | Operational health checks without leaking secrets. |
| F047 | Accessibility compliance | Frontend/QA | **PENDING** | Keyboard, focus, semantics, screen-reader, contrast, Axe. |
| F048 | Responsive behavior | Frontend/QA | **PENDING** | Phone/tablet/desktop layouts in ar/en and dark/light. |
| F049 | Security test pass | Security/QA | **PENDING** | OWASP-oriented checks, authz, upload validation, injection defense. |
| F050 | Production deployment & rollback | Ops | **PENDING** | Reproducible deployment, migrations, smoke tests and rollback. |

#### F001 — Foundation & repository quality
- Status: DONE
- Commit/PR: `cda31a16b6d14eebb866b7d83ad838ded625a1c8`
- Main paths:
  - `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `postcss.config.mjs`
  - `src/lib/config/env.ts`, `.env.example`
  - `src/lib/observability/logger.ts`
  - `app/[locale]/layout.tsx`, `app/[locale]/(public)/page.tsx`, `app/page.tsx`
  - `app/api/health/route.ts`, `app/api/readiness/route.ts`, `app/[locale]/error.tsx`
  - `.github/workflows/ci.yml`, `eslint.config.mjs`, `.prettierrc`, `vitest.config.ts`
- Tests:
  - `tests/unit/env.test.ts` (5 tests passed)
  - `tests/unit/logger.test.ts` (5 tests passed)
  - `tests/unit/health.test.ts` (2 tests passed)
  - Total: 12 unit tests passing in Vitest
- Migrations: None (Foundation phase)
- Config: Complete Zod runtime environment schema in `src/lib/config/env.ts` with build-phase safety and zero secrets in `.env.example`
- Manual QA: Clean `next build` static page generation (`/ar`, `/en`, `/api/health`, `/api/readiness`)
- Arabic/RTL QA: Layout renders `dir="rtl"` with `lang="ar"` for `/ar`
- English/LTR QA: Layout renders `dir="ltr"` with `lang="en"` for `/en`
- Security notes: Strict security headers in `next.config.ts`, secret redaction in `logger.ts`, strict Zod input validation
- Known limitations: None. Fully meeting Definition of Done.
- Next: F002 — Database & migrations

#### F002 — Database & migrations
- Status: DONE
- Commit/PR: `2503c679e1bbba816a35d0bddae94f7e40e80c84`
- Main paths:
  - `drizzle.config.ts`, `drizzle/0000_great_wendell_vaughn.sql`
  - `src/lib/db/client.ts`, `src/lib/db/migrate.ts`
  - `src/lib/db/schema/` (auth, localization, content, projects, cv, social, ai, evaluation, admin, index)
  - `tests/unit/db-schema.test.ts`
- Tests:
  - `tests/unit/db-schema.test.ts` (8 tests verifying all 50 tables, enums, UUID pk, constraints)
  - Total: 20 unit tests passing in Vitest across all modules
- Migrations: `drizzle/0000_great_wendell_vaughn.sql` (generated with `drizzle-kit generate`, covering 50 tables, foreign keys, indexes)
- Config: `drizzle.config.ts` configured for PostgreSQL dialect with strict checking
- Manual QA: Generated migrations reviewed, verified table definitions, enums, cascade deletes, and indexes
- Arabic/RTL QA: All translation tables (`ui_text_translations`, `page_translations`, `section_translations`, `project_translations`, `social_profile_translations`) support dynamic RTL text without length limits
- English/LTR QA: Dual-language schema support with explicit locale reference
- Security notes: Explicit foreign key constraints with cascade/set null, encrypted secret references schema for AES-256-GCM tokens, audit events schema with immutable records and IP/UA tracking
- Known limitations: None. Fully meeting Definition of Done.
- Next: F003 — Authentication

#### F003 — Authentication
- Status: DONE
- Commit/PR: `712a0a2a1087982d8f7135eb2760826688db7de9`
- Main paths:
  - `src/lib/security/auth.ts`, `src/lib/security/auth-client.ts`
  - `app/api/auth/[...all]/route.ts`
  - `src/modules/auth/domain/validation.ts`
  - `src/modules/auth/presentation/sign-in-form.tsx`, `src/modules/auth/presentation/sign-up-form.tsx`
  - `app/[locale]/(auth)/sign-in/page.tsx`, `app/[locale]/(auth)/sign-up/page.tsx`
  - `tests/unit/auth-validation.test.ts`, `tests/integration/auth-endpoints.test.ts`
- Tests:
  - `tests/unit/auth-validation.test.ts` (6 tests verifying email, password length, password matching)
  - `tests/integration/auth-endpoints.test.ts` (2 tests verifying Better Auth server handler and session configuration)
  - Total: 28 unit/integration tests passing in Vitest
- Migrations: Utilizing `users`, `sessions`, `accounts`, `verifications`, and `user_roles` from F002 schema
- Config: Better Auth configured with email/password, cookie caching, secure cookies in production, and Drizzle adapter
- Manual QA: Tested `/ar/sign-in`, `/en/sign-in`, `/ar/sign-up`, `/en/sign-up` static page compilation; verified guest reassurance banner on both routes
- Arabic/RTL QA: Forms render with appropriate RTL direction, Arabic labels, and logical spacing
- English/LTR QA: Forms render with LTR direction and English labels
- Security notes: Secure HTTP-only cookies in production, minimum 8 character password policy, Zod input validation, server-enforced sessions
- Known limitations: None. Fully meeting Definition of Done.
- Next: F004 — RBAC & admin protection

#### F004 — RBAC & admin protection
- Status: DONE
- Commit/PR: `4d10a34`
- Main paths:
  - `src/modules/auth/domain/roles.ts` (Role enums `GUEST`, `USER`, `ADMIN`, hierarchy checks)
  - `src/modules/auth/infrastructure/server-auth.ts` (`getCurrentSession`, `getUserRole`, `requireUser`, `requireAdmin`, `UnauthorizedError`, `ForbiddenError`)
  - `app/[locale]/admin/layout.tsx` (Server-side layout enforcing admin authorization with deny-by-default, redirects unauthenticated guests, renders access denied for non-admin users)
  - `app/[locale]/admin/page.tsx` (Admin dashboard overview UI)
  - `app/api/admin/guard-check/route.ts` (Secure API route asserting requireAdmin with 401/403 responses)
  - `scripts/bootstrap-admin/index.ts` (Secure CLI tool to grant admin role with immutable audit logging)
  - `tests/unit/rbac.test.ts`, `tests/integration/admin-guard.test.ts`
- Tests:
  - `tests/unit/rbac.test.ts` (4 tests verifying role hierarchy, admin assignment, and permission checking)
  - `tests/integration/admin-guard.test.ts` (4 tests verifying `requireUser`, `requireAdmin`, 401 for unauthenticated, and 403 for non-admin)
  - Total: 36 unit/integration tests passing in Vitest across 8 test suites
- Migrations: None required (uses existing `user_roles` and `audit_events` tables from F002)
- Config: Server-side deny-by-default authorization pattern; zero client-only guard reliance
- Manual QA: Verified admin layout redirect flow, access denied message for regular users, guard-check API status codes
- Arabic/RTL QA: Admin layout and access denied messages fully support RTL with Arabic copy
- English/LTR QA: Clean English layout with LTR formatting
- Security notes: Deny-by-default server enforcement, no client-side role trusting, immutable audit trail logging on bootstrap
- Known limitations: None. Fully meeting Definition of Done.
- Next: F005 — Guest-first public access

#### F005 — Guest-first public access
- Status: DONE
- Commit/PR: `afbba11`
- Main paths:
  - `src/modules/auth/domain/access-policy.ts` (Public capabilities catalog, `isPublicFeature`, `canAccessFeature`, `assertPublicFeature`)
  - `src/modules/auth/infrastructure/request-context.ts` (`resolveRequestContext`, guest ephemeral resolution with zero shadow accounts or fingerprinting)
  - `src/modules/auth/presentation/guest-reassurance-badge.tsx` (Bilingual restrained guest exploration badge)
  - `app/[locale]/(public)/page.tsx` (Public landing with instant guest capabilities grid and reassurance banner)
  - `tests/unit/access-policy.test.ts`, `tests/unit/request-context.test.ts`, `tests/integration/guest-access.test.ts`
- Tests:
  - `tests/unit/access-policy.test.ts` (5 tests verifying all 12 public capabilities from `01_GUEST_ACCESS.md`, guest access, and non-gating assertions)
  - `tests/unit/request-context.test.ts` (4 tests verifying clean `GuestContext` resolution without DB writes or shadow accounts, and authenticated user/admin mapping)
  - `tests/integration/guest-access.test.ts` (4 tests simulating private browser guest request, asserting public route and API accessibility, and verifying admin surfaces remain protected)
  - Total: 49 unit/integration tests passing in Vitest across 11 test suites
- Migrations: None required (guest context is strictly unauthenticated, ephemeral, and stores zero records)
- Config: Strictly ephemeral guest model per `NON_NEGOTIABLES.md` Rule 32; zero shadow accounts, zero persistent fingerprinting
- Manual QA: Tested `/ar` and `/en` public landing rendering with guest reassurance banner, validated responsive layout and RTL/LTR direction
- Arabic/RTL QA: Verified Arabic strings, RTL flex layouts, and appropriate spacing
- English/LTR QA: Verified English strings, LTR layout, and proper typography
- Security notes: Public routes remain unrestricted, while admin endpoints strictly enforce 401/403 authorization; zero guest credentials or tokens stored in DB
- Known limitations: None. Fully meeting Definition of Done.
- Next: F006 — Dynamic localization registry

#### F006 — Dynamic localization registry
- Status: DONE
- Commit/PR: `de8aa8c`
- Main paths:
  - `src/modules/localization/domain/locales.ts` (Arabic/English locales, RTL/LTR mappings, validation)
  - `src/modules/localization/domain/types.ts` (TranslationDictionary, CompletenessReport, TranslationParams)
  - `src/modules/localization/infrastructure/core-system-keys.ts` (Dynamic core system keys dictionary)
  - `src/modules/localization/infrastructure/localized-text-service.ts` (Database-backed LocalizedTextService, in-memory cache, fallback resolution, missing key logging, completeness auditing)
  - `src/modules/localization/application/get-translations.ts` (Server-side translation helper with parameter interpolation)
  - `src/modules/localization/presentation/localization-provider.tsx` (Client-side React translation context & hook)
  - `app/[locale]/(public)/page.tsx` (Updated to resolve all user-facing copy purely through dynamic translations)
  - `tests/unit/localization-domain.test.ts`, `tests/unit/localized-text-service.test.ts`, `tests/integration/dynamic-localization.test.ts`
- Tests:
  - `tests/unit/localization-domain.test.ts` (5 tests verifying locale definitions, direction mapping, and param interpolation)
  - `tests/unit/localized-text-service.test.ts` (5 tests verifying dictionary retrieval, key resolution, caching, missing key error logging, and completeness reporting)
  - `tests/integration/dynamic-localization.test.ts` (4 tests verifying server-side getTranslations for Arabic and English, RTL/LTR resolution, and safe fallback handling)
  - Total: 63 unit/integration tests passing in Vitest across 14 test suites
- Migrations: Uses existing `locales`, `ui_text_keys`, and `ui_text_translations` tables from F002
- Config: Strictly zero static content in code; fallback occurs only if database translation exists in secondary locale; missing keys log structured errors
- Manual QA: Tested `/ar` and `/en` SSR compilation with dynamic dictionary lookup; verified proper RTL/LTR text orientation
- Arabic/RTL QA: Arabic copy renders with `dir="rtl"`, correct fonts and logical start alignment
- English/LTR QA: English copy renders with `dir="ltr"` and clean typography
- Security notes: Parameter interpolation safely handles variable substitution without evaluating arbitrary code; structured logger redacts sensitive values
- Known limitations: None. Fully meeting Definition of Done.
- Next: F007 — Automatic RTL/LTR system

#### F007 — Automatic RTL/LTR system
- Status: DONE
- Commit/PR: `83e0f22`
- Main paths:
  - `src/modules/localization/domain/direction.ts` (Direction types, DIRECTIONAL_ICONS registry, isDirectionalIcon, getIconDirectionClass, detectScriptDirection)
  - `src/modules/localization/presentation/directional-icon.tsx` (Direction-aware icon wrapper automatically mirroring forward/backward chevrons and arrows while preserving universal icons)
  - `src/modules/localization/presentation/mixed-content.tsx` (MixedContent and IsolatedToken components for bidirectional script isolation)
  - `src/modules/localization/presentation/direction-provider.tsx` (DirectionProvider React context for overlay/portal direction propagation)
  - `app/globals.css` (Bidirectional font stacks, logical start alignment, code block direction isolation)
  - `app/[locale]/layout.tsx` (RootLayout wrapped with DirectionProvider)
  - `app/[locale]/(public)/page.tsx` (Showcasing DirectionalIcon chevron-end and MixedContent isolation)
  - `tests/unit/direction.test.ts`, `tests/integration/rtl-ltr-layout.test.ts`
- Tests:
  - `tests/unit/direction.test.ts` (10 tests covering script detection, directional icon classification, and mirroring CSS classes)
  - `tests/integration/rtl-ltr-layout.test.ts` (4 tests verifying root direction mapping, icon mirroring, reading order preservation, and universal icon non-inversion)
  - Total: 77 unit/integration tests passing in Vitest across 16 test suites
- Migrations: None required (layout and styling architecture)
- Config: Strictly logical bidirectional CSS rules; universal icons (play, external-link, branding) never mirrored
- Manual QA: Tested `/ar` (renders `dir="rtl"` with properly flipped directional chevrons) and `/en` (renders `dir="ltr"` with forward chevrons)
- Arabic/RTL QA: Arabic typography utilizes system Arabic font stack with start alignment and LTR-isolated code blocks
- English/LTR QA: Clean LTR typography and layout alignment
- Security notes: Clean DOM rendering with zero dangerous HTML or unsanitized script attributes
- Known limitations: None. Fully meeting Definition of Done.
- Next: F008 — Light/dark theme

#### F008 — Light/dark theme
- Status: DONE
- Commit/PR: `1bcdfbe`
- Main paths:
  - `src/modules/theme/domain/theme.ts` (Theme types, THEMES catalog, resolveTheme, isTheme, cookie constants)
  - `src/modules/theme/infrastructure/theme-cookie.ts` (Server-side cookie extraction and Set-Cookie serialization)
  - `src/modules/theme/presentation/theme-script.tsx` (Inline blocking script preventing first-paint flash / FOUC)
  - `src/modules/theme/presentation/theme-provider.tsx` (ThemeProvider utilizing useSyncExternalStore for system matchMedia listening, cookie and localStorage persistence)
  - `src/modules/theme/presentation/theme-toggle.tsx` (Accessible, restrained theme toggle button with Sun, Moon, and System icons)
  - `app/[locale]/layout.tsx` (Server cookie reading and ThemeProvider integration)
  - `app/[locale]/(public)/page.tsx` (ThemeToggle mounted in public header)
  - `tests/unit/theme.test.ts`, `tests/integration/theme-integration.test.ts`
- Tests:
  - `tests/unit/theme.test.ts` (4 tests verifying theme validation, system preference resolution, cookie parsing, and cookie serialization)
  - `tests/integration/theme-integration.test.ts` (3 tests verifying server cookie extraction, default fallback, and round-trip serialization)
  - Total: 84 unit/integration tests passing in Vitest across 18 test suites
- Migrations: None required (theme preferences stored in cookies and localStorage)
- Config: Zero-flash FOUC architecture; no neon/gradient heavy aesthetic; WCAG contrast standards maintained
- Manual QA: Tested theme transitions between light, dark, and system; confirmed instant application without hydration mismatch
- Arabic/RTL QA: ThemeToggle renders with Arabic tooltip and proper RTL spacing
- English/LTR QA: ThemeToggle renders with English label and LTR layout
- Security notes: Cookie configured with SameSite=Lax and Path=/; zero script injection vulnerability
- Known limitations: None. Fully meeting Definition of Done.
- Next: F009 — Design system & custom Select

### F009: Design system & custom Select
- Feature: F009 — Design system & custom Select
- Status: **DONE**
- Branch: `feat/f009-design-system-custom-select`
- Commit: `88ac380`
- Files changed/created:
  - `src/components/ui/button.tsx` (Variants: primary, secondary, outline, ghost, destructive, link; sizes: sm, md, lg, icon; accessible loading spinner & aria-busy)
  - `src/components/ui/card.tsx` (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
  - `src/components/ui/input.tsx` (Input with error states, focus rings, disabled state, RTL alignment)
  - `src/components/ui/badge.tsx` (Restrained badges: default, secondary, outline, success, destructive)
  - `src/components/ui/empty-state.tsx` (Clean empty state container with status role and action slot)
  - `src/components/ui/error-state.tsx` (Error state container with alert role and retry callback)
  - `src/components/ui/skeleton.tsx` (Pulse skeleton honoring `prefers-reduced-motion`)
  - `src/components/ui/select.tsx` (Radix UI Select primitive with custom trigger, scroll buttons, portal surface, item indicator, error state, and RTL support)
  - `src/components/ui/index.ts` (Unified export barrel)
  - `src/lib/utils.ts` (Shared `cn` helper combining clsx and twMerge)
  - `src/modules/localization/presentation/language-select.tsx` (Production language switcher utilizing custom Select primitive; Rule 16 compliant with zero native `<select>`)
  - `app/[locale]/(public)/page.tsx` (Integrated Card, Badge, and LanguageSelect in public UI)
  - `tests/unit/design-system.test.tsx`
  - `tests/integration/custom-select.test.tsx`
- Tests:
  - `tests/unit/design-system.test.tsx` (12 tests covering Button variants, sizes, loading, Card hierarchy, Input validation states, Badge variants, EmptyState, ErrorState retry, Skeleton)
  - `tests/integration/custom-select.test.tsx` (6 tests verifying zero native `<select>` in DOM, custom trigger, error states, disabled states, RTL direction, and LanguageSelect)
  - Total: 102 unit/integration tests passing in Vitest across 20 test suites
- Rule 16 verified: Zero native `<select>` elements in product DOM.
- Visual aesthetic verified: Restrained, neutral color palette, no neon glow, no multi-color gradient background.
- Next: F010 — Motion system

### F010: Motion system
- Feature: F010 — Motion system
- Status: **DONE**
- Branch: `feat/f010-motion-system`
- Commit: `71d2966`
- Files changed/created:
  - `src/modules/motion/domain/motion-tokens.ts` (Restrained duration tokens: instant/fast/normal/slow, custom easing curves, reduced-motion overrides for fadeIn, slideUp, staggerContainer, and staggerItem)
  - `src/modules/motion/presentation/use-reduced-motion-preference.ts` (React 19 `useSyncExternalStore` hook listening to `(prefers-reduced-motion: reduce)`)
  - `src/modules/motion/presentation/motion-provider.tsx` (Configurable `MotionProvider` context with `isReducedMotion`, `intensity` [none|reduced|normal], and `shouldAnimate`)
  - `src/components/motion/fade-in.tsx` (Subtle opacity entrance respecting reduced-motion)
  - `src/components/motion/slide-in.tsx` (Subtle 8px vertical slide entrance with translation removed on reduced-motion)
  - `src/components/motion/stagger.tsx` (`StaggerContainer` & `StaggerItem` primitives with zero stagger delay on reduced-motion)
  - `src/components/motion/presence-transition.tsx` (`AnimatePresence` wrapper for conditional exit transitions)
  - `src/components/motion/index.ts` (Motion components barrel export)
  - `app/[locale]/layout.tsx` (Mounted `MotionProvider` in root layout)
  - `app/[locale]/(public)/page.tsx` (Integrated `FadeIn`, `StaggerContainer`, and `StaggerItem` in public homepage)
  - `tests/unit/motion-tokens.test.ts`
  - `tests/integration/motion-system.test.tsx`
- Tests:
  - `tests/unit/motion-tokens.test.ts` (7 tests verifying durations <= 0.4s, zero delay and linear ease on reduced-motion, and translation suppression)
  - `tests/integration/motion-system.test.tsx` (7 tests verifying context defaults, overrideIntensity="none", FadeIn, SlideIn, StaggerContainer, StaggerItem, and PresenceTransition)
  - Total: 116 unit/integration tests passing in Vitest across 22 test suites
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js build clean.
- Next: F011 — Dynamic navigation/footer

### F011: Dynamic navigation/footer
- Feature: F011 — Dynamic navigation/footer
- Status: **DONE**
- Branch: `feat/f011-dynamic-navigation-footer`
- Commit: `37c7329`
- Files changed/created:
  - `src/modules/navigation/domain/types.ts` (Dynamic navigation item schema, destination types, placement, auth visibility rules)
  - `src/modules/navigation/infrastructure/default-navigation.ts` (Validated baseline navigation configuration)
  - `src/modules/navigation/infrastructure/navigation-service.ts` (Resilient database loader querying `system_settings` with 300ms bounded timeout, in-memory TTL caching, role/placement filtering, and admin update support)
  - `src/modules/navigation/presentation/navbar.tsx` (Fixed/sticky desktop navbar with active path highlighting, skip link, mobile drawer with motion animation, and integrated theme/language controls)
  - `src/modules/navigation/presentation/footer.tsx` (Dynamic footer with navigation columns, capabilities, copyright year, and engineering tag)
  - `src/modules/navigation/presentation/nav-icon.tsx` (Dynamic accessible Lucide icon mapper)
  - `src/modules/navigation/presentation/index.ts` (Barrel export)
  - `app/[locale]/(public)/layout.tsx` (Integrated dynamic Navbar, skip target, and Footer into public route layout)
  - `src/modules/localization/domain/interpolation.ts` (Pure domain interpolation utility isolated from server/database dependencies)
  - `tests/unit/navigation-service.test.ts`
  - `tests/integration/navigation-ui.test.tsx`
- Tests:
  - `tests/unit/navigation-service.test.ts` (6 tests verifying default retrieval, sorting by orderIndex, placement filtering, authVisibility rules, and in-memory cache invalidation)
  - `tests/integration/navigation-ui.test.tsx` (3 tests verifying desktop navbar rendering, skip link, mobile menu drawer toggle and ESC key handling, and footer columns with dynamic copyright)
  - Total: 125 unit/integration tests passing in Vitest across 24 test suites
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js build clean.
- Next: F012 — Dynamic section builder

### F012: Dynamic section builder
- Feature: F012 — Dynamic section builder
- Status: **DONE**
- Branch: `feat/f012-dynamic-section-builder`
- Commit: Pending commit
- Files changed/created:
  - `src/modules/content/domain/blocks.ts` (11 block Zod schemas: heading, rich_text, media, cta, metrics, card_collection, timeline, skill_tags, accordion, code_block, quote)
  - `src/modules/content/domain/sections.ts` (Section and Page Zod domain schemas and types)
  - `src/modules/content/infrastructure/default-home-sections.ts` (Default structured baseline page sections)
  - `src/modules/content/infrastructure/section-service.ts` (Resilient database loader for page sections querying `pages`, `sections`, and `blocks` with in-memory TTL caching and graceful fallback)
  - `src/modules/content/presentation/blocks/heading-block.tsx`
  - `src/modules/content/presentation/blocks/rich-text-block.tsx`
  - `src/modules/content/presentation/blocks/cta-block.tsx`
  - `src/modules/content/presentation/blocks/metrics-block.tsx`
  - `src/modules/content/presentation/blocks/card-collection-block.tsx`
  - `src/modules/content/presentation/blocks/skill-tags-block.tsx`
  - `src/modules/content/presentation/blocks/code-block.tsx`
  - `src/modules/content/presentation/blocks/quote-block.tsx`
  - `src/modules/content/presentation/block-renderer.tsx` (Composable block dispatcher)
  - `src/modules/content/presentation/section-renderer.tsx` (Section layout and block sequencer)
  - `src/modules/content/presentation/dynamic-page.tsx` (Dynamic page renderer)
  - `src/modules/content/presentation/index.ts` (Barrel export)
  - `app/[locale]/(public)/page.tsx` (Dynamic homepage rendering via `DynamicPage` with 0 hardcoded copy)
  - `tests/unit/section-builder.test.ts`
  - `tests/integration/section-builder.test.tsx`
- Tests:
  - `tests/unit/section-builder.test.ts` (6 tests verifying block domain schema validation, section schema validation, default home sections integrity, orderIndex ordering, and in-memory cache invalidation)
  - `tests/integration/section-builder.test.tsx` (2 tests verifying dynamic rendering of heading, rich_text, metrics, cta, card_collection, skill_tags, quote, code_block, visibility filtering, and graceful unknown block handling)
  - Total: 133 unit/integration tests passing in Vitest across 26 test suites
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js build clean.
- Next: F013 — Global admin inline edit mode

### F013: Global admin inline edit mode
- Feature: F013 — Global admin inline edit mode
- Status: **DONE**
- Branch: `feat/f013-global-admin-inline-edit-mode`
- Commit: Pending commit
- Files changed/created:
  - `src/modules/admin/domain/inline-edit.ts` (`EditableRef` type, Zod schema `inlineEditUpdateSchema` with concurrency control, `InlineEditResult`, `InlineEditErrorResult`)
  - `src/modules/admin/infrastructure/inline-edit-service.ts` (`InlineEditService` persisting edits to blocks, sections, ui_text, navigation, recording immutable audit events in `audit_events`, and invalidating caches)
  - `app/api/admin/inline-edit/route.ts` (Next.js route handler enforcing `requireAdmin`, validating schema, and responding with 401/403/409/200)
  - `src/modules/admin/presentation/admin-edit-provider.tsx` (Client React Context for admin capability, edit mode toggle, active editor state, and update subscribers)
  - `src/modules/admin/presentation/admin-toolbar.tsx` (Unobtrusive floating toolbar rendered only for admins with Edit Mode switch and link to control center)
  - `src/modules/admin/presentation/editable-region.tsx` (Zero-wrapper pass-through for visitors/guests; hover outline and accessible edit button for admins in edit mode)
  - `src/modules/admin/presentation/contextual-editor-dialog.tsx` (Accessible modal dialog with Escape handling, form inputs, optimistic update, and router refresh)
  - `src/modules/admin/presentation/index.ts` (Barrel export)
  - `app/[locale]/(public)/layout.tsx` (Mounted `AdminEditProvider`, `AdminToolbar`, and `ContextualEditorDialog` with server-checked `isAdmin` status)
  - `src/modules/content/presentation/section-renderer.tsx` (Wrapped section headers in `EditableRegion`)
  - `src/modules/content/presentation/block-renderer.tsx` (Wrapped composable blocks in `EditableRegion`)
  - `tests/unit/inline-edit-service.test.ts`
  - `tests/integration/admin-inline-edit.test.tsx`
- Tests:
  - `tests/unit/inline-edit-service.test.ts` (8 tests verifying domain validation, block update, section update, navigation update, audit logging, and cache invalidation)
  - `tests/integration/admin-inline-edit.test.tsx` (4 tests verifying zero overhead/elements for guests, toolbar & edit mode toggle for admins, accessible edit handle display, and contextual editor save workflow)
  - Total: 145 unit/integration tests passing in Vitest across 28 test suites
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js build clean.
- Next: F014 — CV viewer/download/versioning

### F014: CV viewer/download/versioning
- Feature: F014 — CV viewer/download/versioning
- Status: **DONE**
- Branch: `feat/f014-cv-viewer-download-versioning`
- Commit: Pending commit
- Files changed/created:
  - `src/modules/localization/infrastructure/core-system-keys.ts` (Added 13 semantic keys for CV titles, actions, versions, dates, size, admin controls)
  - `src/modules/cv/domain/cv.ts` (`CvVersion`, `PublishedCv`, `validatePdfBytes` magic byte checker, `formatFileSize`)
  - `src/modules/cv/infrastructure/storage-service.ts` (`CvStorageService` with in-memory map, disk persistence, and baseline valid PDF fallback)
  - `src/modules/cv/infrastructure/cv-service.ts` (`CvService` with `getPublishedCv`, `createVersion`, `publishVersion`, `rollbackVersion`, `listVersions`, audit logging, cache invalidation)
  - `app/api/cv/download/route.ts` (Public streaming endpoint with `Content-Type: application/pdf`, cache headers, attachment/inline disposition)
  - `app/api/admin/cv/route.ts` (Admin route guarded by `requireAdmin` for listing, multipart PDF upload, and publishing/rollback)
  - `src/modules/cv/presentation/cv-fallback-card.tsx` (Accessible document preview card with download/open actions)
  - `src/modules/cv/presentation/cv-admin-controls.tsx` (Admin inline panel for version history, upload, and rollback)
  - `src/modules/cv/presentation/cv-viewer.tsx` (Responsive CV viewer with desktop embedded `<object>` and mobile fallback card)
  - `src/modules/cv/presentation/index.ts` (Barrel export)
  - `app/[locale]/(public)/cv/page.tsx` (Dynamic public route with localized metadata and server-rendered data fetching)
  - `tests/unit/cv-service.test.ts`
  - `tests/integration/cv-viewer.test.tsx`
- Tests:
  - `tests/unit/cv-service.test.ts` (10 tests verifying PDF magic bytes, file size formatting, baseline fallback, caching, upload validation, publish, rollback)
  - `tests/integration/cv-viewer.test.tsx` (3 tests verifying guest rendering, download links, zero admin UI for guests, admin controls when edit mode is active, and Arabic dynamic localization)
  - Total: 158 unit/integration tests passing in Vitest across 30 test suites
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js build clean.
### F015: GitHub profile popover
- Feature: F015 — GitHub profile popover
- Status: **DONE**
- Branch: `feat/f015-github-profile-popover`
- Commit: Pending commit
- Files changed/created:
  - `src/modules/localization/infrastructure/core-system-keys.ts` (Added semantic keys for GitHub title, description, and social actions: copy URL, copied state, open profile, canonical URL)
  - `src/modules/social/domain/types.ts` (`SocialPlatform`, `SocialProfile`, `socialProfileUpdateSchema`, re-export of `BASELINE_GITHUB_PROFILE`)
  - `src/modules/social/domain/baseline.ts` (Pure domain baseline profile isolating client components from backend drivers)
  - `src/modules/social/infrastructure/social-service.ts` (`SocialService` with in-memory TTL caching, database querying with locale translations, admin updates with audit logging, baseline fallback)
  - `app/api/social/[platform]/route.ts` (Public `GET` and admin `PATCH` handler guarded with `requireAdmin` and audit trail)
  - `src/modules/social/presentation/social-icon.tsx` (Accessible icon component supporting github, linkedin, twitter/x, email, and custom link)
  - `src/modules/social/presentation/github-popover.tsx` (Dynamic accessible popover with copy URL button, direct profile link, keyboard navigation Escape/blur dismiss, RTL/LTR layout, and admin inline edit integration)
  - `src/modules/social/presentation/index.ts` (Barrel export)
  - `src/modules/navigation/presentation/navbar.tsx` (Integrated `GitHubPopover` alongside theme toggle and language selector)
  - `app/[locale]/(public)/layout.tsx` (Server-side dynamic fetch of GitHub social profile from `socialService`)
  - `tests/unit/social-service.test.ts`
  - `tests/integration/github-popover.test.tsx`
- Tests:
  - `tests/unit/social-service.test.ts` (7 tests verifying baseline fallback, database profile retrieval with locale fallback, caching, admin update validation, and audit logging)
  - `tests/integration/github-popover.test.tsx` (5 tests verifying accessible trigger, popover open/close, copy-to-clipboard interaction, Escape key dismissal, and admin inline edit handle display)
  - Total: 170 unit/integration tests passing in Vitest across 32 test suites
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js build clean.
- Next: F016 — LinkedIn profile popover

### F016: LinkedIn profile popover
- Feature: F016 — LinkedIn profile popover
- Status: **DONE**
- Branch: `feat/f016-linkedin-profile-popover`
- Commit: Pending commit
- Files changed/created:
  - `src/modules/localization/infrastructure/core-system-keys.ts` (Added `social.linkedin.title` and `social.linkedin.description` dynamic keys with Arabic and English translations)
  - `src/modules/social/domain/baseline.ts` (Added `BASELINE_LINKEDIN_PROFILE` and `BASELINE_SOCIAL_PROFILES` for database-independent client components)
  - `src/modules/social/domain/types.ts` (Re-exported `BASELINE_LINKEDIN_PROFILE` and `BASELINE_SOCIAL_PROFILES`)
  - `src/modules/social/infrastructure/social-service.ts` (Updated `getProfile` and `listProfiles` to resolve LinkedIn baseline profiles, fresh array cloning, and caching)
  - `src/modules/social/presentation/linkedin-popover.tsx` (Dynamic accessible LinkedIn popover with copy URL button, direct profile link, Escape/click-outside dismiss, RTL/LTR layout, and admin inline edit integration)
  - `src/modules/social/presentation/index.ts` (Exported `LinkedInPopover` and `LinkedInPopoverProps`)
  - `src/modules/navigation/presentation/navbar.tsx` (Integrated `LinkedInPopover` in header controls on desktop and mobile)
  - `src/modules/navigation/presentation/footer.tsx` (Integrated `LinkedInPopover` and `GitHubPopover` in footer brand section)
  - `app/[locale]/(public)/layout.tsx` (Server-side concurrent fetch of LinkedIn profile passed to Navbar and Footer)
  - `tests/unit/social-service.test.ts` (Added tests for LinkedIn baseline resolution and multi-profile listing)
  - `tests/integration/linkedin-popover.test.tsx` (Integration tests for accessible trigger, popover open/close, copy-to-clipboard, secure external link, Escape key dismissal, and admin inline edit mode)
- Tests:
  - `tests/unit/social-service.test.ts` (9 tests passing)
  - `tests/integration/linkedin-popover.test.tsx` (6 tests passing)
  - Total: 178 unit/integration tests passing in Vitest across 33 test suites
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js build clean.
- Next: F017 — Project catalog

### F017: Project catalog
- Feature: F017 — Project catalog
- Status: **DONE**
- Branch: `feat/f017-project-catalog`
- Commit: Pending commit
- Files changed/created:
  - `src/modules/localization/infrastructure/core-system-keys.ts` (Registered 20 dynamic localization keys for project catalog, filters, sort options, count, badges, and empty states in Arabic and English)
  - `src/modules/projects/domain/types.ts` (Domain models for `Project`, `ProjectCategory`, `ProjectTag`, `ProjectFilterParams`, `ProjectListResult`, and Zod update validation)
  - `src/modules/projects/domain/baseline.ts` (Pure domain baseline fallbacks with rich multi-domain projects in Arabic & English, categories, and tags)
  - `src/modules/projects/infrastructure/project-service.ts` (`ProjectService` with in-memory TTL caching, database querying across project tables and translations, multi-criteria filtering, multi-field sorting, and audit-logged admin status updates)
  - `app/api/projects/route.ts` (Public GET endpoint supporting locale, category, tag, search query, featured flag, and sort parameters with caching headers)
  - `app/api/admin/projects/[id]/status/route.ts` (Admin PATCH endpoint guarded by `requireAdmin` for publishing status workflows)
  - `src/modules/admin/domain/inline-edit.ts` (Added `project` to `editableEntityTypeSchema`)
  - `src/modules/projects/presentation/project-card.tsx` (Glassmorphic responsive card with graceful missing media fallback, badges, tags, links, and `EditableRegion` integration)
  - `src/modules/projects/presentation/project-filters.tsx` (Interactive filter bar using design system custom Select primitives, search input with clear action, and featured checkbox)
  - `src/modules/projects/presentation/project-catalog.tsx` (Client component combining search/filter state, dynamic result count, staggered animated grid, and empty state with reset action)
  - `src/modules/projects/presentation/index.ts` (Barrel export)
  - `app/[locale]/(public)/projects/page.tsx` (Server-rendered page with dynamic localized metadata and SSR project catalog)
  - `tests/unit/project-service.test.ts` (14 unit tests covering baseline fallbacks, search, category, tag, featured filters, sorting, slug lookup, caching, and admin status updates)
  - `tests/integration/project-catalog.test.tsx` (7 integration tests covering catalog rendering, reactive search, featured toggle, empty state reset, accessibility, RTL Arabic support, and admin inline edit)
- Tests:
  - `tests/unit/project-service.test.ts` (14 tests passing)
  - `tests/integration/project-catalog.test.tsx` (7 tests passing)
  - Total: 199 unit/integration tests passing in Vitest across 35 test suites
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js build clean.
- Next: F018 — Project Deep Dive

### F018: Project Deep Dive
- Feature: F018 — Project Deep Dive
- Status: **DONE**
- Branch: `feat/f018-project-deep-dive`
- Commit: Pending commit
- Files changed/created:
  - `src/modules/localization/infrastructure/core-system-keys.ts` (Registered 19 dynamic keys for narrative headers, tech stack, scoped AI retrieval badge, suggested questions, and 404 text in Arabic & English)
  - `src/modules/projects/domain/types.ts` (Enriched `Project` model with `problem`, `constraints`, `solution`, `architecture`, `implementation`, `challenges`, `decisionsTradeoffs`, and `results`)
  - `src/modules/projects/domain/baseline.ts` (Enriched domain baseline projects with comprehensive verified technical engineering content in Arabic and English)
  - `src/modules/projects/infrastructure/project-service.ts` (Updated `listProjects` to query all narrative deep dive columns and implemented `getRelatedProjects(slug, locale, limit)`)
  - `src/modules/projects/presentation/project-deep-dive.tsx` (Content-driven presentation component strictly omitting empty sections to prevent broken headings, scoped AI query affordance linking to `/chat?project=${slug}&projectId=${id}`, related projects grid, and `EditableRegion` wrappers)
  - `src/modules/projects/presentation/index.ts` (Exported `ProjectDeepDive` and `ProjectDeepDiveProps`)
  - `app/[locale]/(public)/projects/[slug]/page.tsx` (Dynamic server-rendered route with localized metadata and 404 handling via `notFound()`)
  - `tests/unit/project-service.test.ts` (Added 4 unit tests covering deep dive fields and related project filtering)
  - `tests/integration/project-deep-dive.test.tsx` (5 integration tests verifying narrative blocks rendering, empty section omission, scoped Ask AI affordance, Arabic RTL localization, and admin edit mode)
- Tests:
  - `tests/unit/project-service.test.ts` (18 tests passing)
  - `tests/integration/project-deep-dive.test.tsx` (5 tests passing)
  - Total: 208 unit/integration tests passing in Vitest across 36 test suites
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js production build clean (`/[locale]/projects/[slug]` route generated).
- Next: F019 — AI provider/model registry

### F019: AI provider/model registry
- Feature: F019 — AI provider/model registry
- Status: **DONE**
- Branch: `feat/f019-ai-provider-model-registry`
- Commit: Pending commit
- Files changed/created:
  - `src/ai/contracts/provider-registry.ts` (Domain types, capabilities union, provider types, display-safe types, and Zod schemas for providers, models, assignments, and policies)
  - `src/ai/contracts/baseline-registry.ts` (Authentic production baselines for OpenAI Compatible Gateway, Anthropic Direct, BGE TEI Hub, and Ollama with default capability assignments)
  - `src/ai/contracts/index.ts` (Barrel export for AI contracts)
  - `src/ai/orchestration/model-registry-service.ts` (`ModelRegistryService` with in-memory TTL caching, database persistence across `aiProviders`, `aiModels`, `aiModelAssignments`, `aiRuntimePolicies`, capability-role compatibility checks, dynamic model assignment without redeployment, audit logging, and capability verification per `19_MODEL_HEALTH_AND_CAPABILITY_CHECKS.md`)
  - `app/api/admin/ai/providers/route.ts` (Admin GET & POST endpoints guarded by `requireAdmin`)
  - `app/api/admin/ai/providers/[id]/route.ts` (Admin PATCH & DELETE endpoints guarded by `requireAdmin`)
  - `app/api/admin/ai/models/route.ts` (Admin GET & POST endpoints with optional capability filtering)
  - `app/api/admin/ai/models/[id]/route.ts` (Admin PATCH & DELETE endpoints guarded by `requireAdmin`)
  - `app/api/admin/ai/models/[id]/test/route.ts` (Admin POST endpoint for capability verification)
  - `app/api/admin/ai/assignments/route.ts` (Admin GET & PUT endpoints for instant capability role assignment)
  - `app/api/admin/ai/policy/route.ts` (Admin GET & PATCH endpoints for runtime policy configuration)
  - `src/modules/localization/infrastructure/core-system-keys.ts` (Added "admin" to key category union and registered 16 dynamic keys for AI registry title, tabs, capabilities, test status)
  - `src/modules/admin/presentation/ai-registry-manager.tsx` (Interactive tabbed admin dashboard for managing capability assignments, providers, models, capability verification, and runtime policy with full Arabic RTL and English LTR support)
  - `src/modules/admin/presentation/index.ts` (Exported `AiRegistryManager`)
  - `app/[locale]/admin/ai/page.tsx` (Admin route with SSR pre-fetching and dynamic localized metadata)
  - `tests/unit/model-registry-service.test.ts` (18 unit tests covering baseline resolution, provider/model CRUD, capability assignment compatibility, runtime policy updates, and capability health checks)
  - `tests/integration/ai-provider-registry.test.tsx` (9 integration tests covering tab navigation, capability cards, provider/model lists, live capability testing, policy configuration, Arabic localization, and API route security guards)
- Tests:
  - `tests/unit/model-registry-service.test.ts` (18 tests passing)
  - `tests/integration/ai-provider-registry.test.tsx` (9 tests passing)
  - Total: 235 unit/integration tests passing in Vitest across 38 test suites
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js production build clean (all 25 routes compiled cleanly).
- Next: F020 — Secrets management

### F020: Secrets management
- Feature: F020 — Secrets management
- Status: **DONE**
- Branch: `feat/f020-secrets-management`
- Commit: Pending commit
- Files changed/created:
  - `src/lib/security/encryption.ts` (Authenticated AES-256-GCM symmetric encryption/decryption using 32-byte master key with random 12-byte IVs, 16-byte auth tags, and constant-time comparisons)
  - `src/lib/security/ssrf-defense.ts` (Zero-trust outbound URL validator enforcing HTTPS, stripping IPv6 brackets, and strictly blocking loopback, link-local, RFC-1918 private subnets in production, cloud metadata endpoints, and sensitive ports)
  - `src/lib/security/redaction.ts` (Deep key-based and regex-based redaction for structured objects, error messages, and logs ensuring zero API key/token leakage)
  - `src/lib/security/secrets-service.ts` (Authoritative `SecretsService` handling encrypted storage in `secretReferences`, write-only masked previews e.g. `sk-...cdef`, display-safe metadata queries, secret removal, and audit logging)
  - `src/ai/contracts/provider-registry.ts` (Added `hasApiKey` and `maskedKey` display-safe metadata properties)
  - `src/ai/orchestration/model-registry-service.ts` (Integrated `secretsService` with `DisplaySafeProvider` enrichment)
  - `app/api/admin/secrets/route.ts` (Admin GET listing metadata & POST setting secret with strict `requireAdmin` guard and redaction)
  - `app/api/admin/secrets/[key]/route.ts` (Admin GET metadata & DELETE secret endpoints guarded by `requireAdmin`)
  - `tests/unit/secrets-service.test.ts` (17 unit tests covering AES-256-GCM encryption/decryption, tampered ciphertext, SSRF blocking, redaction, metadata generation, and secret CRUD)
  - `tests/integration/secrets-endpoints.test.ts` (8 integration tests verifying admin authentication barriers, write-only security policy, metadata retrieval, masked previews, and secret deletion)
- Tests:
  - `tests/unit/secrets-service.test.ts` (17 tests passing)
  - `tests/integration/secrets-endpoints.test.ts` (8 tests passing)
  - Total: 260 unit/integration tests passing in Vitest across 40 test suites
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js production build clean (all 26 routes compiled cleanly).
- Next: F021 — Prompt registry & versioning

### F021: Prompt registry & versioning
- Feature: F021 — Prompt registry & versioning
- Status: **DONE**
- Branch: `feat/f021-prompt-registry-versioning`
- Commit: Pending commit
- Files changed/created:
  - `src/ai/contracts/prompt-registry.ts` (Typed prompt roles union, domain models for versions, summaries, details, diffs, and Zod validation schemas)
  - `src/ai/contracts/index.ts` (Exported prompt contracts)
  - `src/ai/prompts/prompt-template.ts` (Safe placeholder extraction `{{var}}` and `{var}`, template interpolation, and variable schema validation)
  - `src/ai/prompts/baseline-prompts.ts` (7 production-grade baseline prompts for `chat_system`, `query_router`, `query_rewriter`, `job_fit`, `evaluator`, `conversation_mode`, `summarizer`)
  - `src/ai/prompts/prompt-diff.ts` (Structural and textual diff engine between version pairs)
  - `src/ai/prompts/prompt-service.ts` (`PromptService` handling Drizzle persistence on `prompts` and `promptVersions`, TTL active version caching, auto-incrementing version numbers, rollback, clone, dry-run template testing, and audit logging to `auditEvents`)
  - `src/ai/prompts/index.ts` (Barrel export for AI prompt modules)
  - `app/api/admin/prompts/route.ts` (Admin GET listing & POST creation endpoints guarded by `requireAdmin`)
  - `app/api/admin/prompts/[slug]/route.ts` (Admin GET details/history & POST new version endpoints guarded by `requireAdmin`)
  - `app/api/admin/prompts/[slug]/rollback/route.ts` (Admin POST rollback endpoint with transaction deactivation and activation guarded by `requireAdmin`)
  - `app/api/admin/prompts/[slug]/compare/route.ts` (Admin GET diff comparison between two versions guarded by `requireAdmin`)
  - `app/api/admin/prompts/test/route.ts` (Admin POST template rendering test preview endpoint guarded by `requireAdmin`)
  - `src/modules/localization/infrastructure/core-system-keys.ts` (Added 18 dynamic Arabic RTL and English LTR localization keys for prompt registry)
  - `src/modules/admin/presentation/prompt-registry-manager.tsx` (Interactive admin UI with prompt selection, active version inspection, version history list with one-click rollback, version drafting form, version diff viewer, and interactive variable tester)
  - `src/modules/admin/presentation/index.ts` (Exported `PromptRegistryManager`)
  - `app/[locale]/admin/prompts/page.tsx` (Admin route for prompt registry with SSR prefetching and dynamic localized metadata)
  - `app/[locale]/admin/layout.tsx` (Added `Prompts` to admin navigation sidebar)
  - `tests/unit/prompt-service.test.ts` (14 unit tests covering variable extraction, baseline fallbacks, active prompt resolution, variable validation, dry-run testing, version diffing, creation, rollback, and audit logging)
  - `tests/integration/prompt-endpoints.test.ts` (13 integration tests verifying security barriers, prompt listing, version creation, rollbacks, version comparison, and variable preview testing)
  - `tests/integration/prompt-registry-ui.test.tsx` (4 integration tests covering rendering prompt cards, switching tabs to version history, drafting new version, and Arabic RTL layout)
- Tests:
  - `tests/unit/prompt-service.test.ts` (14 tests passing)
  - `tests/integration/prompt-endpoints.test.ts` (13 tests passing)
  - `tests/integration/prompt-registry-ui.test.tsx` (4 tests passing)
  - Total: 291 unit/integration tests passing in Vitest across 43 test suites
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js production build clean (all 30 routes compiled cleanly).
- Next: F022 — RAG ingestion pipeline

### F022: RAG Ingestion Pipeline (DONE)
- Implemented complete, idempotent, and resilient RAG knowledge extraction, text normalization, semantic chunking, embedding generation, vector store syncing, and administrative pipeline control:
  - `src/ai/contracts/ingestion.ts` (Core RAG contracts: `RawDocument`, `NormalizedDocument`, `DocumentChunk`, `ChunkMetadata`, `RagConfiguration`, `RagIndexStatus`, `EmbeddingPort`, `TriggerIngestSchema`, and `UpdateRagConfigSchema`)
  - `src/ai/contracts/index.ts` (Exported ingestion contracts)
  - `src/ai/ingestion/normalizers/content-normalizer.ts` (Full multilingual and Arabic-tailored text normalizer: Unicode NFKC, tatweel stripping, tashkeel/harakat removal, Alef/Teh Marbuta/Alef Maksura normalization, HTML tag stripping, and deterministic SHA-256 content hashing)
  - `src/ai/ingestion/chunkers/semantic-chunker.ts` (Semantic, block-aware chunker with English and Arabic token estimation, sentence/paragraph boundary splitting without slicing Arabic words, heading carryover context, deterministic UUID point IDs, and rich metadata hierarchy)
  - `src/lib/qdrant/vector-store.ts` (Resilient Qdrant REST vector store adapter with automatic in-memory fallback and exact cosine similarity calculations for seamless testing and offline resilience)
  - `src/ai/embeddings/ports/embedding-port.ts` & `src/ai/embeddings/adapters/deterministic-embedding-adapter.ts` (1024-dimensional normalized embedding adapter)
  - `src/ai/embeddings/index.ts` (Exported embedding services)
  - `src/ai/ingestion/parsers/project-parser.ts` (Extracts published projects, problem/constraints/solution/architecture/tradeoffs/results, and tags)
  - `src/ai/ingestion/parsers/cv-parser.ts` (Extracts published CV version overview, competencies, and professional summaries)
  - `src/ai/ingestion/parsers/section-parser.ts` (Extracts dynamic page sections, headings, cards, and metrics)
  - `src/ai/ingestion/parsers/index.ts` (Composite `parseAllSources`)
  - `src/ai/ingestion/indexers/rag-indexer.ts` (Idempotent indexing with content-hash checks, relational database persistence, and vector store upsertion/tombstoning)
  - `src/ai/ingestion/jobs/ingestion-service.ts` (Job lifecycle management, telemetry, config updates, status queries, and baseline offline fallbacks)
  - `src/ai/ingestion/index.ts` (Ingestion module index)
  - `app/api/admin/rag/status/route.ts` (GET status endpoint guarded by `requireAdmin`)
  - `app/api/admin/rag/ingest/route.ts` (POST ingestion trigger endpoint guarded by `requireAdmin` and `TriggerIngestSchema`)
  - `app/api/admin/rag/config/route.ts` (GET and PATCH RAG runtime configuration endpoint guarded by `requireAdmin` and `UpdateRagConfigSchema`)
  - `src/modules/localization/infrastructure/core-system-keys.ts` (Added 12 bilingual Arabic RTL and English LTR keys for RAG admin pipeline)
  - `src/modules/admin/presentation/rag-pipeline-manager.tsx` (Interactive admin UI with telemetry cards, sync trigger, force reindex toggle, and fine-tuning form)
  - `src/modules/admin/presentation/index.ts` (Exported `RagPipelineManager`)
  - `app/[locale]/admin/rag/page.tsx` (Admin route for RAG pipeline with SSR prefetching and dynamic localized metadata)
  - `app/[locale]/admin/layout.tsx` (Added `RAG Pipeline` to admin navigation sidebar)
  - `tests/unit/content-normalizer.test.ts` (14 unit tests covering Arabic diacritics stripping, tatweel removal, letter normalization, HTML stripping, whitespace cleanup, and SHA-256 hash determinism)
  - `tests/unit/semantic-chunker.test.ts` (10 unit tests covering multilingual token estimation, deterministic point UUID generation, heading carryover, boundary preservation, and Arabic word preservation)
  - `tests/unit/vector-store.test.ts` (6 unit tests covering collection creation, upsert, cosine search, filtering, and deletion)
  - `tests/unit/parsers.test.ts` (3 unit tests covering CV, dynamic sections, and composite parsing)
  - `tests/unit/ingestion-service.test.ts` (5 unit tests covering configuration retrieval, updates, status telemetry, and full ingestion execution)
  - `tests/integration/rag-ingestion-endpoints.test.ts` (8 integration tests covering security barriers, status retrieval, ingest triggering, and config validation)
  - `tests/integration/rag-pipeline-ui.test.tsx` (4 integration tests covering rendering telemetry, Arabic RTL layout, sync triggering, and configuration saving)
- Tests:
  - Total: 341 unit/integration tests passing in Vitest across 50 test suites (50/50 passing)
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js production build clean (all 35 routes compiled cleanly).
- Next: F023 — BGE-M3 embedding adapter

### F023: BGE-M3 Embedding Adapter (DONE)
- Implemented official BGE-M3 multilingual embedding adapter and dynamic factory integration:
  - `src/ai/embeddings/adapters/bge-m3-embedding-adapter.ts` (`BgeM3EmbeddingAdapter` implementing `EmbeddingPort` with 1024 dense dimension, `l2Normalize` unit normalization, configurable batching, HuggingFace TEI endpoint support, OpenAI-compatible `/v1/embeddings` endpoint support, bounded exponential backoff retries, offline fallback to deterministic embedding generator, and bilingual health check)
  - `src/ai/embeddings/factory.ts` (`getActiveEmbeddingAdapter` dynamically querying active model assignment for `capability: "embedding"`, matching provider configuration, decrypting API key from `secretsService`, and applying runtime policy timeouts/retries with zero-crash fallback)
  - `src/ai/embeddings/index.ts` (Exported embedding ports, deterministic adapter, BGE-M3 adapter, and dynamic factory)
  - `tests/unit/bge-m3-embedding-adapter.test.ts` (8 unit tests covering L2 normalization, dimension/model properties, deterministic offline generation, TEI JSON format parsing, OpenAI JSON format parsing, retry backoff on failure, and health check validation)
  - `tests/integration/embedding-factory.test.ts` (3 integration tests covering dynamic resolution from model registry, secret decryption, and graceful offline fallback)
- Tests:
  - Total: 353 unit/integration tests passing in Vitest across 52 test suites (52/52 passing)
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js production build clean (all 35 routes compiled cleanly).
### F024: Hybrid Retrieval (DONE)
- Implemented production dense and sparse hybrid retrieval with Reciprocal Rank Fusion (RRF), Arabic & English lexical BM25, and scoped metadata filtering:
  - `src/ai/contracts/retrieval.ts` (`RetrievalFilter`, `RetrievalQuery`, `ScoredCandidate`, `DenseRetrieverPort`, `SparseRetrieverPort`, `FusionStrategyPort`, `HybridRetrievalOptions`, `RetrievalTelemetry`, `HybridRetrievalResult`, and Zod schema `HybridSearchSchema`)
  - `src/ai/contracts/index.ts` (Re-exported retrieval contracts)
  - `src/ai/retrieval/filters/filter-builder.ts` (`buildVectorSearchFilter`, `matchesRetrievalFilter`, `createProjectScopeFilter`, `createCvFilter`, `createSectionScopeFilter`)
  - `src/lib/qdrant/vector-store.ts` (Added array-in-filter evaluation and `scrollPoints` implementation for lexical and in-memory indexing)
  - `src/ai/retrieval/dense/dense-retriever.ts` (`DenseRetriever` implementing `DenseRetrieverPort`, using BGE-M3 or active embedding model and vector search with metadata filtering and graceful fallback)
  - `src/ai/retrieval/sparse/arabic-bm25-tokenizer.ts` (Multilingual Arabic/English tokenizer with Unicode NFKC, tatweel removal, tashkeel diacritic removal, Alef/Teh Marbuta/Alef Maksura normalization, bilingual stopword filtering, term frequency, and Okapi BM25 scoring)
  - `src/ai/retrieval/sparse/sparse-retriever.ts` (`SparseRetriever` implementing `SparseRetrieverPort`, performing BM25 scoring over relational database chunks with vector store fallback)
  - `src/ai/retrieval/fusion/rrf-fusion.ts` (`ReciprocalRankFusion` implementing standard $RRF(d) = \sum \frac{1}{k + rank}$ fusion with $k=60$ default, candidate capping, and `LinearScoreFusion` comparative strategy)
  - `src/ai/retrieval/hybrid/hybrid-retriever.ts` (`HybridRetriever` orchestrating concurrent dense and sparse retrieval via `Promise.all`, RRF fusion, candidate cap enforcement, and telemetry tracking)
  - `src/ai/retrieval/index.ts` (Unified export of all retrieval ports, classes, and utilities)
  - `app/api/admin/rag/search/route.ts` (Admin-protected testing endpoint for hybrid/dense/sparse retrieval)
  - `src/modules/admin/presentation/rag-pipeline-manager.tsx` (Added interactive "Hybrid Retrieval Playground" card supporting real-time query testing in Arabic/English, mode selection, candidate inspection, and latency telemetry)
  - Tests:
    - `tests/unit/arabic-bm25-tokenizer.test.ts` (6 tests)
    - `tests/unit/rrf-fusion.test.ts` (4 tests)
    - `tests/unit/filter-builder.test.ts` (4 tests)
    - `tests/unit/dense-retriever.test.ts` (4 tests)
    - `tests/unit/sparse-retriever.test.ts` (4 tests)
    - `tests/integration/hybrid-retriever.test.ts` (3 tests)
    - `tests/integration/admin-rag-search-route.test.ts` (4 tests)
- Tests:
  - Total: 382 unit/integration tests passing in Vitest across 59 test suites (59/59 passing)
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js production build clean (all 36 routes compiled cleanly).
- Next: F025 — Query Router

### F025: Query Router (DONE)
- Implemented production Query Router adhering strictly to `docs/ai/06_QUERY_ROUTER.md` and `docs/ai/01_MODULAR_RAG_OVERVIEW.md`:
  - `src/ai/contracts/router.ts` (`RouteId` [profile, project, skills, experience, certification, technical_detail, job_fit, cv, broad_portfolio], `RetrievalPolicy`, `QueryRouteDefinition`, `RouterOutput`, `QueryRouterPort`, and strict `RouterOutputSchema`)
  - `src/ai/contracts/index.ts` (Re-exported router contracts)
  - `src/ai/router/baseline-routes.ts` (`BASELINE_RETRIEVAL_POLICIES` and `BASELINE_QUERY_ROUTES` with bilingual Arabic and English intent indicators, default fallback broad policy, and scope mappings)
  - `src/ai/router/rule-based-classifier.ts` (Fast deterministic regex & keyword classifier with Arabic diacritic normalization, tatweel removal, and entity hint extraction)
  - `src/ai/router/query-router.ts` (`QueryRouter` implementing `QueryRouterPort`, validating output with `RouterOutputSchema` and guaranteeing safe fallback to `broad_portfolio` policy on uncertainty)
  - `src/ai/router/index.ts` (Unified router module export)
  - `app/api/admin/ai/router/test/route.ts` (Admin-authenticated testing endpoint for route validation)
  - Tests:
    - `tests/unit/rule-based-classifier.test.ts` (20 tests)
    - `tests/unit/query-router.test.ts` (5 tests)
    - `tests/integration/admin-router-test-route.test.ts` (4 tests)
- Tests:
  - Total: 411 unit/integration tests passing in Vitest across 62 test suites (62/62 passing)
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js production build clean (all 37 routes compiled cleanly).
- Next: F026 — Query Rewriting

## Overall progress

- Total features: 50
- DONE: 25
- IN_PROGRESS: 0
- BLOCKED: 0
- PENDING: 25

The agent must update these totals when statuses change.


