# Qdrant / Vector Index Schema

Each point payload should include enough metadata to filter and cite without duplicating authoritative content unnecessarily.

Recommended payload:
```json
{
  "source_document_id": "uuid",
  "source_chunk_id": "uuid",
  "source_type": "project|section|cv|experience|...",
  "entity_id": "uuid",
  "project_id": "uuid|null",
  "locale": "ar|en",
  "content_version": 1,
  "index_version": "uuid",
  "chunk_order": 0,
  "title_ref": "uuid-or-key",
  "published": true
}
```

Vectors:
- named dense vector;
- named sparse vector when active.

## Never
- mix vector dimensions in same named vector;
- retrieve draft/private content in public requests;
- leave stale deleted vectors active;
- use Qdrant as sole source of truth for editable content.
