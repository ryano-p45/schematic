import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getProject, listProjects, upsertProject } from './store.js'
import type { ProjectBundle } from './types.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT || 3000)
const isProd = process.env.NODE_ENV === 'production'
const SITE_PASSWORD = process.env.SITE_PASSWORD || (isProd ? '' : 'schematic-view')
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || (isProd ? '' : 'schematic-admin-ship')
const COOKIE_NAME = 'schematic_session'

if (isProd && (!SITE_PASSWORD || !ADMIN_TOKEN)) {
  console.error('SITE_PASSWORD and ADMIN_TOKEN are required in production')
  process.exit(1)
}

const app = express()
app.set('trust proxy', 1)
app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '5mb' }))
app.use(cookieParser())

function authed(req: express.Request) {
  return req.cookies?.[COOKIE_NAME] === 'ok'
}

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!authed(req)) {
    res.status(401).json({ ok: false, error: 'unauthorized' })
    return
  }
  next()
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'schematic' })
})

app.post('/api/auth/login', (req, res) => {
  const password = String(req.body?.password || '')
  if (password !== SITE_PASSWORD) {
    res.status(401).json({ ok: false, error: 'invalid_password' })
    return
  }
  res.cookie(COOKIE_NAME, 'ok', {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    maxAge: 1000 * 60 * 60 * 24 * 30,
    path: '/',
  })
  res.json({ ok: true })
})

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie(COOKIE_NAME, { path: '/' })
  res.json({ ok: true })
})

app.get('/api/auth/me', (req, res) => {
  if (!authed(req)) {
    res.status(401).json({ ok: false })
    return
  }
  res.json({ ok: true })
})

app.get('/api/projects', requireAuth, (_req, res) => {
  res.json(listProjects())
})

app.get('/api/projects/:slug', requireAuth, (req, res) => {
  const project = getProject(req.params.slug)
  if (!project) {
    res.status(404).json({ ok: false, error: 'not_found' })
    return
  }
  res.json(project)
})

app.post('/api/projects', (req, res) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (token !== ADMIN_TOKEN) {
    res.status(401).json({ ok: false, error: 'unauthorized' })
    return
  }
  const raw = req.body as ProjectBundle & {
    sections?: Record<string, { blocks?: unknown; cards?: unknown }>
  }
  if (!raw?.slug || !raw?.title || !raw?.sections || !raw?.flows) {
    res.status(400).json({ ok: false, error: 'invalid_bundle' })
    return
  }
  // Accept skill schema `blocks` or legacy `cards`
  const sections = Object.fromEntries(
    Object.entries(raw.sections).map(([key, section]) => {
      const s = section as { blocks?: unknown; cards?: unknown; headline?: string; lede?: string }
      return [
        key,
        {
          ...s,
          blocks: s.blocks || s.cards || [],
        },
      ]
    }),
  ) as ProjectBundle['sections']
  const saved = upsertProject({
    ...raw,
    sections,
    updatedAt: raw.updatedAt || new Date().toISOString(),
  })
  res.json({ ok: true, project: saved })
})

const distDir = path.join(process.cwd(), 'dist')
app.use(express.static(distDir))
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next()
  res.sendFile(path.join(distDir, 'index.html'), (err) => {
    if (err) next()
  })
})

app.listen(PORT, () => {
  console.log(`schematic listening on :${PORT}`)
})
