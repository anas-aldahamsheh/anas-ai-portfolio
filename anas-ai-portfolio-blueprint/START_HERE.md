# START HERE — Mandatory Agent Reading Order

The implementation agent must not write application code before completing this reading sequence.

## Required reading sequence

1. `MASTER_BUILD_SPEC.md`
2. `NON_NEGOTIABLES.md`
3. `TECH_STACK_LOCK.md`
4. `docs/standards/00_USER_ENGINEERING_PRINCIPLES.md`
5. `PROJECT_STRUCTURE.md`
6. `docs/architecture/01_SYSTEM_ARCHITECTURE.md`
7. `docs/data/01_DATABASE_SCHEMA.md`
8. `docs/ai/01_MODULAR_RAG_OVERVIEW.md`
9. `docs/frontend/01_DESIGN_SYSTEM.md`
10. `docs/frontend/02_BILINGUAL_RTL_LTR.md`
11. `docs/admin/01_ADMIN_CONTROL_PLANE.md`
12. `docs/security/01_THREAT_MODEL.md`
13. `docs/testing/01_TEST_STRATEGY.md`
14. `docs/ops/01_DEPLOYMENT.md`
15. `FEATURE_TRACKER.md`
16. `BUILD_PHASES.md`
17. `AGENT_EXECUTION_CONTRACT.md`

## Before implementation

The agent must:
- inspect the repository;
- create a branch;
- verify Node.js and package manager versions;
- create environment validation;
- create the database migration foundation;
- create CI checks before feature work;
- mark only the current tracker item `IN_PROGRESS`;
- never mark a feature `DONE` without meeting its Definition of Done.

## Status protocol

Allowed states:
- `PENDING`
- `IN_PROGRESS`
- `BLOCKED`
- `DONE`

Never invent additional states.

## Handoff protocol

If quota/session ends:
1. stop at a safe boundary;
2. make code compile;
3. run relevant tests;
4. update `FEATURE_TRACKER.md`;
5. update `agent-handoff/CURRENT_STATE.md`;
6. add exact next commands/actions;
7. do not mark unfinished work `DONE`.

A new agent must be able to continue without asking the user what happened.
