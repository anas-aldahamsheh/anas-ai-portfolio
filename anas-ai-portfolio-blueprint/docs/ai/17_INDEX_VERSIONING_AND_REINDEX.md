# Index Versioning and Reindex

Every active retrieval index has:
- index version ID;
- embedding model/provider/config hash;
- chunker version/config hash;
- creation timestamp;
- status;
- evaluation result reference.

## Reindex flow
1. create candidate collection/version;
2. ingest all published source data;
3. verify counts/checksums;
4. run retrieval evaluation;
5. activate pointer/config;
6. monitor;
7. retain previous version for rollback window;
8. later delete according to retention.

Do not rebuild the active collection destructively in place when zero-downtime version swap is feasible.
