# RAG Configuration Schema

Admin-managed validated configuration should include:

```text
retrieval
  dense_enabled
  sparse_enabled
  dense_top_k
  sparse_top_k
  fusion_strategy
  rrf_k
  candidate_cap
  metadata_filter_policy

rewrite
  enabled
  max_queries
  model_assignment
  temperature
  timeout_ms

rerank
  enabled
  model_assignment
  candidate_cap
  top_n
  threshold
  timeout_ms

context
  max_context_tokens
  max_chunks
  deduplicate
  per_source_cap

generation
  model_assignment
  temperature
  max_output_tokens
  timeout_ms
  citation_required

debug
  public_debug_enabled
  admin_trace_enabled
```

Every field has:
- type;
- safe min/max;
- default created during admin setup, not hidden magic values in scattered code;
- validation;
- version.
