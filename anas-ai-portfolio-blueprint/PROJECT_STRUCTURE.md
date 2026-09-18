# Required Project Structure

The actual application repository must converge on this structure.

```text
/
├─ app/
│  ├─ [locale]/
│  │  ├─ (public)/
│  │  │  ├─ page.tsx
│  │  │  ├─ cv/page.tsx
│  │  │  ├─ projects/page.tsx
│  │  │  ├─ projects/[slug]/page.tsx
│  │  │  ├─ ai-lab/page.tsx
│  │  │  ├─ evaluations/page.tsx
│  │  │  ├─ job-fit/page.tsx
│  │  │  └─ [...dynamicPage]/page.tsx
│  │  ├─ (auth)/
│  │  │  ├─ sign-in/page.tsx
│  │  │  └─ sign-up/page.tsx
│  │  └─ admin/
│  │     ├─ layout.tsx
│  │     ├─ page.tsx
│  │     ├─ content/
│  │     ├─ sections/
│  │     ├─ projects/
│  │     ├─ cv/
│  │     ├─ navigation/
│  │     ├─ localization/
│  │     ├─ ai/
│  │     │  ├─ providers/
│  │     │  ├─ models/
│  │     │  ├─ prompts/
│  │     │  ├─ rag/
│  │     │  ├─ indexes/
│  │     │  └─ evaluations/
│  │     ├─ theme/
│  │     ├─ feature-flags/
│  │     ├─ audit/
│  │     └─ system/
│  └─ api/
│     ├─ health/
│     ├─ readiness/
│     ├─ auth/
│     ├─ content/
│     ├─ cv/
│     ├─ chat/
│     ├─ job-fit/
│     ├─ admin/
│     └─ webhooks/
│
├─ src/
│  ├─ modules/
│  │  ├─ auth/
│  │  │  ├─ domain/
│  │  │  ├─ application/
│  │  │  ├─ infrastructure/
│  │  │  └─ presentation/
│  │  ├─ content/
│  │  ├─ sections/
│  │  ├─ projects/
│  │  ├─ cv/
│  │  ├─ social/
│  │  ├─ localization/
│  │  ├─ theme/
│  │  ├─ chat/
│  │  ├─ job-fit/
│  │  ├─ ai-lab/
│  │  ├─ evaluation/
│  │  ├─ admin/
│  │  ├─ audit/
│  │  └─ analytics/
│  │
│  ├─ ai/
│  │  ├─ contracts/
│  │  ├─ orchestration/
│  │  ├─ router/
│  │  ├─ query-rewrite/
│  │  ├─ embeddings/
│  │  │  ├─ ports/
│  │  │  └─ adapters/
│  │  ├─ retrieval/
│  │  │  ├─ dense/
│  │  │  ├─ sparse/
│  │  │  ├─ hybrid/
│  │  │  ├─ filters/
│  │  │  └─ fusion/
│  │  ├─ reranking/
│  │  │  ├─ ports/
│  │  │  └─ adapters/
│  │  ├─ context/
│  │  ├─ generation/
│  │  │  ├─ ports/
│  │  │  └─ adapters/
│  │  ├─ citations/
│  │  ├─ safety/
│  │  ├─ evaluation/
│  │  ├─ telemetry/
│  │  └─ ingestion/
│  │     ├─ parsers/
│  │     ├─ normalizers/
│  │     ├─ chunkers/
│  │     ├─ metadata/
│  │     ├─ indexers/
│  │     └─ jobs/
│  │
│  ├─ ui/
│  │  ├─ primitives/
│  │  ├─ components/
│  │  ├─ layouts/
│  │  ├─ motion/
│  │  ├─ admin-edit/
│  │  └─ blocks/
│  │
│  ├─ lib/
│  │  ├─ db/
│  │  ├─ qdrant/
│  │  ├─ redis/
│  │  ├─ storage/
│  │  ├─ security/
│  │  ├─ observability/
│  │  ├─ validation/
│  │  ├─ errors/
│  │  └─ config/
│  │
│  └─ types/
│
├─ drizzle/
├─ tests/
│  ├─ unit/
│  ├─ integration/
│  ├─ e2e/
│  ├─ accessibility/
│  ├─ security/
│  └─ ai-evals/
│
├─ scripts/
│  ├─ bootstrap-admin/
│  ├─ verify-config/
│  ├─ reindex/
│  ├─ evaluate-rag/
│  └─ smoke-test/
│
├─ docs/
├─ public/
└─ .github/workflows/
```

## Boundary rules

1. Feature modules may import shared contracts/utilities, not another module's infrastructure internals.
2. AI orchestration depends on interfaces/ports, not concrete vendors.
3. UI does not query databases directly.
4. Domain/application logic does not import Next.js components.
5. Database code does not contain UI decisions.
6. External providers remain in adapters.
7. No circular dependencies.
8. Shared UI primitives remain generic.
9. Feature-specific components live with the feature.
10. Do not create a generic abstraction before two real use cases justify it.
