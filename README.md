# Schematic

Client-facing project schematics: **Problem → Solving → Solution → Flows**.

Vite + React + TypeScript SPA with a small Express API, one Railway service.

## Credentials (shareable)

| Variable | Value |
|---|---|
| `SITE_PASSWORD` | `schematic-view` |
| `ADMIN_TOKEN` | `schematic-admin-ship` |

## Local

```bash
npm install
npm run dev          # API :3001 via proxy, Vite :5173
# or production-style:
npm run build && SITE_PASSWORD=schematic-view ADMIN_TOKEN=schematic-admin-ship PORT=3000 npm start
```

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

- `SITE_PASSWORD` — viewer login
- `ADMIN_TOKEN` — admin upload bearer token
- `PORT` — listen port (Railway sets this)
- `NODE_ENV` — `production` on Railway
- `DATA_DIR` — optional; defaults to `./data` (Docker uses `/data`)
