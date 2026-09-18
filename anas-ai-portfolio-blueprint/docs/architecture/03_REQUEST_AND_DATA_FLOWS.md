# Request and Data Flows

## Public content request

1. Request locale resolved.
2. Published page/section query runs.
3. localized content selected.
4. cache tags applied.
5. server renders semantic HTML.
6. client hydration only for interactive components.

## Admin content mutation

1. authenticated request;
2. server role check;
3. input validation;
4. transaction;
5. audit event;
6. enqueue indexing job if knowledge-bearing content changed;
7. cache invalidation;
8. return normalized result.

## Chat request

1. abuse/rate check;
2. input schema validation;
3. resolve user language;
4. resolve conversation mode;
5. query router;
6. query rewriting when enabled;
7. access/scope filters;
8. hybrid retrieval;
9. fusion;
10. reranking;
11. deduplication;
12. context budget;
13. prompt assembly;
14. generation;
15. output validation;
16. citation validation;
17. stream/display;
18. metrics.

## Delete content

Deletion is two-system coordinated:
- database source record transitions safely;
- indexing job removes/tombstones associated Qdrant vectors;
- stale vectors must not be retrievable;
- retries are idempotent.
