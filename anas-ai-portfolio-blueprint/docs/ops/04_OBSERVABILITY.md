# Observability

## Logs
Structured JSON:
- timestamp;
- severity;
- event;
- request ID;
- user ID only when justified;
- feature/module;
- safe error code;
- latency.

## AI traces
- pipeline stage;
- provider;
- model;
- prompt version;
- index version;
- token usage;
- retrieval counts;
- latency;
- validation result.

Do not log full sensitive prompts/content by default.

## Metrics
- request latency/error;
- chat latency;
- provider failures;
- retrieval latency;
- rerank latency;
- generation latency;
- indexing jobs;
- auth failures;
- rate-limit hits;
- cache hit ratio;
- DB/Qdrant health.
