# AI Failure and Fallback Policy

## Failure categories
- authentication;
- quota;
- rate limit;
- timeout;
- malformed response;
- model unavailable;
- network;
- vector DB;
- reranker;
- output validation.

## Retry
Only transient failures.
Bounded attempts with exponential backoff + jitter.

## Fallbacks
Fallback order is configured per role.
Fallback model must be compatible with the required capability.

Embedding fallback is special:
Do not switch embedding model for queries unless it is compatible with the active index. Query embedding must match indexed embedding space.

## User experience
Return a clear localized error state from dynamic UI text registry.
Do not expose provider internals/secrets.
