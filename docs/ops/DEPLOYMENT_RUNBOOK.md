# Production Deployment Runbook (F050)

This runbook defines the authoritative, reproducible deployment procedure for the AI Portfolio Platform across staging and production environments.

---

## 1. Pre-Deployment Verification

Before triggering any production deployment, execute the pre-deployment verification pipeline:

```bash
# 1. Verify TypeScript types
pnpm typecheck

# 2. Verify ESLint rules and style
pnpm lint

# 3. Run complete automated test suite (Unit, Integration, Security)
pnpm test

# 4. Verify Next.js production build
pnpm build

# 5. Run automated pre-flight deployment verification
pnpm verify:deploy
```

All 5 steps must exit with code 0. If any step fails, the deployment MUST be halted immediately.

---

## 2. Environment Variables & Secret Integrity

Ensure the target environment contains the following locked secrets in the deployment orchestrator (e.g. Vercel, Railway, Kubernetes Secrets):

- `DATABASE_URL`: PostgreSQL connection URI with pooled connections (`sslmode=require`).
- `BETTER_AUTH_SECRET`: Minimum 32-character high-entropy secret.
- `ENCRYPTION_MASTER_KEY`: 64-character hexadecimal key (AES-256-GCM master key).
- `NEXT_PUBLIC_APP_URL`: Canonical production HTTPS origin (e.g. `https://anas.dev`).
- `QDRANT_URL` & `QDRANT_API_KEY`: Managed Qdrant vector store endpoint.
- Provider API keys (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_AI_API_KEY`).

---

## 3. Database Migration Execution (Zero-Downtime Rule)

> **CRITICAL INVARIANT:** Never deploy destructive database changes (dropping columns, renaming existing tables) ahead of application code.

1. **Phase A (Expand):** Add new nullable columns or tables via Drizzle migrations:
   ```bash
   pnpm db:migrate
   ```
2. **Phase B (Deploy):** Deploy the compatible application artifact.
3. **Phase C (Contract):** Once all instances run the new version and no rollback is needed, clean up deprecated columns in a subsequent release.

---

## 4. Post-Deployment Smoke Verification

Immediately following deployment, run the automated smoke verification against the production origin:

1. **Liveness Probe:**
   `GET /api/health` -> HTTP 200 `{"status":"healthy", ...}`
2. **Readiness Probe:**
   `GET /api/readiness` -> HTTP 200 `{"status":"ready" | "degraded", ...}`
3. **Metrics Exposition:**
   `GET /api/metrics` -> HTTP 200 `text/plain; version=0.0.4`
4. **Public Core Pages (SSR):**
   - `GET /ar` & `GET /en` (Home pages)
   - `GET /en/projects` (Project catalog)
   - `GET /en/cv` (CV viewer & download)
   - `GET /en/job-fit` (Job Fit Analyzer)
   - `GET /en/evaluation` (Evaluation dashboard)
5. **Guest AI Chat Test:**
   Verify SSE stream on `POST /api/chat` with guest session.
6. **Admin Authorization Guard Test:**
   Verify `GET /api/admin/content/pages` returns HTTP 401 for unauthenticated calls.

If all smoke checks succeed, tag the release commit in Git (`git tag v1.0.0`).
