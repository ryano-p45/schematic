import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { ProjectBundle, ProjectListItem } from './types.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Git-friendly seed/source packs shipped with the image */
const SEED_DIR = path.join(__dirname, 'data', 'projects')

/** Writable runtime store (Railway volume or local ./data) */
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data')
const STORE_PATH = path.join(DATA_DIR, 'projects.json')

function loadSeedProjects(): Record<string, ProjectBundle> {
  const out: Record<string, ProjectBundle> = {}
  if (!fs.existsSync(SEED_DIR)) return out
  for (const name of fs.readdirSync(SEED_DIR)) {
    if (!name.endsWith('.json')) continue
    try {
      const project = JSON.parse(
        fs.readFileSync(path.join(SEED_DIR, name), 'utf8'),
      ) as ProjectBundle
      if (project?.slug) out[project.slug] = project
    } catch {
      // skip bad seed files
    }
  }
  return out
}

function ensureStore() {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(STORE_PATH)) {
    const seed = loadSeedProjects()
    // Fallback to legacy single seed path if dir empty
    if (Object.keys(seed).length === 0) {
      const legacy = path.join(process.cwd(), 'data', 'seed-build-it-iq.json')
      if (fs.existsSync(legacy)) {
        const project = JSON.parse(fs.readFileSync(legacy, 'utf8')) as ProjectBundle
        if (project?.slug) seed[project.slug] = project
      }
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(seed, null, 2))
    return
  }

  // Merge any missing seed slugs into an existing store (fresh deploys / empty volume)
  const existing = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8')) as Record<
    string,
    ProjectBundle
  >
  const seed = loadSeedProjects()
  let changed = false
  for (const [slug, project] of Object.entries(seed)) {
    if (!existing[slug]) {
      existing[slug] = project
      changed = true
    }
  }
  if (changed) fs.writeFileSync(STORE_PATH, JSON.stringify(existing, null, 2))
}

function readAll(): Record<string, ProjectBundle> {
  ensureStore()
  return JSON.parse(fs.readFileSync(STORE_PATH, 'utf8')) as Record<string, ProjectBundle>
}

function writeAll(data: Record<string, ProjectBundle>) {
  ensureStore()
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2))
  // Also mirror to per-file seed dir when writable (git-friendly shape)
  try {
    fs.mkdirSync(SEED_DIR, { recursive: true })
    for (const project of Object.values(data)) {
      fs.writeFileSync(
        path.join(SEED_DIR, `${project.slug}.json`),
        JSON.stringify(project, null, 2),
      )
    }
  } catch {
    // read-only image layer — ignore
  }
}

export function listProjects(): ProjectListItem[] {
  const all = readAll()
  return Object.values(all)
    .map(({ slug, title, client, summary, updatedAt }) => ({
      slug,
      title,
      client,
      summary,
      updatedAt,
    }))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export function getProject(slug: string): ProjectBundle | null {
  const all = readAll()
  return all[slug] ?? null
}

export function upsertProject(project: ProjectBundle): ProjectBundle {
  const all = readAll()
  const next: ProjectBundle = {
    ...project,
    updatedAt: project.updatedAt || new Date().toISOString(),
  }
  all[next.slug] = next
  writeAll(all)
  return next
}
