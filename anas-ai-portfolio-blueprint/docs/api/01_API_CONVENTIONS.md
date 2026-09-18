# API Conventions

## Response
Use consistent typed response/error envelopes where route semantics benefit.

## Validation
Zod on all external inputs.

## Errors
Expose stable error codes + localized UI handling; no stack traces.

## HTTP
Use methods/status codes correctly.
Use idempotency keys for relevant long-running/admin actions such as reindex.

## Pagination
Cursor-based for large audit/evaluation lists.

## Security
Authorization at endpoint/application boundary.
Rate limit public expensive routes.

## Versioning
Internal app APIs can evolve with the app; external/public API exposure requires explicit version strategy.
