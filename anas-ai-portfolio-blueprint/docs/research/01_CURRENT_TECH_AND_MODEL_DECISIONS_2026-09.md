# Current Technology and Model Decisions — 2026-09

This document records why the blueprint chose its defaults. Re-verify before a future major upgrade.

## Next.js
Use the active LTS 16.3 branch and latest security-patched release within it at implementation time.

## Node
Use Node.js 24 LTS, not the Node 26 Current line for the production baseline.

## Tailwind
Use Tailwind CSS 4.3.x.

## Embedding
Default model: `BAAI/bge-m3`.

Official model information describes:
- multilingual support for more than 100 languages;
- 1024 dimensions;
- up to 8192-token input;
- dense + sparse + multi-vector capabilities;
- hybrid retrieval + reranking as a recommended pipeline.

Arabic (`ar`) appears in the published training language list.

## Reranker
Default model: `BAAI/bge-reranker-v2-m3`.
Its model card describes it as a multilingual reranker and Apache-2.0 licensed.

## Free does not equal hosted-free
Both BGE models are open-source, but inference compute still has a hosting cost unless a provider offers a free allowance.

Current low-cost/free-start options include:
- Qdrant Cloud free vector cluster;
- Qdrant Cloud has some free hosted embedding models, but do not assume BGE-M3 is among them unless the console confirms it;
- Hugging Face free accounts currently receive only a small monthly Inference Providers credit, so it should not be treated as a durable production guarantee;
- Neon has a free Postgres plan;
- Upstash has a free Redis plan.

The architecture therefore makes every provider replaceable.
