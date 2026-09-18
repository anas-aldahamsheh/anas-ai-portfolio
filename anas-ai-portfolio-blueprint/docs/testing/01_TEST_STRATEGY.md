# Test Strategy

## Unit
Business logic:
- language resolution;
- localization resolution;
- section validation;
- RAG config validation;
- fusion;
- dedup;
- context budgeting;
- citation mapping;
- authorization policy helpers.

## Integration
- PostgreSQL repositories;
- Qdrant adapter;
- provider adapters with test doubles;
- auth sessions;
- upload/storage;
- indexing jobs.

## E2E
- guest recruiter journey;
- CV;
- social popover/copy/open;
- Arabic/English;
- RTL/LTR;
- dark/light;
- sign-up/sign-in;
- admin guard;
- inline edit;
- project AI scope;
- Job Fit Analyzer.

## AI evaluation
Separate deterministic regression runner.

## Security
Authorization, input validation, upload, prompt-injection cases.

## Performance
Chat first-token latency, page load, retrieval latency, indexing throughput as appropriate.
