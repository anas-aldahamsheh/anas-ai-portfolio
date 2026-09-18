# RAG Ingestion Pipeline

## Sources
Knowledge-bearing database entities:
- profile/content sections;
- projects;
- project blocks;
- experience;
- skills;
- certifications;
- CV-derived approved content if enabled;
- custom admin-created knowledge entities.

## Stages
1. receive content change event;
2. load authoritative source;
3. normalize;
4. remove non-indexable markup;
5. segment semantically;
6. attach metadata;
7. chunk;
8. embed;
9. write new index version;
10. verify count/checksum;
11. activate;
12. delete/tombstone superseded vectors.

## Idempotency
Use deterministic source/version identifiers so repeated jobs do not duplicate vectors.

## Updates
A content edit must eventually update its vectors.
A deletion must make stale vectors non-retrievable.

## Failure
Do not publish an index version partially if atomic activation can avoid it.
Record ingestion error and retry with bounded backoff.
