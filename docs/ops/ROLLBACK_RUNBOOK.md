# Production Rollback Runbook (F050)

This document defines the emergency rollback procedure for the AI Portfolio Platform when post-deployment anomalies or severe regressions occur.

---

## 1. Rollback Triggers

Initiate immediate rollback if any of the following criteria are met within 15 minutes post-deployment:

1. **Elevated Error Rate:** 5xx HTTP response rate exceeds 1.0% over a 3-minute rolling window.
2. **Readiness Probe Failure:** `GET /api/readiness` reports `status: "unready"` for > 2 consecutive probe cycles.
3. **AI Regression Gate Failure:** AI Evaluation Runner detects Faithfulness < 90% or Cross-Lingual AR/EN parity drop > 10%.
4. **Data Corruption / Latency Spike:** P99 API response latency exceeds 3000ms.

---

## 2. Emergency Rollback Execution Steps

### Step 1: Instant Application Artifact Reversion
Revert traffic to the previously verified release artifact immediately via hosting control plane:

- **Vercel / Cloudflare Pages:**
  Select the prior deployment in Dashboard -> Deployments -> Click **"Instant Rollback"** (promotes previous immutable build to production in < 5 seconds).
- **Docker / Kubernetes:**
  ```bash
  kubectl rollout undo deployment/portfolio-web
  ```

### Step 2: Prompt Registry Rollback
If the regression is related to AI conversational hallucinations or prompt drift:
1. Navigate to `Admin -> Prompts -> History`.
2. Locate the impacted prompt role (e.g. `chat_system`).
3. Select the prior stable version (e.g. `v1`).
4. Click **"Rollback to this version"** or invoke the authenticated endpoint:
   ```bash
   POST /api/admin/prompts/{slug}/rollback
   {"targetVersion": 1}
   ```
5. Invalidate the prompt cache:
   ```bash
   POST /api/admin/cache
   {"tag": "prompts"}
   ```

### Step 3: Vector Index & Qdrant Snapshot Recovery
If the vector collection was corrupted by a bad ingestion job:
1. Re-run baseline ingestion or restore snapshot:
   ```bash
   pnpm reindex --clean
   ```
2. Invalidate RAG and vector caches:
   ```bash
   POST /api/admin/cache
   {"tag": "rag"}
   ```

### Step 4: Database Schema Compatibility Verification
Because deployments adhere strictly to the **Expand / Contract** zero-downtime rule, the database schema remains 100% backward-compatible with the prior application version.
- Do **NOT** attempt down-migrations during an active incident unless explicitly required.
- If data corruption occurred, restore PostgreSQL from the latest Point-in-Time Recovery (PITR) backup snapshot.

---

## 3. Post-Rollback Verification Checklist

Verify system recovery after rollback:
- [ ] `GET /api/health` returns HTTP 200 `healthy`
- [ ] `GET /api/readiness` returns HTTP 200 `ready` or `degraded`
- [ ] 5xx error rate drops back to baseline (< 0.05%)
- [ ] Public SSR pages load cleanly in both Arabic and English
- [ ] Run automated smoke suite: `pnpm test tests/integration/production-smoke.test.ts`
- [ ] File Incident Post-Mortem in `docs/ops/incidents/`
