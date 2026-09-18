# System Architecture

## Style

Use a modular monolith.

```text
Browser
  │
  ▼
Next.js 16 App Router
  ├── Public UI
  ├── Auth UI
  ├── Admin UI
  ├── Route Handlers / Server Actions
  │
  ├── Application Modules
  │    ├── Content/CMS
  │    ├── Projects
  │    ├── CV
  │    ├── Social
  │    ├── Auth/RBAC
  │    ├── Chat
  │    ├── Job Fit
  │    ├── Evaluation
  │    └── Audit
  │
  ├── AI Orchestration
  │    ├── Language Resolver
  │    ├── Query Router
  │    ├── Query Rewriter
  │    ├── Retriever
  │    ├── Reranker
  │    ├── Context Builder
  │    ├── Generator
  │    └── Citation Validator
  │
  ├── PostgreSQL (source of truth)
  ├── Qdrant (retrieval index)
  ├── Redis (rate limit/cache/ephemeral state)
  └── Blob storage (CV/media)
```

## Why modular monolith

The portfolio has many concerns but low initial traffic and one product boundary. Microservices add deployment and operational complexity without benefit. Boundaries must still be strong enough for later extraction if measurement justifies it.

## Core rule

Business code depends on ports/interfaces. Provider adapters depend on concrete SDKs.

Examples:
- `EmbeddingProvider` interface -> BGE hosted adapter
- `RerankerProvider` -> BGE reranker adapter
- `GenerationProvider` -> provider adapters
- `VectorStore` -> Qdrant adapter
- `BlobStorage` -> S3-compatible adapter
