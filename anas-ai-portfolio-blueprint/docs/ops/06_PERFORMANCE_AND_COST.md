# Performance and Cost

## Performance
Measure before optimizing.

Budgets should cover:
- LCP/CLS/INP;
- JS bundle;
- public content server response;
- retrieval latency;
- rerank latency;
- first token;
- full answer.

## Cost controls
Admin-configurable:
- request limits;
- per-provider quotas;
- model assignments;
- max tokens;
- rewrite count;
- top K;
- rerank candidate cap.

## Free-tier starting targets
The architecture can start with managed free tiers for low traffic:
- Neon Free;
- Qdrant Cloud Free;
- Upstash Redis Free;
- open-source BGE models through a suitable inference endpoint.

Do not assume free-tier limits or availability are permanent. Keep provider replacement easy.
