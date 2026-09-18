# Module Boundaries

## Content
Owns pages, sections, blocks, localized content, publish state.

## Projects
Owns project records, project metadata, deep-dive blocks and project-specific retrieval metadata.

## CV
Owns CV versions, published pointer, file metadata and download policy.

## Social
Owns external profile records such as GitHub and LinkedIn.

## Localization
Owns locale catalog, translation keys, direction metadata and completeness checks.

## Auth
Owns identity/session integration and role claims.

## Admin
Coordinates privileged operations but does not duplicate domain rules.

## Chat
Owns conversation request lifecycle and streaming presentation contracts.

## AI
Owns provider contracts and RAG orchestration.

## Evaluation
Owns datasets, runs, metrics and comparison artifacts.

## Audit
Owns immutable-style event records for privileged changes.

### Forbidden coupling
- Content module must not import Qdrant SDK.
- Project UI must not call an embedding provider directly.
- Admin UI must not manipulate database tables directly.
- AI retriever must not decide authorization.
- Client code must not receive provider credentials.
