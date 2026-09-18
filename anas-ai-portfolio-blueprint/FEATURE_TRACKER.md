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
| F026 | Query Rewriting | AI | **DONE** | Configurable multilingual multi-query rewriting. |
| F027 | BGE reranker adapter | AI | **DONE** | Default multilingual reranking adapter. |
| F028 | Context builder/dedup/budget | AI | **DONE** | Deterministic context packing and token budget. |
| F029 | Grounded generation & citations | AI | **DONE** | Evidence-bound answers, source mapping and citation validation. |
| F030 | Conversation language matching | AI/Frontend | **DONE** | Assistant replies in user's conversational language. |
| F031 | Portfolio AI Chat | Feature | **DONE** | Public streaming chatbot with citations. |
| F032 | Conversation Mode | Feature | **DONE** | General / Recruiter / Technical modes. |
| F033 | Ask AI About This Project | Feature | **DONE** | Hard project scope retrieval filter. |
| F034 | Job Fit Analyzer | Feature | **DONE** | Maps pasted JD requirements to verified portfolio evidence. |
| F035 | AI Lab | Feature | **DONE** | Public interactive AI demonstrations configured from admin. |
| F036 | RAG Debug View | Feature | **DONE** | Safe retrieval telemetry without chain-of-thought. |
| F037 | Evaluation Dashboard | Feature | **DONE** | Public/admin metrics for retrieval/generation quality. |
| F038 | AI evaluation runner | AI | **DONE** | Dataset-driven regression evaluation. |
| F039 | Admin content center | Admin | **DONE** | Manage pages, sections, blocks, projects and publishing. |
| F040 | Admin AI control center | Admin | **DONE** | Full RAG/model/prompt/API configuration UI. |
| F041 | Audit log | Admin/Security | **DONE** | Immutable-style audit events for sensitive changes. |
| F042 | Feature flags | Ops/Admin | **DONE** | Controlled rollout of risky features. |
| F043 | Caching & invalidation | Performance | **DONE** | Tag/key-based cache strategy with correct invalidation. |
| F044 | Rate limiting & abuse protection | Security | **DONE** | Chat/auth/job-fit/admin rate limits. |
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

### F026: Query Rewriting (DONE)
- Implemented production multilingual multi-query rewriting adhering strictly to `docs/ai/07_QUERY_REWRITING.md`:
  - `src/ai/contracts/query-rewriter.ts` (`QueryRewriteInput`, `QueryRewriteOptions`, `QueryRewriteResult`, `QueryRewriterPort`, `RewriteQueriesSchema`, `RewriteTestInputSchema`)
  - `src/ai/contracts/index.ts` (Re-exported query rewriter contracts)
  - `src/ai/query-rewrite/heuristic-rewriter.ts` (Deterministic multilingual heuristic rewriter with entity hint expansion, portfolio scope expansion, Arabic diacritic normalization, and stopword cleaning)
  - `src/ai/query-rewrite/query-rewriter.ts` (`QueryRewriter` orchestrator resolving active rewrite model assignment from model registry, rendering `query_rewriter` prompt from prompt registry, performing OpenAI-compatible bounded completions with retry/timeout, safely parsing JSON query arrays, and seamlessly falling back to heuristic expansion on any upstream failure)
  - `src/ai/query-rewrite/index.ts` (Unified export of rewriter contracts, heuristics, and service)
  - `app/api/admin/ai/rewrite/test/route.ts` (Admin-protected testing endpoint for rewriting validation)
  - Tests:
    - `tests/unit/heuristic-rewriter.test.ts` (6 tests)
    - `tests/unit/query-rewriter-service.test.ts` (4 tests)
    - `tests/integration/admin-rewrite-test-route.test.ts` (4 tests)
- Tests:
  - Total: 425 unit/integration tests passing in Vitest across 65 test suites (65/65 passing)
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js production build clean (all 38 static/dynamic routes compiled cleanly).
- Next: F027 — BGE reranker adapter

### F027: BGE Reranker Adapter (DONE)
- Implemented production multilingual cross-encoder reranking adhering strictly to `docs/ai/08_RERANKER_BGE_V2_M3.md`:
  - `src/ai/contracts/reranker.ts` (`RerankFallbackPolicy`, `ScoreCalibrationMethod`, `RerankCandidate`, `RerankedCandidate`, `RerankOptions`, `RerankTelemetry`, `RerankResult`, `RerankerPort`, `RerankCandidateInputSchema`, `RerankTestInputSchema`)
  - `src/ai/contracts/index.ts` (Re-exported reranker contracts)
  - `src/ai/reranker/heuristic-reranker.ts` (`HeuristicReranker` providing fast deterministic bilingual lexical scoring, token overlap calculation, heading/title match bonuses, exact phrase boost, and candidate threshold filtering)
  - `src/ai/reranker/bge-reranker-adapter.ts` (`BgeRerankerAdapter` implementing `RerankerPort` with default model `BAAI/bge-reranker-v2-m3`, supporting HuggingFace TEI endpoints, OpenAI/Cohere-compatible `/v1/rerank` endpoints, and HuggingFace Inference API, Sigmoid logit calibration mapping cross-entropy logits to $[0.0, 1.0]$, top-N filtering, minThreshold pruning, exponential backoff retries, and configurable fallback policies: `degrade_to_fused_ordering` or `fail_safely`)
  - `src/ai/reranker/factory.ts` (`getActiveRerankerAdapter` dynamically querying active model assignment for `capability: "reranking"`, matching provider configuration, decrypting API key from `secretsService`, and applying runtime policy timeouts/retries with zero-crash fallback)
  - `src/ai/reranker/index.ts` (Unified reranker module index)
  - `app/api/admin/ai/rerank/test/route.ts` (Admin-authenticated testing endpoint for cross-encoder reranking)
  - `src/modules/admin/presentation/rag-pipeline-manager.tsx` (Integrated interactive BGE Reranker card directly within the Hybrid Retrieval Playground, displaying rerank telemetry, rank migrations `(was #N)`, and calibrated scores)
  - Tests:
    - `tests/unit/heuristic-reranker.test.ts` (6 tests)
    - `tests/unit/bge-reranker-adapter.test.ts` (9 tests)
    - `tests/integration/reranker-factory.test.ts` (2 tests)
    - `tests/integration/admin-rerank-test-route.test.ts` (4 tests)
- Tests:
  - Total: 446 unit/integration tests passing in Vitest across 69 test suites (69/69 passing)
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js production build clean (all 39 static/dynamic routes compiled cleanly).
- Next: F028 — Context builder/dedup/budget

### F028: Context Builder, Deduplication & Budgeting (DONE)
- Implemented production deterministic context builder adhering strictly to `docs/ai/09_CONTEXT_BUILDER.md`, `docs/ai/14_PROMPT_INJECTION_AND_RAG_SECURITY.md`, and `docs/ai/16_RAG_CONFIGURATION_SCHEMA.md`:
  - `src/ai/contracts/context-builder.ts` (`ContextInputCandidate`, `CitationReference`, `ContextChunk`, `ContextBuilderOptions`, `ContextBuilderTelemetry`, `ContextBuilderResult`, `ContextBuilderPort`, `ContextBuilderOptionsSchema`, `ContextBuilderTestInputSchema`)
  - `src/ai/contracts/index.ts` (Re-exported context-builder contracts)
  - `src/ai/context/deduplicator.ts` (`extractTokenShingles`, `computeJaccardSimilarity`, `isNearDuplicate` catching exact hash duplicates and sliding-window / near-identical sentences across English and Arabic)
  - `src/ai/context/token-budgeter.ts` (`estimateTokenCount` with calibrated English and Arabic word/character ratios, and `TokenBudgeter` managing cumulative budget allocations)
  - `src/ai/context/security-delimiters.ts` (`sanitizeContextContent` escaping breakout tags, and `formatRetrievedContext` packaging evidence into XML delimiters `<retrieved_context>` ... `<source id="..." ...>`)
  - `src/ai/context/context-builder.ts` (`ContextBuilder` implementing `ContextBuilderPort`, dynamically querying RAG configuration `contextTokenBudget`, prioritizing reranked scores, enforcing `perSourceCap`, deduplicating overlapping chunks, strictly packing within token limits, and preserving citation references)
  - `src/ai/context/index.ts` (Unified context module export)
  - `app/api/admin/ai/context/test/route.ts` (Admin-authenticated testing endpoint for context packing)
  - Tests:
    - `tests/unit/deduplicator.test.ts` (5 tests)
    - `tests/unit/token-budgeter.test.ts` (4 tests)
    - `tests/unit/security-delimiters.test.ts` (3 tests)
    - `tests/unit/context-builder.test.ts` (6 tests)
    - `tests/integration/admin-context-test-route.test.ts` (4 tests)
- Tests:
  - Total: 468 unit/integration tests passing in Vitest across 74 test suites (74/74 passing)
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js production build clean (all 40 static/dynamic routes compiled cleanly).
- Next: F029 — Grounded generation & citations

### F029: Grounded Generation & Citations (DONE)
- Implemented production evidence-bound answer generation adhering strictly to `docs/ai/10_GENERATION_AND_CITATIONS.md`, `docs/ai/13_AI_FAILURES_FALLBACKS.md`, and `docs/ai/14_PROMPT_INJECTION_AND_RAG_SECURITY.md`:
  - `src/ai/contracts/generation.ts` (`ConversationMode`, `ResponseLanguage`, `CitationMapping`, `CitationValidationResult`, `GroundedGenerationTelemetry`, `GroundedAnswer`, `GenerationOptions`, `GenerationInput`, `GenerationPort`, `CitationValidatorPort`, Zod validation schemas)
  - `src/ai/contracts/index.ts` (Re-exported generation contracts)
  - `src/ai/citations/citation-validator.ts` (`stripChainOfThought` removing `<think>` reasoning tokens, `CitationValidator` parsing `[cit:ID]` and `[ID]` patterns against citation catalogs, pruning hallucinated markers, validating language consistency, and mapping verified citations)
  - `src/ai/citations/index.ts` (Unified citations module export)
  - `src/ai/generation/grounding-fallbacks.ts` (`createInsufficientEvidenceAnswer` providing deterministic bilingual fallback when context chunks are empty with 0 API tokens and <1ms latency, `isInsufficientEvidenceText` detector)
  - `src/ai/generation/adapters/heuristic-generation-adapter.ts` (`generateHeuristicAnswer` deterministic offline fallback synthesizer creating factual, cited answers directly from context chunks)
  - `src/ai/generation/grounded-generator.ts` (`GroundedGenerator` orchestrator dynamically resolving active generation model assignment from model registry, decrypting API keys from `secretsService`, rendering prompt templates via `promptService`, calling OpenAI-compatible `/chat/completions` endpoints with bounded timeout, falling back seamlessly to offline heuristic generation on network or provider errors, validating citations, and compiling structured telemetry)
  - `src/ai/generation/index.ts` (Unified generation module export)
  - `app/api/admin/ai/generate/test/route.ts` (Admin-authenticated testing endpoint for grounded generation and citation validation)
  - Tests:
    - `tests/unit/citation-validator.test.ts` (8 tests)
    - `tests/unit/grounding-fallbacks.test.ts` (3 tests)
    - `tests/unit/grounded-generator.test.ts` (5 tests)
    - `tests/integration/admin-generate-test-route.test.ts` (4 tests)
- Tests:
  - Total: 488 unit/integration tests passing in Vitest across 78 test suites (78/78 passing)
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js production build clean (all 41 static/dynamic routes compiled cleanly).
- Next: F030 — Conversation language matching

### F030: Conversation Language Matching (DONE)
- Implemented production conversational language resolution and direction matching adhering strictly to `docs/ai/11_LANGUAGE_RESOLUTION.md` and `docs/frontend/02_BILINGUAL_RTL_LTR.md`:
  - `src/ai/contracts/language-resolution.ts` (`ScriptDirection`, `LanguageResolutionStrategy`, `LanguageResolutionInput`, `LanguageResolutionResult`, `LanguageResolverPort`, Zod validation schemas)
  - `src/ai/contracts/index.ts` (Re-exported language resolution contracts)
  - `src/ai/language/heuristic-resolver.ts` (`getScriptDirection`, `resolveLanguageHeuristics` evaluating explicit instructions in Arabic and English, Unicode script frequencies, Arabic and English sentence indicators/particles, handling Arabic framing with English technical terms, English framing with Arabic project names, single-word loanwords, and weak conversationLocale / previousLanguage fallback)
  - `src/ai/language/language-resolver.ts` (`LanguageResolver` service implementing `LanguageResolverPort`)
  - `src/ai/language/index.ts` (Unified language module export)
  - `src/ai/generation/grounded-generator.ts` (Integrated `languageResolver` to automatically resolve conversational language when `responseLanguage` is omitted in `GenerationInput`)
  - `app/api/admin/ai/language/test/route.ts` (Admin-authenticated testing endpoint for conversational language resolution)
  - Tests:
    - `tests/unit/heuristic-language-resolver.test.ts` (10 tests)
    - `tests/unit/language-resolver.test.ts` (4 tests)
    - `tests/integration/admin-language-test-route.test.ts` (4 tests)
- Tests:
  - Total: 506 unit/integration tests passing in Vitest across 81 test suites (81/81 passing)
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js production build clean (all 42 static/dynamic routes compiled cleanly).
### F031: Portfolio AI Chat (DONE)
- Implemented production public portfolio AI chat adhering strictly to `docs/features/03_PORTFOLIO_AI_CHAT.md`, `docs/ai/10_GENERATION_AND_CITATIONS.md`, `docs/ai/11_LANGUAGE_RESOLUTION.md`, `docs/frontend/02_BILINGUAL_RTL_LTR.md`, and `docs/frontend/03_DESIGN_SYSTEM_AND_THEMING.md`:
  - `src/modules/localization/infrastructure/core-system-keys.ts` (Added 24 localized chat keys covering trigger labels, title, modes, suggested prompt chips, empty states, input placeholders, send/stop actions, disclaimer, and insufficient evidence)
  - `src/ai/orchestration/chat-orchestrator.ts` (`ChatOrchestrator` coordinating language resolution -> query router -> query rewriting -> hybrid retrieval -> cross-encoder reranking -> context builder -> grounded generation)
  - `app/api/chat/route.ts` (Public `POST /api/chat` supporting both SSE streaming `text/event-stream` with chunk-by-chunk deltas + terminal metadata event, and JSON completions)
  - `src/modules/chat/presentation/chat-citation-badge.tsx` (Interactive citation pill with click-to-view popover displaying title, source type, section hierarchy, and link to project/CV)
  - `src/modules/chat/presentation/chat-message.tsx` (Chat bubble rendering markdown, LTR-enforced code blocks, and interactive citation badges)
  - `src/modules/chat/presentation/chat-drawer.tsx` (Floating trigger button, slide-over drawer modal dialog, conversation mode tabs [General, Recruiter, Technical], empty state with suggested prompt chips, message thread with auto-scroll, error state with retry, and streaming SSE consumer)
  - `src/modules/chat/presentation/index.ts` (Unified chat presentation barrel export)
  - `app/[locale]/(public)/layout.tsx` (Mounted `<ChatDrawer />` in public layout inside `LocalizationProvider`)
  - Tests:
    - `tests/unit/chat-orchestrator.test.ts` (2 tests)
    - `tests/unit/chat-citation-badge.test.tsx` (3 tests)
    - `tests/integration/chat-api-route.test.ts` (3 tests)
    - `tests/integration/chat-drawer.test.tsx` (5 tests)
- Tests:
  - Total: 519 unit/integration tests passing in Vitest across 85 test suites (85/85 passing)
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js production build clean (all 43 static/dynamic routes compiled cleanly).
### F032: Conversation Mode (DONE)
- Implemented production conversation mode system adhering strictly to `docs/features/10_CONVERSATION_MODE.md`, `docs/features/03_PORTFOLIO_AI_CHAT.md`, `docs/ai/10_GENERATION_AND_CITATIONS.md`, `docs/admin/04_PROMPT_MANAGEMENT.md`, and `docs/frontend/02_BILINGUAL_RTL_LTR.md`:
  - `src/ai/contracts/conversation-mode.ts` (`ConversationModeConfig`, `LocalizedConversationMode`, `UpdateConversationModeInput`, `ConversationModePort`, and Zod validation schemas)
  - `src/ai/contracts/index.ts` (Re-exported conversation mode contracts)
  - `src/lib/db/schema/ai.ts` (Added `conversationModes` table with fields for English & Arabic names/descriptions, tone guidelines, focus areas, prompt slug, enabled/published flags, and sorting)
  - `src/ai/modes/baseline-modes.ts` (Authentic baseline definitions for General, Recruiter, and Technical modes with full bilingual support)
  - `src/ai/modes/conversation-mode-service.ts` (`ConversationModeService` implementing `ConversationModePort` with in-memory TTL caching, database querying with graceful fallback to baseline modes, localized projection, server-side mode verification guard sanitizing invalid modes to "general", and admin update with audit logging)
  - `src/ai/modes/index.ts` (Unified modes barrel export)
  - `src/ai/generation/grounded-generator.ts` (Dynamically resolves conversation mode configuration, interpolating tone guidelines and focus areas into prompt rendering)
  - `src/ai/orchestration/chat-orchestrator.ts` (Verifies client conversation mode via `conversationModeService.verifyMode` before retrieval and generation)
  - `app/api/chat/modes/route.ts` (Public `GET /api/chat/modes` returning localized array of active published conversation modes)
  - `app/api/admin/ai/modes/route.ts` (Admin-authenticated `GET` endpoint returning all mode configurations)
  - `app/api/admin/ai/modes/[id]/route.ts` (Admin-authenticated `PATCH` endpoint for updating mode settings and prompts)
  - `src/modules/chat/presentation/chat-drawer.tsx` (Dynamic mode selector fetching published modes from `/api/chat/modes`, displaying localized titles and descriptions)
  - Tests:
    - `tests/unit/conversation-mode-service.test.ts` (10 tests)
    - `tests/integration/conversation-modes-api.test.ts` (8 tests)
    - `tests/integration/chat-modes-integration.test.ts` (3 tests)
- Tests:
  - Total: 540 unit/integration tests passing in Vitest across 88 test suites (88/88 passing)
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js production build clean (all 45 static/dynamic routes compiled cleanly).
### F033: Ask AI About This Project (DONE)
- Implemented production project-scoped chat system adhering strictly to `docs/features/12_ASK_AI_PROJECT.md`, `docs/features/03_PORTFOLIO_AI_CHAT.md`, `docs/ai/03_HYBRID_RETRIEVAL.md`, and `docs/frontend/02_BILINGUAL_RTL_LTR.md`:
  - `src/modules/localization/infrastructure/core-system-keys.ts`: Added bilingual keys (`chat.scope.badge`, `chat.scope.exit`, `chat.scope.all_portfolio`, `chat.scope.prompt.architecture`, `chat.scope.prompt.performance`, `chat.scope.prompt.data_flow`).
  - `src/ai/contracts/generation.ts`: Added `currentScope?: string | undefined` to `GenerationInput`.
  - `src/ai/generation/grounded-generator.ts`: Interpolated `current_scope` into prompt variables.
  - `src/ai/orchestration/chat-orchestrator.ts`: Implemented hard scope retrieval filter (`sourceId = projectScopeId`, `sourceType = "project"`), optional global context fusion, and scope telemetry (`projectScopeId`, `isScopedRetrieval`).
  - `app/api/chat/route.ts`: Added `projectScopeTitle` and `allowGlobalContext` to `ChatRequestSchema` and forwarded to orchestrator.
  - `src/modules/chat/presentation/chat-drawer.tsx`: Added `activeScopeId`/`activeScopeTitle` state, `open-project-chat` window custom event listener, prop sync, Scope Badge with `Exit Scope` button, and dynamic project prompt concepts.
  - `src/modules/projects/presentation/project-deep-dive.tsx`: Connected "Launch AI Project Query" button and suggestion chips with `openProjectChat` dispatching `open-project-chat` event.
  - Tests:
    - `tests/unit/chat-orchestrator.test.ts` (3 tests verifying hard retrieval filter and scope telemetry)
    - `tests/integration/scoped-project-chat.test.tsx` (3 tests verifying scope badge, prompt suggestions, exit scope action, and custom event dispatch)
- Tests:
  - Total: 544 unit/integration tests passing in Vitest across 89 test suites (89/89 passing)
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js production build clean (all 45 static/dynamic routes compiled cleanly).
- Next: F034 — Job Fit Analyzer

### F034: Job Fit Analyzer (DONE)
- Implemented production Job Fit Analyzer adhering strictly to `docs/features/13_JOB_FIT_ANALYZER.md`, `prompts/job-fit.md`, `docs/features/01_GUEST_ACCESS.md`, `docs/frontend/06_RESPONSIVE_ACCESSIBILITY.md`, and `docs/testing/02_RTL_LTR_TEST_MATRIX.md`:
  - `src/ai/contracts/job-fit.ts`: Core domain models (`JobFitEvidenceStatus`, `JobFitCitation`, `JobFitRequirementMatch`, `JobFitAnalysisSummary`, `JobFitAnalysisResult`, and `JobFitRequestSchema` validation).
  - `src/ai/contracts/index.ts`: Exported job-fit contracts.
  - `src/ai/job-fit/job-fit-service.ts`: `JobFitService` orchestrating language resolution, hybrid retrieval (`policy-job-fit`), cross-encoder reranking, context budgeting, prompt rendering, LLM completion, citation grounding/validation, and offline heuristic alignment fallback with zero persistence.
  - `src/ai/job-fit/index.ts`: Barrel export.
  - `app/api/job-fit/route.ts`: Public validated `POST /api/job-fit` endpoint returning structured alignment results.
  - `src/modules/localization/infrastructure/core-system-keys.ts`: Added 26 bilingual keys for Job Fit Analyzer (titles, status pills, filter tabs, sample JDs, confidentiality badge, report copying).
  - `src/modules/job-fit/presentation/job-fit-analyzer.tsx`: Premium recruiter-focused UI with sample JD loaders, match percentage gauge, status breakdown pills, filterable requirement cards, interactive citation badges, and clipboard report export.
  - `src/modules/job-fit/presentation/index.ts`: Barrel export.
  - `app/[locale]/(public)/job-fit/page.tsx`: Public route with dynamic localized metadata.
  - Tests:
    - `tests/unit/job-fit-service.test.ts` (4 unit tests verifying structured LLM parsing, citation grounding, heuristic fallback, and Arabic language resolution)
    - `tests/integration/job-fit-api.test.ts` (3 integration tests verifying input validation, successful matching, and server error handling)
    - `tests/integration/job-fit-ui.test.tsx` (4 integration tests covering rendering, sample selection, analysis submission, status filtering, and Arabic RTL layout)
- Tests:
  - Total: 555 unit/integration tests passing in Vitest across 92 test suites (92/92 passing)
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js production build clean (all 48 static/dynamic routes compiled cleanly).
- Next: F035 — AI Lab

### F035: AI Lab (DONE)
- Implemented production interactive AI Lab demonstration platform adhering strictly to `docs/features/14_AI_LAB.md`, `MASTER_BUILD_SPEC.md`, `docs/features/01_GUEST_ACCESS.md`, and `docs/frontend/06_RESPONSIVE_ACCESSIBILITY.md`:
  - `src/lib/db/schema/ai.ts`: Added `aiLabDemos` table with slug, demo type, bilingual titles/descriptions, publication state, rate limit RPM, timeout, and sorting.
  - `src/ai/contracts/ai-lab.ts`: Defined `AiLabDemoType`, `AiLabDemoConfig`, `LocalizedAiLabDemo`, `AiLabExecutionTelemetry`, `AiLabExecutionResult`, `AiLabExecutionInput`, `AiLabRunSchema`, `UpdateAiLabDemoSchema`, and `AiLabPort`.
  - `src/ai/contracts/index.ts`: Re-exported AI Lab contracts.
  - `src/ai/lab/baseline-demos.ts`: Configured 5 production baseline demos (`hybrid-search`, `reranking`, `retrieval-comparison`, `structured-extraction`, `citation-verification`).
  - `src/ai/lab/ai-lab-service.ts`: Implemented `AiLabService` executing real underlying pipelines (dense vector search, sparse BM25, RRF fusion, cross-encoder reranking with delta metrics, schema-constrained structured extraction, and citation verification with hallucination defense). Includes TTL in-memory caching, 300ms bounded DB fallback, and admin audit logging.
  - `src/ai/lab/index.ts`: Barrel export.
  - `app/api/lab/demos/route.ts`: Public `GET /api/lab/demos` returning published demonstrations.
  - `app/api/lab/run/route.ts`: Public `POST /api/lab/run` validating input against `AiLabRunSchema` and returning authentic execution results and latency telemetry.
  - `app/api/admin/ai/lab/route.ts`: Admin `GET /api/admin/ai/lab` returning all demos with `requireAdmin` guard.
  - `app/api/admin/ai/lab/[id]/route.ts`: Admin `PATCH /api/admin/ai/lab/[id]` for toggling publication, rate limits, timeouts, and sort order.
  - `src/modules/localization/infrastructure/core-system-keys.ts`: Added `"lab"` to category union and added 25 bilingual keys.
  - `src/modules/navigation/infrastructure/default-navigation.ts` & `src/modules/navigation/presentation/nav-icon.tsx`: Integrated AI Lab navigation item (`/lab`) and `FlaskConical` icon.
  - `src/modules/ai-lab/presentation/ai-lab-view.tsx`: Interactive demo runner with tab switcher, parameter sliders/inputs, sample presets, execution engine, live telemetry bar (latency/tokens/authenticity), visual cards (rank shift indicators, side-by-side comparison columns, schema validation, groundedness pills), and raw JSON inspector.
  - `src/modules/ai-lab/presentation/index.ts`: Barrel export.
  - `app/[locale]/(public)/lab/page.tsx`: Public route with dynamic localized metadata and server-side demo pre-fetch.
  - Tests:
    - `tests/unit/ai-lab-service.test.ts` (10 tests verifying demo execution, baseline fallback, localization, rank deltas, structured extraction, citation verification, and admin config updates)
    - `tests/integration/ai-lab-api.test.ts` (6 tests verifying public routes, input validation, execution, and admin authorization guards)
    - `tests/integration/ai-lab-ui.test.tsx` (4 tests verifying component rendering, tab switching, parameter adjustments, execution flow, visual outputs, and raw JSON toggle)
- Tests:
  - Total: 575 unit/integration tests passing in Vitest across 95 test suites (95/95 passing)
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js production build clean (all 53 static/dynamic routes compiled cleanly).
### F036: RAG Debug View (DONE)
- Implemented production safe RAG engineering telemetry and transparency view adhering strictly to `docs/features/15_RAG_DEBUG_VIEW.md`, `docs/ai/18_RAG_DEBUG_TELEMETRY_SCHEMA.md`, `docs/features/01_GUEST_ACCESS.md`, and `docs/frontend/06_RESPONSIVE_ACCESSIBILITY.md`:
  - `src/ai/contracts/rag-debug.ts`: Core contracts (`RagDebugStageLatency`, `RagDebugSourceItem`, `RagDebugValidationState`, `RagDebugTelemetry`, `RagDebugRequestSchema`, `RagDebugRequest`).
  - `src/ai/contracts/index.ts`: Re-exported RAG debug contracts.
  - `src/ai/orchestration/chat-orchestrator.ts`: Calculated accurate stage latencies (`routingMs`, `rewriteMs`, `retrievalMs`, `rerankingMs`, `contextMs`, `generationMs`, `totalMs`), gathered sanitized source summaries (id, title, score, snippet), verified citation validation state (citationsCount, ungroundedCount), formatted route label, and preserved zero chain-of-thought and zero secret leakage.
  - `src/modules/localization/infrastructure/core-system-keys.ts`: Added 20 localized keys (`chat.debug.*`) covering button, title, subtitle, stages, waterfall names, metrics, safety notice, and modal actions.
  - `src/modules/chat/presentation/rag-debug-modal.tsx`: Interactive accessible modal (`role="dialog"`) with Escape key / backdrop dismiss, key metrics grid (latency ms, token count, route ID, grounding status), pipeline waterfall visualization, inspected sources list with scores & snippets, model/provider operational info, admin badge for admin traces, and safety guarantee notice.
  - `src/modules/chat/presentation/chat-message.tsx`: Added RAG Trace button with latency indicator (`{totalMs}ms`) next to assistant messages that opens `RagDebugModal`.
  - `src/modules/chat/presentation/chat-drawer.tsx`: Attached `telemetry` from SSE stream `event: done` and non-streaming JSON responses to assistant messages.
  - `src/modules/chat/presentation/index.ts`: Exported `RagDebugModal` and its props.
  - `app/api/admin/rag/debug/route.ts`: Secure admin route guarded by `requireAdmin` for running authenticated trace queries with `isAdmin: true`.
  - `src/modules/admin/presentation/rag-pipeline-manager.tsx`: Added live "Live RAG Pipeline Trace (F036)" card supporting test query execution, mode selection, summary metrics, stage latencies breakdown, answer preview, and modal drill-down.
  - Tests:
    - `tests/unit/rag-debug.test.ts` (9 tests verifying schema validation, telemetry generation, positive stage latencies, admin view flag, zero secret/CoT leakage, and project scope telemetry)
    - `tests/integration/rag-debug-api.test.ts` (5 tests verifying 401 unauthorized, 403 forbidden, 400 validation error, and 200 successful execution with admin view)
    - `tests/integration/rag-debug-modal.test.tsx` (11 tests verifying dialog rendering, key metrics, waterfall stages, sources with snippets, admin badge, safety notice, close actions, Escape dismiss, and Arabic RTL layout)
- Tests:
  - Total: 600 unit/integration tests passing in Vitest across 98 test suites (98/98 passing)
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js production build clean (all 54 static/dynamic routes compiled cleanly).
- Next: F037 — Evaluation Dashboard

### F037: Evaluation Dashboard (DONE)
- Implemented production evaluation dashboard and metrics transparency platform adhering strictly to `docs/features/16_EVALUATION_DASHBOARD.md`, `docs/ai/15_AI_EVALUATION.md`, `docs/features/01_GUEST_ACCESS.md`, and `docs/frontend/06_RESPONSIVE_ACCESSIBILITY.md`:
  - `src/ai/contracts/evaluation.ts`: Core contracts (`EvaluationMetricItem`, `EvaluationRunSummary`, `RegressionComparison`, `EvaluationDashboardData`, `CompareRunsRequestSchema`).
  - `src/ai/contracts/index.ts`: Re-exported evaluation contracts.
  - `src/ai/evaluation/baseline-evaluation-data.ts`: Authentic golden benchmark dataset definitions, verified baseline metric measurements (Recall@5: 92.4%, MRR: 0.881, Faithfulness: 98.5%, Latency P95: 412ms, Arabic/English parity: 96.5%), and historical ablation runs.
  - `src/ai/evaluation/evaluation-service.ts`: Implemented `EvaluationService` with TTL in-memory caching, 300ms bounded DB queries joined to datasets, graceful fallback to authentic baselines, run retrieval, and regression delta comparator.
  - `src/ai/evaluation/index.ts`: Barrel export.
  - `app/api/evaluation/metrics/route.ts`: Public `GET /api/evaluation/metrics` with cache control headers.
  - `app/api/admin/evaluation/runs/route.ts`: Admin `GET /api/admin/evaluation/runs` guarded by `requireAdmin`.
  - `app/api/admin/evaluation/compare/route.ts`: Admin `GET /api/admin/evaluation/compare?baselineId=...&candidateId=...` for regression delta comparison.
  - `src/modules/localization/infrastructure/core-system-keys.ts`: Added `"eval"` category and 20 dynamic localized keys.
  - `src/modules/evaluation/presentation/evaluation-dashboard.tsx`: Public 3-tab dashboard (Metrics, Methodology & Datasets, Benchmark Runs with ablation comparison), category filters, and transparency pledge.
  - `src/modules/admin/presentation/evaluation-admin-manager.tsx`: Admin dashboard with active environment cards, regression comparison selector/banner/deltas table, and run history table.
  - `src/modules/evaluation/presentation/index.ts` & `src/modules/admin/presentation/index.ts`: Barrel exports.
  - `app/[locale]/(public)/evaluation/page.tsx`: Public route with localized metadata and server-side prefetch.
  - `app/[locale]/admin/evaluation/page.tsx`: Admin evaluation management page.
  - `app/[locale]/admin/layout.tsx`: Added Evaluation navigation link to admin sidebar.
  - `src/modules/navigation/infrastructure/default-navigation.ts` & `src/modules/navigation/presentation/nav-icon.tsx`: Added `/evaluation` navigation item with `BarChart2` icon.
  - Tests:
    - `tests/unit/evaluation-service.test.ts` (7 tests verifying dashboard data, run comparison, positive/negative delta flags, baseline fallbacks, and DB join parsing)
    - `tests/integration/evaluation-api.test.ts` (7 tests verifying public metrics, admin runs, 401/403 guards, input validation, and run comparison)
    - `tests/integration/evaluation-dashboard.test.tsx` (6 tests verifying public metrics rendering, tabs switching, category filters, and Arabic RTL layout)
    - `tests/integration/evaluation-admin.test.tsx` (4 tests verifying admin layout, environment stats, run history, and regression comparison)
- Tests:
  - Total: 624 unit/integration tests passing in Vitest across 102 test suites (102/102 passing)
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js production build clean (all 61 static/dynamic routes compiled cleanly).
- Next: F038 — AI evaluation runner

### F038: AI Evaluation Runner (DONE)
- Implemented production dataset-driven AI evaluation runner and regression gate adhering strictly to `docs/ai/15_AI_EVALUATION.md`, `docs/testing/03_AI_EVAL_GATE.md`, `docs/features/01_GUEST_ACCESS.md`, and `docs/frontend/06_RESPONSIVE_ACCESSIBILITY.md`:
  - `src/ai/contracts/evaluation.ts`: Core contracts (`EvaluationCategory`, `EvaluationCaseItem`, `EvaluationCaseResult`, `GateVerdict`, `EvaluationGateDecision`, `RunEvaluationRequestSchema`, `EvaluationRunExecutionResponse`).
  - `src/ai/contracts/index.ts`: Re-exported runner contracts.
  - `src/ai/evaluation/golden-benchmark-cases.ts`: Curated authentic golden benchmark test cases (bilingual Arabic RTL and English LTR) separated strictly into retrieval, generation, negative refusal (hallucination defense), project-scoped, and security injection resistance.
  - `src/ai/evaluation/evaluation-runner.ts`: Implemented `EvaluationRunner` engine executing evaluation suites across modes (`full`, `retrieval`, `generation`). Calculates Recall@K, Precision@K, MRR, Faithfulness, Citation Correctness, Answer Relevance, and Refusal Correctness. Computes Arabic/English cross-lingual parity and evaluates release gates (`PASSED`, `WARNING`, `BLOCKED`) with safe DB persistence fallback.
  - `src/ai/evaluation/index.ts`: Barrel export.
  - `app/api/admin/evaluation/run/route.ts`: Secure `POST /api/admin/evaluation/run` endpoint guarded by `requireAdmin(request.headers)` for triggering benchmarks and release gate validations.
  - `src/modules/localization/infrastructure/core-system-keys.ts`: Added 14 dynamic localized keys (`eval.runner.*`) for runner title, description, modes, trigger button, gate verdicts, and results.
  - `src/modules/admin/presentation/evaluation-admin-manager.tsx`: Added interactive "AI Evaluation Runner & Regression Gate (F038)" card with mode selector, benchmark trigger button, live execution indicator, gate verdict badge (`PASSED`, `WARNING`, `BLOCKED`), metric summary pills (Recall@5, Faithfulness, Citation Precision, AR/EN Parity, Latency), and detailed case results table toggle.
  - Tests:
    - `tests/unit/evaluation-runner.test.ts` (7 tests verifying full run, retrieval-only filtering, generation-only filtering, Arabic/English parity, negative refusal, release gate blocking on low faithfulness, and DB timeout safety)
    - `tests/integration/evaluation-runner-api.test.ts` (4 tests verifying 401 unauthorized, 403 forbidden, 400 validation error, and 200 successful execution with gate verdict)
    - `tests/integration/evaluation-admin.test.tsx` (5 tests verifying runner card rendering, benchmark trigger, gate verdict badge, and case results display)
- Tests:
  - Total: 636 unit/integration tests passing in Vitest across 104 test suites (104/104 passing)
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js production build clean (all 61 static/dynamic routes compiled cleanly).
- Next: F039 — Admin content center

### F039: Admin Content Center (DONE)
- Implemented production Admin Content Center adhering strictly to `docs/admin/01_ADMIN_CONTROL_PLANE.md`, `docs/admin/02_CONTENT_AND_SECTION_MANAGEMENT.md`, `docs/admin/05_PUBLISHING_AND_AUDIT.md`, `docs/features/01_GUEST_ACCESS.md`, and `docs/frontend/06_RESPONSIVE_ACCESSIBILITY.md`:
  - `src/modules/content/domain/content-center.ts`: Core domain models (`ContentPublishStatus`, `AdminPageItem`, `AdminSectionItem`, `AdminBlockItem`, `ContentCenterSummary`, `CreatePageSchema`, `UpdatePageStatusSchema`, `CreateSectionSchema`, `UpdateSectionSchema`, `ReorderSectionsSchema`).
  - `src/modules/content/domain/index.ts`: Barrel export.
  - `src/modules/content/infrastructure/baseline-content-data.ts`: Authentic portfolio pages (Home, Projects, CV, Lab, Evaluation, Job Fit), section counts, and summary baselines.
  - `src/modules/content/infrastructure/content-center-service.ts`: Implemented `ContentCenterService` managing CRUD operations for pages, sections, publishing status toggles, accessible section reordering, cascaded deletions, cache invalidation, and immutable audit event logging.
  - `app/api/admin/content/overview/route.ts`: Admin `GET /api/admin/content/overview` returning summary counts and pages. Guarded by `requireAdmin`.
  - `app/api/admin/content/pages/route.ts`: Admin `GET` and `POST` for page listing and creation. Guarded by `requireAdmin`.
  - `app/api/admin/content/pages/[id]/status/route.ts`: Admin `PATCH` for page status transition (`DRAFT` / `PUBLISHED` / `ARCHIVED`). Guarded by `requireAdmin`.
  - `app/api/admin/content/sections/route.ts`: Admin `GET` and `POST` for section management by `pageId`. Guarded by `requireAdmin`.
  - `app/api/admin/content/sections/[id]/route.ts`: Admin `PATCH` and `DELETE` for individual sections. Guarded by `requireAdmin`.
  - `app/api/admin/content/sections/reorder/route.ts`: Admin `POST` for keyboard and drag/drop section reordering. Guarded by `requireAdmin`.
  - `src/modules/localization/infrastructure/core-system-keys.ts`: Added `"content"` to category union and added 5 dynamic localized keys.
  - `src/modules/admin/presentation/content-center-manager.tsx`: Multi-tab admin interface: Pages Management (with inline create route dialog, status badges, and publish/unpublish toggles), Dynamic Section Builder (with page selector, type selector, accessible up/down ordering, and deletion), and Publishing & Review Queue (with verification rules and batch publish).
  - `src/modules/admin/presentation/index.ts`: Re-exported `ContentCenterManager`.
  - `app/[locale]/admin/content/page.tsx`: Admin Content page with localized metadata and server-side data fetch.
  - `app/[locale]/admin/sections/page.tsx`: Section builder alias route.
  - `app/[locale]/admin/layout.tsx`: Sidebar navigation verified for `/admin/content` and `/admin/sections`.
  - Tests:
    - `tests/unit/content-center-service.test.ts` (7 tests verifying summary, page listing, page creation, status updates, section creation, section reordering, and deletion)
    - `tests/integration/content-center-api.test.ts` (9 tests verifying 401, 403, 400 validation, and 200 CRUD/reorder endpoints)
    - `tests/integration/content-center-ui.test.tsx` (6 tests verifying stat cards, pages table, add page form, sections builder with up/down buttons, publishing queue, and Arabic RTL layout)
- Tests:
  - Total: 660 unit/integration tests passing in Vitest across 107 test suites (107/107 passing)
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js production build clean (all 65 static/dynamic routes compiled cleanly).
- Next: F040 — Admin AI control center

### F040: Admin AI Control Center (DONE)
- Implemented comprehensive production Admin AI Control Center adhering strictly to `docs/admin/03_AI_CONTROL_CENTER.md`, `docs/admin/01_ADMIN_CONTROL_PLANE.md`, `docs/ai/15_AI_EVALUATION.md`, `docs/features/01_GUEST_ACCESS.md`, and `docs/frontend/06_RESPONSIVE_ACCESSIBILITY.md`:
  - `src/modules/admin/domain/ai-control.ts`: Domain models, subsystem health definitions, capability binding contracts, and `ValidateAiChangeRequestSchema`.
  - `src/modules/admin/domain/index.ts`: Barrel export.
  - `src/modules/admin/infrastructure/ai-control-service.ts`: Implemented `AiControlService` aggregating real-time subsystem statuses (Providers, Models, RAG, Prompts, Quality Gate) with 300ms bounded DB calls and baselines, pre-flight change validation (`validateChange`) flagging required reindex workflows (e.g. embedding model switches or chunk size modifications), and immutable audit event logging.
  - `app/api/admin/ai/control/overview/route.ts`: Admin `GET /api/admin/ai/control/overview` returning consolidated health, active model bindings matrix, and RAG configuration. Guarded by `requireAdmin`.
  - `app/api/admin/ai/control/validate/route.ts`: Admin `POST /api/admin/ai/control/validate` providing pre-flight change safety validation and recommended gate suites before activating modifications. Guarded by `requireAdmin`.
  - `src/modules/admin/presentation/ai-control-center.tsx`: Executive AI cockpit with health status cards, active capability binding matrix with inline pre-flight check, embedding compatibility mismatch warning banner, multi-tab integration with Providers & Models, RAG Retrieval Controls, and 1-click golden benchmark regression release gate.
  - `src/modules/admin/presentation/index.ts`: Re-exported `AiControlCenter` and its prop contracts.
  - `app/[locale]/admin/ai/page.tsx`: Updated with localized metadata, server-side prefetch with timeout fallbacks, `export const dynamic = "force-dynamic"`, and renders `AiControlCenter`.
  - Tests:
    - `tests/unit/ai-control-service.test.ts` (7 tests verifying overview generation, capability bindings, required fields, embedding change reindex safety flags, generation model context checks, chunk overlap constraints, and runtime policy validation)
    - `tests/integration/ai-control-api.test.ts` (7 tests verifying 401 unauthenticated, 403 non-admin, 200 overview, 400 validation error, and 200 pre-flight validation response)
    - `tests/integration/ai-control-center-ui.test.tsx` (5 tests verifying F040 badge, 5 subsystem health cards, capability matrix, tab navigation, and Arabic RTL layout)
- Tests:
  - Total: 679 unit/integration tests passing in Vitest across 110 test suites (110/110 passing)
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js production build clean (all 67 static/dynamic routes compiled cleanly in 20.9s).
- Next: F041 — Audit log

### F041: Audit Log (DONE)
- Implemented production-grade immutable audit logging system adhering strictly to `docs/admin/05_PUBLISHING_AND_AUDIT.md`, `docs/admin/01_ADMIN_CONTROL_PLANE.md`, `docs/features/01_GUEST_ACCESS.md`, and `docs/frontend/06_RESPONSIVE_ACCESSIBILITY.md`:
  - `src/modules/admin/domain/audit-log.ts`: Core domain models (`AuditEventRecord`, `AuditAction`, `AuditEntityType`, `AuditLogSummary`, `AuditLogQuerySchema`), plus recursive `sanitizeAuditPayload` function that guarantees 100% automatic redaction of passwords, tokens, API keys, and authorization headers from state diffs before persistence or display.
  - `src/modules/admin/domain/index.ts`: Re-exported audit contracts and sanitization utilities.
  - `src/modules/admin/infrastructure/baseline-audit-data.ts`: Authentic historical audit log entries (system init, model assignment, prompt publish, CV publish, reindex, secret update) and summary baseline for resilient offline fallback.
  - `src/modules/admin/infrastructure/audit-log-service.ts`: Implemented `AuditLogService` with immutable persistence to PostgreSQL `auditEvents` table, 300ms bounded DB queries joined to `users` for actor email resolution, multi-attribute filtering (action, entityType, actor, date ranges), summary KPI calculation, and export generation (`format=json|csv`).
  - `app/api/admin/audit/route.ts`: Admin `GET /api/admin/audit` returning filtered audit records and KPI summary. Guarded by `requireAdmin(request.headers)`.
  - `app/api/admin/audit/export/route.ts`: Admin `GET /api/admin/audit/export?format=json|csv` providing compliance audit trail downloads with attachment headers. Guarded by `requireAdmin(request.headers)`.
  - `src/modules/admin/presentation/audit-log-viewer.tsx`: Audit Log Viewer with 4 KPI cards (Total Events, High-Impact Security Actions, Tracked Entity Types, 100% Credential Redaction badge), live action and entity filter dropdowns, real-time search, audit trail table with color-coded action badges, interactive state diff modal (Safe Before vs After JSON comparison), and one-click CSV / JSON export buttons.
  - `src/modules/admin/presentation/index.ts`: Re-exported `AuditLogViewer` and its prop contracts.
  - `app/[locale]/admin/audit/page.tsx`: Production route with localized metadata, server-side prefetch with timeout fallbacks, `export const dynamic = "force-dynamic"`, and renders `AuditLogViewer`.
  - Tests:
    - `tests/unit/audit-log-service.test.ts` (8 tests verifying recursive secret redaction for nested objects/arrays, fallback handling, action/entity filtering, KPI summary aggregation, and JSON/CSV export formatting)
    - `tests/integration/audit-log-api.test.ts` (6 tests verifying 401 unauthenticated, 403 non-admin, 200 audit query, CSV export download headers, and JSON export download headers)
    - `tests/integration/audit-log-ui.test.tsx` (5 tests verifying F041 badge, 4 KPI cards, action/entity badges, diff modal dialog, and Arabic RTL layout)
- Tests:
  - Total: 698 unit/integration tests passing in Vitest across 113 test suites (113/113 passing)
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js production build clean (all 71 static/dynamic routes compiled cleanly in 16.0s).
### F042: Feature Flags (DONE)
- Implemented production Feature Flag management system with canary rollout, evaluation endpoint, and admin controls adhering strictly to `docs/admin/04_FEATURE_FLAGS.md`, `docs/admin/01_ADMIN_CONTROL_PLANE.md`, `docs/features/01_GUEST_ACCESS.md`, and `docs/frontend/06_RESPONSIVE_ACCESSIBILITY.md`:
  - `src/modules/admin/domain/feature-flags.ts`: Domain models (`FeatureFlag`, `FeatureFlagCategory`, `FeatureFlagEvaluationResult`, `UpdateFeatureFlagInputSchema`, `EvaluateFlagsQuerySchema`).
  - `src/modules/admin/domain/index.ts`: Re-exported feature flag contracts.
  - `src/modules/admin/infrastructure/baseline-feature-flags.ts`: Authentic production feature flags covering AI query rewriting, BGE reranker, hybrid search, streaming, lab demos, voice chat, and admin audit logging.
  - `src/modules/admin/infrastructure/feature-flag-service.ts`: Implemented `FeatureFlagService` with TTL in-memory caching, offline override overlay, deterministic hash-based canary rollout evaluation (`computeSimpleHash`), DB upsert to `featureFlags` table, and audit logging to `auditEvents`.
  - `app/api/admin/feature-flags/route.ts`: Admin `GET /api/admin/feature-flags` returning all flags. Guarded by `requireAdmin`.
  - `app/api/admin/feature-flags/[key]/route.ts`: Admin `PATCH /api/admin/feature-flags/[key]` updating state or rollout percentage. Guarded by `requireAdmin`.
  - `app/api/feature-flags/eval/route.ts`: Public evaluation endpoint `GET /api/feature-flags/eval?keys=key1,key2` supporting client-side feature gating.
  - `src/modules/admin/presentation/feature-flag-manager.tsx`: Interactive Feature Flag Manager with category tabs, search input, status badges, canary rollout slider (1-100%), one-click toggle button, and Arabic RTL layout.
  - `src/modules/admin/presentation/index.ts`: Re-exported `FeatureFlagManager`.
  - `app/[locale]/admin/feature-flags/page.tsx`: Production route with localized metadata, server-side prefetch with timeout fallbacks, `export const dynamic = "force-dynamic"`, and renders `FeatureFlagManager`.
  - `app/[locale]/admin/layout.tsx`: Navigation sidebar link for Feature Flags (`/admin/feature-flags`).
  - Tests:
    - `tests/unit/feature-flag-service.test.ts` (7 tests verifying baseline fallback, key retrieval, enabled/disabled state, deterministic canary evaluation, and update cache invalidation)
    - `tests/integration/feature-flag-api.test.ts` (8 tests verifying 401 unauthenticated, 403 non-admin, 200 admin listing, 400 validation error, 200 patch update, and public evaluation endpoint)
    - `tests/integration/feature-flag-ui.test.tsx` (5 tests verifying F042 badge, flags listing, category filter, toggle action, and Arabic RTL layout)
- Tests:
  - Total: 718 unit/integration tests passing in Vitest across 116 test suites (116/116 passing)
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js production build clean (all 75 static/dynamic routes compiled cleanly).
### F043: Caching & Invalidation (DONE)
- Implemented production-grade tag-based multi-tier caching system with instant invalidation, Next.js revalidation bridge, and administrative controls adhering strictly to `docs/admin/01_ADMIN_CONTROL_PLANE.md`, `docs/features/01_GUEST_ACCESS.md`, and `docs/frontend/06_RESPONSIVE_ACCESSIBILITY.md`:
  - `src/lib/cache/cache-types.ts`: Domain contracts (`CacheEntry`, `CacheStats`, `CacheKeySummary`, `SystemCacheTag`, `InvalidateCacheSchema`).
  - `src/lib/cache/cache-service.ts`: Implemented `CacheService` with high-performance in-memory cache, O(1) tag-to-keys reverse index (`tagIndex`), TTL expiration cleanup, `getOrSet` atomic pattern, tag-based purge (`invalidateTag` / `invalidateTags`), complete flush (`clear`), and `revalidateCacheTag` Next.js bridge.
  - `src/lib/cache/index.ts`: Barrel export.
  - `app/api/admin/cache/route.ts`: Admin `GET /api/admin/cache` returning stats, tag distribution, and active keys; `POST /api/admin/cache` for selective tag or key invalidation with immutable audit logging to `auditEvents`. Guarded by `requireAdmin`.
  - `app/api/admin/cache/flush/route.ts`: Admin `POST /api/admin/cache/flush` for instantaneous total cache purge with audit logging. Guarded by `requireAdmin`.
  - `src/modules/admin/presentation/cache-manager.tsx`: Executive cache cockpit with 5 KPI cards (Total Keys, Hit Rate %, Total Hits, Cache Misses, Active Tags), 9 architectural tag purge cards (`content`, `projects`, `cv`, `ai`, `prompts`, `rag`, `social`, `feature_flags`, `eval`), instant purge actions, danger-zone Flush All Caches button with confirmation, and live searchable keys table with remaining TTL. Full Arabic RTL and English LTR support.
  - `src/modules/admin/presentation/index.ts`: Re-exported `CacheManager`.
  - `app/[locale]/admin/cache/page.tsx`: Production route with localized metadata, server-side prefetch, `export const dynamic = "force-dynamic"`, and renders `CacheManager`.
  - `app/[locale]/admin/layout.tsx`: Sidebar navigation link for Cache & Invalidation (`/admin/cache`).
  - Tests:
    - `tests/unit/cache-service.test.ts` (9 tests verifying storage, misses, TTL expiration, getOrSet caching, tag invalidation, multi-tag invalidation, clear, hit rate statistics, and search/tag filtering)
    - `tests/integration/cache-api.test.ts` (8 tests verifying 401 unauthenticated, 403 non-admin, 200 admin stats, 400 validation error, 200 tag invalidation, and 200 flush all cache)
    - `tests/integration/cache-ui.test.tsx` (4 tests verifying F043 badge, KPI cards, tag cards, keys table with TTL, and Arabic RTL layout)
- Tests:
  - Total: 739 unit/integration tests passing in Vitest across 119 test suites (119/119 passing)
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js production build clean (all 79 static/dynamic routes compiled cleanly in 14.1s).
### F044: Rate Limiting & Abuse Protection (DONE)
- Implemented production sliding-window rate limiter, rapid burst abuse cooldown detection, and multi-tier protection across chat, job-fit, lab, auth, and admin endpoints adhering strictly to `docs/admin/01_ADMIN_CONTROL_PLANE.md`, `docs/features/01_GUEST_ACCESS.md`, and `docs/frontend/06_RESPONSIVE_ACCESSIBILITY.md`:
  - `src/lib/security/rate-limiter.ts`: `RateLimiter` class and `RATE_LIMIT_RULES` configuring tiered limits (`chat`: 20 RPM with burst protection, `job_fit`: 10 RPM, `ai_lab`: 30 RPM, `auth`: 5 per 15 min brute-force shield, `admin`: 120 RPM, `public`: 60 RPM). Client identifier resolver extracting `x-user-id`, `x-forwarded-for` (client IP), `x-real-ip`, or `cf-connecting-ip`. Injects standard headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, and `Retry-After`.
  - `app/api/chat/route.ts`: Integrated `applyRateLimit(request, "chat")` returning 429 Too Many Requests when quota is exhausted.
  - `app/api/job-fit/route.ts`: Integrated `applyRateLimit(request, "job_fit")` and attached rate limit headers to responses.
  - `app/api/admin/rate-limits/route.ts`: Admin route `GET /api/admin/rate-limits` returning active tier rules and currently throttled/blocked clients; `POST /api/admin/rate-limits` allowing selective or global rate limit resets with audit logging to `auditEvents`. Guarded by `requireAdmin`.
  - Tests:
    - `tests/unit/rate-limiter.test.ts` (5 tests verifying initial quota decrements, limit exhaustion, burst abuse cooldown detection, client identifier resolution from proxy headers, and explicit reset)
    - `tests/integration/rate-limit-api.test.ts` (5 tests verifying 401 unauthenticated, 403 non-admin, 200 admin rules listing, admin reset endpoint, and 429 enforcement with rate limit headers on `/api/job-fit`)
- Tests:
  - Total: 749 unit/integration tests passing in Vitest across 121 test suites (121/121 passing)
- Quality gates: TypeScript strict 0 errors, ESLint 0 errors/warnings, Prettier 100%, Next.js production build clean (all 80 static/dynamic routes compiled cleanly in 19.3s).
- Next: F045 — Observability

## Overall progress

- Total features: 50
- DONE: 44
- IN_PROGRESS: 0
- BLOCKED: 0
- PENDING: 6

The agent must update these totals when statuses change.





