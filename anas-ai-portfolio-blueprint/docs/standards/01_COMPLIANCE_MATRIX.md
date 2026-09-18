# Engineering Principles Compliance Matrix

The attached user engineering principles are authoritative.

## Architecture
Implemented through:
- modular monolith;
- explicit module boundaries;
- provider ports/adapters;
- DI at composition boundaries;
- low coupling/high cohesion;
- no God service.

## Clean code
- strict naming;
- small functions;
- no magic owner content;
- lint/format/typecheck;
- no dead code.

## Maintainability
- predictable feature folders;
- single source of truth;
- migrations;
- ADRs;
- tracker/handoff.

## Scalability
- stateless web nodes;
- Redis for shared ephemeral coordination;
- managed DB/vector store;
- queues/jobs for ingestion;
- rate limits;
- pagination.

## Security/privacy
- RBAC;
- least privilege;
- encrypted secrets;
- upload safety;
- OWASP controls;
- data minimization;
- guest chat non-persistence by default.

## Reliability
- timeout;
- retry;
- fallback;
- idempotency;
- health/readiness;
- versioned index.

## Testing
- unit;
- integration;
- E2E;
- security;
- accessibility;
- performance;
- AI eval.

## AI/RAG
- model/prompt versioning;
- structured outputs;
- validation;
- hallucination/grounding evaluation;
- prompt injection defense;
- retrieval evaluation;
- metadata;
- reranking;
- citations;
- index update/delete behavior.

Any implementation shortcut that violates the user's principles must not be accepted merely because the feature appears to work.
