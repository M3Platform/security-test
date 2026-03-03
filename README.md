# Security Interview Mini-Challenge

This folder contains a small security exercise modeled after a modern backend architecture (route layer, manager layer, storage abstraction, markdown prompt templates, audit logging, Redis-backed share storage, and Google Cloud Storage audit export).

It is intentionally generic and does not contain product-specific details.

## Candidate Prompt

You are reviewing a small service that handles sensitive healthcare-related records.
It can persist share tokens in **Redis** and write audit events to **Google Cloud Storage (GCS)**.

Timebox: **60-90 minutes**.

### Your tasks

1. Find the highest-risk security issues in the starter code.
2. Implement fixes for at least **3** issues (focus on practical, high-impact changes), including at least one issue in:
   - Redis usage
   - GCS usage
3. Add a short `THREAT_MODEL.md` with:
   - top risks
   - attack paths
   - residual risk after your fixes
4. Add a short `COMPLIANCE_NOTES.md` mapping your fixes to:
   - **SOC 2 Type II** expectations
   - **HIPAA** safeguards (technical + administrative where relevant)
5. Add `EXPLOIT_DEMO.md` with:
   - how to reproduce each issue before your fix
   - how you validated the fix (exact commands and expected outcomes)
6. Add `DECISIONS.md` with:
   - 5 implementation decisions you made and why
   - 1 alternative you rejected and why

### Deliverables

- Code changes in `starter/`
- `THREAT_MODEL.md`
- `COMPLIANCE_NOTES.md`
- `EXPLOIT_DEMO.md`
- `DECISIONS.md`

### Constraints

- Keep changes small and production-pragmatic.
- Do not redesign the whole app.
- Prefer clear controls over perfect completeness.
- Assume Redis and GCS are available in production; local fallback paths may still exist in the starter code.

### Definition Of Done (Pass/Fail)

Your submission is only complete if all items below are true:

1. You fixed at least 3 real vulnerabilities, including one Redis issue and one GCS issue.
2. Redis share token handling includes all of:
   - cryptographically strong token generation
   - TTL/expiration
   - a revocation or one-time-use strategy
   - no unnecessary PHI in Redis values
3. GCS audit handling includes all of:
   - non-overwritable object strategy (or an explicit compensating control)
   - behavior for audit write failure
   - documented bucket security assumptions (IAM, retention/versioning, encryption)
4. Record access/share creation has authorization checks that prevent IDOR/BOLA.
5. Logs/audit payloads no longer expose raw sensitive record content unnecessarily.
6. `EXPLOIT_DEMO.md` includes exact commands and before/after behavior.

### AI Usage Policy

AI tools are allowed. However, submission quality is judged on your understanding:

1. You must be able to explain and defend every code change in a live walkthrough.
2. You must explain at least one tradeoff you intentionally accepted.
3. If you cannot explain your own fixes, the submission is treated as incomplete.

## Starter App

Path: `security-test/starter`

Optional run steps:

```bash
cd security-test/starter
npm install
npm run dev
```

Test headers for local requests:

- `x-user-id: user-1`
- `x-role: member` (or `admin`)

See `starter/README.md` for Redis/GCS environment flags and local Redis startup.
