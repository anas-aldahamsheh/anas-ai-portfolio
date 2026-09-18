# Prompt Management

Prompts are production configuration.

## Admin operations
- create prompt;
- edit draft;
- clone version;
- test with evaluation cases;
- publish;
- rollback;
- compare versions.

## Prompt roles
- chat system/policy;
- conversation mode layer;
- query router;
- query rewrite;
- Job Fit Analyzer;
- evaluator/judge where used;
- summarization/context helpers where needed.

## Storage
Store templates in DB with version, status, role and metadata.

## Runtime
Resolve by semantic prompt role + active version.
Do not scatter prompt strings across route handlers.

## Security
Never render confidential prompt text to public debug view.
