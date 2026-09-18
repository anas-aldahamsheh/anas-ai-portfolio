# Reranker — Default BGE Reranker v2 M3

Default:
`BAAI/bge-reranker-v2-m3`

## Why
- multilingual;
- appropriate after broad candidate retrieval;
- open-source Apache-2.0;
- model card describes strong multilingual capability.

## Flow
1. retrieve candidate chunks;
2. pair user query with each candidate;
3. rerank;
4. keep top N;
5. enforce final relevance threshold where calibrated.

## Admin settings
- provider;
- endpoint;
- model ID;
- candidate max;
- output top N;
- timeout;
- batch size;
- threshold;
- fallback policy.

## Failure
Configured policy chooses:
- degrade to fused retrieval ordering; or
- fail AI answer safely.

Never silently bypass reranking without telemetry.
