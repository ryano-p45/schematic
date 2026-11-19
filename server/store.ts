import fs from 'node:fs'
import path from 'node:path'
import type { ProjectBundle, ProjectListItem } from './types.js'

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data')
const STORE_PATH = path.join(DATA_DIR, 'projects.json')
const SEED_PATH = path.join(process.cwd(), 'data', 'seed-build-it-iq.json')

function ensureStore() {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(STORE_PATH)) {
    const seed: Record<string, ProjectBundle> = {}
    if (fs.existsSync(SEED_PATH)) {
      const project = JSON.parse(fs.readFileSync(SEED_PATH, 'utf8')) as ProjectBundle
      seed[project.slug] = project
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(seed, null, 2))
  }
}

function readAll(): Record<string, ProjectBundle> {
  ensureStore()
  return JSON.parse(fs.readFileSync(STORE_PATH, 'utf8')) as Record<string, ProjectBundle>
}

function writeAll(data: Record<string, ProjectBundle>) {
  ensureStore()
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2))
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
