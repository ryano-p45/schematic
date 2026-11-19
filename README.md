# Schematic

Client-facing project packs: **Problem → Solving → Solution → Flows**.

Vite + React + TypeScript SPA with a small Express API in one Railway service. Build It diagrams are playbook-style HTML/CSS/SVG on the page (comets included) — no React Flow, no iframe frames.

## Env

| Variable | Required | Purpose |
|---|---|---|
| `SITE_PASSWORD` | Yes | Shared viewer password gate (cookie session) |
| `ADMIN_TOKEN` | Yes | Bearer token for `POST /api/projects` |
| `PORT` | No | Listen port (Railway sets this) |
| `DATA_DIR` | No | JSON store directory (Docker uses `/data`) |
| `NODE_ENV` | No | `production` on Railway |

See `.env.example`.

## Local

```bash
npm install
cp .env.example .env   # set SITE_PASSWORD + ADMIN_TOKEN
npm run dev            # API :3001 via Vite proxy, client :5173
# production-style:
npm run build && SITE_PASSWORD=… ADMIN_TOKEN=… PORT=3000 npm start
```

Build It × IQ is auto-seeded from `data/seed-build-it-iq.json` on first boot.

## Flows

Project bundles use `"type": "playbook"` with a `diagram` id:

| diagram | Source |
|---|---|
| `iq-system` | Full system spine |
| `iq-catalogue` | Catalogue unify role-flow |
| `iq-orders` | Order confirm role-flow |
| `iq-order-path` | Paid order path swimlane |

Discovery is not ported. Soft cards inside diagrams are intentional; there is no heavy outer border around the whole diagram.

## API

```
GET  /api/health
POST /api/auth/login            { "password": "…" } → httpOnly cookie
POST /api/auth/logout
GET  /api/auth/me
GET  /api/projects              → [{ slug, title, client, summary, updatedAt }]
GET  /api/projects/:slug        → full project.bundle.json
POST /api/projects              Authorization: Bearer $ADMIN_TOKEN
                                body = project.bundle.json (upsert by slug)
```

### Upload a pack

```bash
export SCHEMATIC_URL="https://schematic-production-3296e916.up.railway.app"
export SCHEMATIC_ADMIN_TOKEN="…"   # same value as Railway ADMIN_TOKEN
curl -sS -X POST "$SCHEMATIC_URL/api/projects" \
  -H "Authorization: Bearer $SCHEMATIC_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  --data-binary @server/data/projects/build-it-iq.json
```

## Deploy

**Live:** https://schematic-production-3296e916.up.railway.app

Railway builds via `Dockerfile`, serves the API + static `dist` on `$PORT`, healthchecks `/api/health`. Set `SITE_PASSWORD` + `ADMIN_TOKEN` in Railway (never commit them).
