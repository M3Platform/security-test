# Starter Service

Small Fastify API with route/manager/storage layers.

## Quick start

```bash
cp .env.example .env
docker compose up -d redis
npm install
npm run dev
```

## Optional external integrations

- Redis share storage: set `USE_REDIS_FOR_SHARES=true` and `REDIS_URL=redis://localhost:6379`
- GCS audit logging: set `USE_GCS_AUDIT_LOGGING=true`, `GCS_AUDIT_BUCKET=<bucket>`, and optionally `GCP_PROJECT_ID=<project>`

If these env vars are not set, the app falls back to in-memory share storage and console audit logs.

## Endpoints

- `GET /records/:recordId`
- `POST /records/:recordId/share`
- `POST /records/:recordId/guidance`

## Example requests

```bash
curl -s http://localhost:5050/records/rec-100 \
  -H 'x-user-id: user-1' \
  -H 'x-role: member'

curl -s -X POST http://localhost:5050/records/rec-100/share \
  -H 'x-user-id: user-1' \
  -H 'x-role: member'

curl -s -X POST http://localhost:5050/records/rec-100/guidance \
  -H 'content-type: application/json' \
  -H 'x-user-id: user-1' \
  -H 'x-role: member' \
  -d '{"patientSummary":"Symptoms better but still intermittent pain."}'
```
