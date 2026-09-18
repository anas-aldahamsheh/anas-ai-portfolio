# AI Configuration and Secrets

## ai_provider
Non-secret provider metadata:
- provider type;
- base URL;
- enabled;
- capability flags;
- health status.

## ai_model
- provider ID;
- model ID;
- display metadata;
- capability;
- embedding dimension if applicable;
- max context/input;
- status.

## assignment
Role -> active model:
- generation;
- embedding;
- reranker;
- router;
- rewrite;
- evaluator.

## secret reference
Store secret values encrypted using a server-side master key/KMS strategy.
Database stores encrypted value or external vault reference.

Rules:
- never send decrypted secret to browser;
- never log secret;
- update uses write-only field;
- admin UI displays "configured" + safe fingerprint only;
- credential access is centralized.
