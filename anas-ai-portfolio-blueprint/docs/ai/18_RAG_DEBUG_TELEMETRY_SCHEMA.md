# RAG Debug Telemetry Schema

Example safe trace:

```json
{
  "request_id": "uuid",
  "language": "ar",
  "mode_id": "uuid",
  "route_id": "uuid",
  "rewrite_count": 2,
  "retrieval": {
    "dense_candidates": 12,
    "sparse_candidates": 12,
    "fused_candidates": 18
  },
  "rerank": {
    "input_count": 18,
    "output_count": 6
  },
  "context": {
    "chunk_count": 5,
    "token_count": 3100
  },
  "models": {
    "embedding": "safe-model-id",
    "reranker": "safe-model-id",
    "generation": "safe-model-id"
  },
  "latency_ms": {
    "retrieval": 0,
    "rerank": 0,
    "generation": 0
  }
}
```

Public trace omits internal prompt text, raw secrets and sensitive payloads.
