# Admin AI Control Center

Administrator must be able to control AI behavior without source edits.

## Provider management
- name/type;
- base URL;
- capability;
- secret status;
- test connection;
- enable/disable.

## Model management
- model identifier;
- role/capability;
- context limit;
- embedding dimension;
- custom headers/schema options where safely supported;
- health test.

## Assignments
Set active model per:
- generation;
- embedding;
- reranking;
- router;
- rewriting;
- evaluator.

## RAG controls
- chunking;
- retrieval K;
- hybrid weights/strategy;
- filters;
- reranker;
- context budget;
- citations;
- timeouts;
- retry;
- fallbacks;
- rate limits.

## Change safety
High-impact changes offer:
- validate config;
- run evaluation;
- stage;
- activate;
- rollback.

Embedding model changes must trigger reindex workflow, not instant incompatible switch.
