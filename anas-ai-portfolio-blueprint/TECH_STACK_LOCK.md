# Technology Stack Lock

The implementation agent must use this stack unless a blocking incompatibility is proven and documented in an ADR.

## Runtime

- Node.js: **24.x LTS**
- Package manager: **pnpm**
- TypeScript: strict mode enabled

## Web

- Next.js: **16.3.x Active LTS**, install the latest security-patched `16.3.*` available at build time.
- React version required by that Next.js release.
- App Router only.
- Server Components by default.
- Client Components only when interaction requires them.

## Styling and UI

- Tailwind CSS: **4.3.x**
- Radix UI primitives for accessible low-level interactive widgets.
- Build project-owned visual components on top of Radix.
- Lucide icons or an equivalent mature icon set; one icon system only.
- Do not import a prebuilt theme that gives the site a generic AI-dashboard appearance.
- Motion: Motion for React (Framer Motion successor package) only where CSS transitions are insufficient.
- Forms: React Hook Form + Zod.

## Data

- PostgreSQL as authoritative relational database.
- Drizzle ORM + Drizzle Kit migrations.
- PostgreSQL provider: Neon is the default managed deployment target.
- Vector/search database: Qdrant.
- Qdrant stores retrieval vectors/payload references; PostgreSQL remains the source of truth for content.

## Cache / rate limits / ephemeral coordination

- Upstash Redis adapter as default managed provider.
- Internal interface must permit replacement by another Redis-compatible provider.

## Authentication

- Better Auth with a Drizzle/PostgreSQL adapter.
- Email/password support.
- Email verification capability.
- Secure server-managed sessions.
- Roles: USER and ADMIN.
- Admin bootstrap must be explicit and secure; never create a public default admin password.

## Object/file storage

Create a `BlobStorage` abstraction.
Default deployment adapter may use an S3-compatible managed service.
CV and uploaded media must not rely on local filesystem persistence in production.

## AI providers

All AI capabilities use provider interfaces.

### Embedding default
- Model: `BAAI/bge-m3`
- Expected dense dimension: 1024
- Open-source license: MIT
- Multilingual; supports more than 100 languages.
- Supports dense, sparse, and multi-vector style retrieval capabilities.
- Arabic and English are both in scope.

### Reranker default
- Model: `BAAI/bge-reranker-v2-m3`
- Open-source license: Apache-2.0
- Multilingual cross-encoder reranker.

### Generation
Do not lock the product to a single LLM vendor.
Create adapters for OpenAI-compatible APIs plus additional providers only when needed.
Active provider/model is selected from Admin configuration.

### Hosting of embedding/reranking
The model identity and the inference provider are separate configuration concepts.

The system must support:
1. hosted inference provider;
2. self-hosted inference endpoint;
3. OpenAI-compatible/custom HTTP adapter where schema is supported.

Never couple `BAAI/bge-m3` to a single vendor.

## Retrieval

- Dense semantic retrieval.
- Sparse/lexical retrieval.
- Hybrid fusion.
- Metadata filters.
- Reranking.
- Context deduplication.
- Context budget.
- Citations.

Use Qdrant hybrid retrieval. Store model/index version metadata.

## Observability

- OpenTelemetry-compatible instrumentation.
- Structured JSON logs on server.
- Sentry-compatible error reporting adapter.
- Correlation/request IDs.

## Testing

- Vitest for unit/integration logic.
- Testing Library for component behavior.
- Playwright for E2E.
- Axe integration for accessibility checks.
- AI evaluation runner as a separate test/eval layer.

## Code quality

- ESLint.
- Prettier.
- TypeScript strict.
- dependency/security scan in CI.
- no `any` unless narrowly justified.
