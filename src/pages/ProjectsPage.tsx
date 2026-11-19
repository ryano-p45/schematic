import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type ProjectListItem } from '../api'

export function ProjectsPage({ onLogout }: { onLogout: () => void }) {
  const [items, setItems] = useState<ProjectListItem[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .projects()
      .then(setItems)
      .catch(() => setError('Could not load projects'))
  }, [])

  return (
    <>
      <div className="nav-wrap">
        <nav className="nav" aria-label="Schematic">
          <Link className="nav-brand" to="/">
            <span className="nav-dot" aria-hidden /> Schematic
          </Link>
          <button className="step" type="button" onClick={onLogout}>
            Log out
          </button>
        </nav>
      </div>
      <div className="shell page-head">
        <span className="eyebrow">Projects</span>
        <h1>Schematics</h1>
        <p className="muted">Problem → Solving → Solution → Flows</p>
      </div>
      <div className="shell project-list">
        {error ? <p className="error">{error}</p> : null}
        {items.map((p) => (
          <Link key={p.slug} to={`/p/${p.slug}`}>
            <div className="bezel">
              <div className="card">
                <div className="client">{p.client}</div>
                <h2>{p.title}</h2>
                <p className="summary">{p.summary}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
