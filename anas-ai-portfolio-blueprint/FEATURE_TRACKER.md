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
| F006 | Dynamic localization registry | Frontend/Data | **PENDING** | Database-backed Arabic/English UI text with no hardcoded portfolio labels. |
| F007 | Automatic RTL/LTR system | Frontend | **PENDING** | Correct direction across all layouts, content, overlays, forms and chat. |
| F008 | Light/dark theme | Frontend | **PENDING** | System-aware theme plus persistent user/guest override. |
| F009 | Design system & custom Select | Frontend | **PENDING** | Minimal design primitives; all dropdowns styled and accessible. |
| F010 | Motion system | Frontend | **PENDING** | Subtle reusable animations respecting reduced-motion. |
| F011 | Dynamic navigation/footer | Content | **PENDING** | Admin-managed navigation, footer and visibility/order. |
| F012 | Dynamic section builder | Content | **PENDING** | Admin can create/delete/reorder sections using composable blocks. |
| F013 | Global admin inline edit mode | Admin | **PENDING** | Edit affordance adjacent to dynamic elements for admins only. |
| F014 | CV viewer/download/versioning | Feature | **PENDING** | Public CV page, viewer/download, admin upload/publish history. |
| F015 | GitHub profile popover | Feature | **PENDING** | Dynamic GitHub account card with copy/open actions. |
| F016 | LinkedIn profile popover | Feature | **PENDING** | Dynamic LinkedIn account card with copy/open actions. |
| F017 | Project catalog | Feature | **PENDING** | Dynamic projects, filters/tags/order/publishing. |
| F018 | Project Deep Dive | Feature | **PENDING** | Block-based rich project detail pages. |
| F019 | AI provider/model registry | AI/Admin | **PENDING** | Admin manages generation/embedding/reranker providers/models/endpoints. |
| F020 | Secrets management | Security/Admin | **PENDING** | Safe encrypted API credential management and redaction. |
| F021 | Prompt registry & versioning | AI/Admin | **PENDING** | Admin-editable prompt versions with rollback. |
| F022 | RAG ingestion pipeline | AI | **PENDING** | Normalize, chunk, embed, metadata, index, update/delete sync. |
| F023 | BGE-M3 embedding adapter | AI | **PENDING** | Default multilingual embedding integration behind provider interface. |
| F024 | Hybrid retrieval | AI | **PENDING** | Dense + sparse retrieval, metadata filtering and fusion. |
| F025 | Query Router | AI | **PENDING** | Route intent/scope to relevant retrieval policy. |
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

## Overall progress

- Total features: 50
- DONE: 5
- IN_PROGRESS: 0
- BLOCKED: 0
- PENDING: 45

The agent must update these totals when statuses change.
