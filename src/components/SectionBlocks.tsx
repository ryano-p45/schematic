import type { ContentBlock, Section } from '../api'

function spanFor(i: number, total: number) {
  if (total === 1) return 'span-12'
  if (total === 3 && i === 2) return 'span-12'
  if (total >= 4 && i < 2) return i === 0 ? 'span-8' : 'span-4'
  return 'span-6'
}

export function SectionBlocks({ section, step }: { section: Section; step: string }) {
  return (
    <section className="section" id={step}>
      <div className="shell">
        <div className="section-head">
          <div className="step-num">{step === 'problem' ? '01' : step === 'solving' ? '02' : '03'}</div>
          <h2>{section.headline}</h2>
          {section.lede ? <p>{section.lede}</p> : null}
        </div>
        <div className="bento">
          {section.blocks.map((block, i) => (
            <BlockCard key={`${block.title}-${i}`} block={block} className={spanFor(i, section.blocks.length)} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function BlockCard({ block, className = 'span-12' }: { block: ContentBlock; className?: string }) {
  const tone = block.tone || 'default'
  return (
    <div className={`bezel ${className}`}>
      <div className={`card${tone === 'dark' ? ' dark' : ''}${tone === 'preferred' ? ' preferred' : ''}`}>
        {block.label ? <span className="label">{block.label}</span> : null}
        {block.title ? <h3>{block.title}</h3> : null}
        {block.body ? <p>{block.body}</p> : null}
        {block.bullets?.length ? (
          <ul>
            {block.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}
