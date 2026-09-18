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
| F002 | Database & migrations | Data | **PENDING** | PostgreSQL/Drizzle schema foundation, migration workflow and constraints. |
| F003 | Authentication | Auth | **PENDING** | Sign-up, sign-in, secure sessions, verification-ready flows. |
| F004 | RBAC & admin protection | Auth | **PENDING** | USER/ADMIN roles, deny-by-default server authorization. |
| F005 | Guest-first public access | Core | **PENDING** | Every public portfolio feature works without authentication. |
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

## Overall progress

- Total features: 50
- DONE: 1
- IN_PROGRESS: 0
- BLOCKED: 0
- PENDING: 49

The agent must update these totals when statuses change.
