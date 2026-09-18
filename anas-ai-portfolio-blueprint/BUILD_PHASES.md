# Build Phases

## Phase 0 — Engineering foundation
F001, F002, F045, F046

Exit criteria:
- build/lint/typecheck/test commands work;
- env schema exists;
- database migration path works;
- structured logging and health foundation exists.

## Phase 1 — Identity, authorization, localization shell
F003–F010

Exit criteria:
- guest/public shell;
- auth;
- admin RBAC;
- dynamic UI text foundation;
- RTL/LTR;
- themes;
- styled Select;
- motion primitives.

## Phase 2 — CMS and portfolio core
F011–F018, F039

Exit criteria:
- admin can build public content without source edits;
- CV/social/projects work;
- inline editing works;
- published content is cache-safe.

## Phase 3 — AI control plane
F019–F021, F040, F041

Exit criteria:
- provider/model/prompt/secrets configs exist;
- no provider secrets leak client-side;
- admin changes are audit logged.

## Phase 4 — Modular RAG
F022–F030

Exit criteria:
- ingestion works end-to-end;
- multilingual embeddings;
- hybrid retrieval;
- router/rewriter;
- reranking;
- context packing;
- grounded generation/citations;
- language matching.

## Phase 5 — User-facing AI
F031–F038

Exit criteria:
- general chat;
- modes;
- project scope;
- Job Fit Analyzer;
- AI Lab;
- safe debug;
- eval dashboard and regression suite.

## Phase 6 — Production hardening
F042–F050

Exit criteria:
- feature flags;
- caching;
- abuse protection;
- accessibility;
- responsive QA;
- security suite;
- deployment and rollback.

Do not compress these phases into a single "generate everything" step.
