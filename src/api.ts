export type ProjectListItem = {
  slug: string
  title: string
  client: string
  summary: string
  updatedAt: string
}

export type ContentBlock = {
  label?: string
  title?: string
  body?: string
  bullets?: string[]
  tone?: 'default' | 'dark' | 'preferred'
}

export type Section = {
  headline: string
  lede?: string
  blocks: ContentBlock[]
}

export type FlowBundle =
  | { type: 'playbook'; title?: string; diagram: string }
  | { type: 'sections'; title?: string; blocks: ContentBlock[] }

export type Project = {
  slug: string
  title: string
  client: string
  summary: string
  updatedAt: string
  sections: {
    problem: Section
    solving: Section
    solution: Section
  }
  flows: Record<string, FlowBundle>
}

async function req<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw Object.assign(new Error('request_failed'), { status: res.status, err })
  }
  return res.json() as Promise<T>
}

export const api = {
  me: () => req<{ ok: true }>('/api/auth/me'),
  login: (password: string) =>
    req<{ ok: true }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),
  logout: () => req<{ ok: true }>('/api/auth/logout', { method: 'POST' }),
  projects: () => req<ProjectListItem[]>('/api/projects'),
  project: (slug: string) => req<Project>(`/api/projects/${slug}`),
}
