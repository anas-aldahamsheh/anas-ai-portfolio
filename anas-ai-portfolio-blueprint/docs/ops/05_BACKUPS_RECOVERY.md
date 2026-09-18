# Backup and Recovery

## PostgreSQL
Use provider backups/point-in-time features appropriate to production tier.
Document restore drill.

## Blob storage
Enable versioning/retention where practical for CV/media.

## Qdrant
Vector index is rebuildable from source-of-truth content, but snapshots accelerate recovery.
Keep index version metadata in PostgreSQL.

## Redis
Treat cache/ephemeral data as non-authoritative.

## Recovery
Define:
- RPO;
- RTO;
- restore steps;
- secret rotation steps;
- vector rebuild steps;
- verification checklist.
