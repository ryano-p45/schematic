import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, type FlowBundle, type Project } from '../api'
import { BlockCard, SectionBlocks } from '../components/SectionBlocks'
import { PlaybookDiagram } from '../diagrams/PlaybookDiagram'

const FLOW_ORDER = ['system', 'catalogue', 'order', 'orderPath', 'order-path']

export function ProjectPage({ onLogout }: { onLogout: () => void }) {
  const { slug = '' } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .project(slug)
      .then(setProject)
      .catch(() => setError('Project not found'))
  }, [slug])

  if (error) {
    return (
      <div className="shell page-head">
        <p className="error">{error}</p>
        <Link to="/">← Back</Link>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="shell page-head">
        <p className="muted">Loading…</p>
      </div>
    )
  }

  const flowEntries = Object.entries(project.flows)
    .filter(([, f]) => f)
    .sort(([a], [b]) => {
      const ia = FLOW_ORDER.indexOf(a)
      const ib = FLOW_ORDER.indexOf(b)
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
    })

  return (
    <>
      <div className="nav-wrap">
        <nav className="nav" aria-label="Sections">
          <Link className="nav-brand" to="/">
            <span className="nav-dot" aria-hidden /> Schematic
          </Link>
          <a className="step" href="#problem">
            Problem
          </a>
          <a className="step" href="#solving">
            Solving
          </a>
          <a className="step" href="#solution">
            Solution
          </a>
          <a className="step" href="#flows">
            Flows
          </a>
          <button className="step" type="button" onClick={onLogout}>
            Log out
          </button>
        </nav>
      </div>

      <main>
        <section className="hero shell">
          <span className="eyebrow">{project.client}</span>
          <h1>
            {project.title.includes('×') ? (
              <>
                {project.title.split('×')[0]}
                <em>×{project.title.split('×')[1]}</em>
              </>
            ) : (
              project.title
            )}
          </h1>
          <p className="hero-lede">{project.summary}</p>
          <p className="hero-meta">Updated {new Date(project.updatedAt).toLocaleDateString()}</p>
        </section>

        <SectionBlocks section={project.sections.problem} step="problem" />
        <SectionBlocks section={project.sections.solving} step="solving" />
        <SectionBlocks section={project.sections.solution} step="solution" />

        <section className="section" id="flows">
          <div className="shell-wide">
            <div className="section-head">
              <div className="step-num">04</div>
              <h2>Flows in detail</h2>
              <p>Playbook diagrams on the page — soft cards inside, no iframe frames.</p>
            </div>
            <div className="flow-stack">
              {flowEntries.map(([key, flow]) => (
                <FlowPanel key={key} flow={flow!} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="shell footer">
        <p>
          <strong>Schematic</strong> · {project.title}
        </p>
      </footer>
    </>
  )
}

function FlowPanel({ flow }: { flow: FlowBundle }) {
  if (flow.type === 'playbook') {
    return (
      <div className="flow-panel">
        <PlaybookDiagram diagram={flow.diagram} />
      </div>
    )
  }

  return (
    <div className="flow-panel">
      {flow.title ? <span className="label">{flow.title}</span> : null}
      <div className="bento" style={{ marginTop: '0.75rem' }}>
        {flow.blocks.map((b, i) => (
          <BlockCard key={`${b.title}-${i}`} block={b} className="span-4" />
        ))}
      </div>
    </div>
  )
}
