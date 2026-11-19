import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, type FlowBundle, type Project } from '../api'
import { BlockCard, SectionBlocks } from '../components/SectionBlocks'
import { FlowBoard } from '../components/FlowBoard'

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

  const flowEntries = Object.entries(project.flows).filter(([, f]) => f)

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
              <p>Pan and zoom the boards in place — no separate full-size pages.</p>
            </div>
            <div className="bento">
              {flowEntries.map(([key, flow]) => (
                <FlowPanel key={key} flowKey={key} flow={flow!} />
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

function FlowPanel({ flowKey, flow }: { flowKey: string; flow: FlowBundle }) {
  const title = flow.title || flowKey
  const compact = flowKey !== 'system'

  return (
    <div className="bezel span-12">
      <div className="card">
        <span className="label">{title}</span>
        {flow.type === 'reactflow' || flow.type === 'react-flow' ? (
          <FlowBoard nodes={flow.nodes} edges={flow.edges} compact={compact} />
        ) : (
          <div className="bento" style={{ marginTop: '0.75rem' }}>
            {'blocks' in flow
              ? flow.blocks.map((b, i) => (
                  <BlockCard key={`${b.title}-${i}`} block={b} className="span-4" />
                ))
              : null}
          </div>
        )}
      </div>
    </div>
  )
}
