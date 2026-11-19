# Schematic

Client-facing project schematics: **Problem → Solving → Solution → Flows**.

Vite + React + TypeScript SPA with a small Express API, one Railway service. Graphs render in-page with `@xyflow/react` (pan/zoom, no “open full size” links).

## Credentials (shareable)

| Variable | Value |
|---|---|
| `SITE_PASSWORD` | `schematic-view` |
| `ADMIN_TOKEN` | `schematic-admin-ship` |

## Local

```bash
npm install
npm run dev          # API :3001 via Vite proxy, client :5173
npm run build && SITE_PASSWORD=schematic-view ADMIN_TOKEN=schematic-admin-ship PORT=3000 npm start
```

Build It × IQ is auto-seeded from `data/seed-build-it-iq.json` on first boot.

## API

- `GET /api/health`
- `POST /api/auth/login` `{ "password": "..." }` → httpOnly cookie
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/projects` (auth)
- `GET /api/projects/:slug` (auth)
- `POST /api/projects` `Authorization: Bearer <ADMIN_TOKEN>` — upsert project bundle

### Upsert a project

```bash
curl -X POST "$URL/api/projects" \
  -H "Authorization: Bearer schematic-admin-ship" \
  -H "Content-Type: application/json" \
  -d @data/seed-build-it-iq.json
```

## Env

- `SITE_PASSWORD` — viewer login (required in production)
- `ADMIN_TOKEN` — admin upload bearer token (required in production)
- `PORT` — listen port (Railway sets this)
- `NODE_ENV` — `production` on Railway
- `DATA_DIR` — optional; defaults to `./data` (Docker uses `/data`)
