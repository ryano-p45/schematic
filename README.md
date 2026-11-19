# Schematic

Client-facing project schematics: **Problem → Solving → Solution → Flows**.

Vite + React + TypeScript SPA with a small Express API, one Railway service.

## Env

| Variable | Purpose |
|---|---|
| `SITE_PASSWORD` | Viewer login gate (httpOnly cookie) |
| `ADMIN_TOKEN` | Bearer token for `POST /api/projects` (skill: `SCHEMATIC_ADMIN_TOKEN`) |
| `PORT` | Listen port (Railway sets this) |
| `DATA_DIR` | Writable store dir (Docker default `/data`) |
| `NODE_ENV` | `production` on Railway |

## Local

```bash
npm install
npm run dev          # API :3001 via proxy, Vite :5173
npm run build && npm start
```

Seed project loads from `server/data/projects/build-it-iq.json` on boot.

## API

- `GET /api/health`
- `POST /api/auth/login` `{ "password": "..." }` → httpOnly cookie
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/projects` (auth)
- `GET /api/projects/:slug` (auth)
- `POST /api/projects` `Authorization: Bearer <ADMIN_TOKEN>` — upsert project bundle

### Upload (matches Schematic skill)

```bash
SCHEMATIC_URL="https://your-app.up.railway.app" \
SCHEMATIC_ADMIN_TOKEN="$ADMIN_TOKEN" \
  ~/.cursor/skills/schematic/scripts/upload.sh ./project.bundle.json
```

Or:

```bash
curl -sS -X POST "$SCHEMATIC_URL/api/projects" \
  -H "Authorization: Bearer $SCHEMATIC_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  --data-binary @project.bundle.json
```

Bundle shape: `sections.{problem,solving,solution}.blocks` + `flows.system` (React Flow).
