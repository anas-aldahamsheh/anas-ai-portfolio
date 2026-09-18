# Deployment Architecture

## Default managed topology

- Web/runtime: Vercel-compatible Next.js deployment or equivalent Node hosting.
- PostgreSQL: Neon.
- Vector DB: Qdrant Cloud.
- Redis: Upstash Redis.
- Blob files: S3-compatible object storage.
- AI inference: configured external/self-hosted provider endpoints.

## Environments

- development
- staging
- production

Each environment has distinct:
- database;
- Qdrant collection namespace;
- Redis keys/prefix;
- storage bucket/prefix;
- credentials;
- provider configuration;
- observability environment tag.

Never point local development at production resources.

## Production principle

Free plans may be used initially for low traffic, but production-readiness of the code must not depend on a free plan's SLA or quotas. Provider adapters allow migration to paid/dedicated infrastructure without rewriting core logic.
