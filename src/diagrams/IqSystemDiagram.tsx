import { useEffect, useRef, type CSSProperties } from 'react'
import { useDiagramLive } from './useDiagramLive'

type LaneId =
  | 'customer'
  | 'storefront'
  | 'platform'
  | 'match'
  | 'jobs'
  | 'storeApi'
  | 'iq'
  | 'ozow'
  | 'ops'

const LANES: { id: LaneId; title: string; sub: string }[] = [
  { id: 'customer', title: 'Customer', sub: 'Browses and pays' },
  { id: 'storefront', title: 'Storefront', sub: 'One product UX' },
  { id: 'platform', title: 'Platform45', sub: 'Catalogue + orders' },
  { id: 'match', title: 'Matching', sub: 'Unify store SKUs' },
  { id: 'jobs', title: 'Jobs', sub: 'Background sync' },
  { id: 'storeApi', title: 'Store API', sub: 'IQEntAPIRestServer' },
  { id: 'iq', title: 'IQ Retail', sub: 'Stock & sales truth' },
  { id: 'ozow', title: 'Ozow', sub: 'Payments' },
  { id: 'ops', title: 'Ops', sub: 'Human review' },
]

type Node = {
  id: string
  lane: LaneId
  row: number
  text: string
  n?: number
  optional?: boolean
  tone?: 'start' | 'end'
}

const NODES: Node[] = [
  { id: 'p0', lane: 'platform', row: 0, text: 'Onboard store · API config', n: 1, tone: 'start' },
  { id: 'p1', lane: 'platform', row: 1, text: 'Rate limits · token expiry', n: 2 },
  { id: 'j2', lane: 'jobs', row: 2, text: 'Fetch products per store', n: 3 },
  { id: 'a3', lane: 'storeApi', row: 3, text: 'Pull store SKUs over REST', n: 4 },
  { id: 'm4', lane: 'match', row: 4, text: 'Score matches · auto ≥98%', n: 5 },
  { id: 'ops', lane: 'ops', row: 4, text: 'Low-confidence human review', optional: true },
  { id: 'p5', lane: 'platform', row: 5, text: 'Canonical catalogue ready', n: 6 },
  { id: 'j6', lane: 'jobs', row: 6, text: 'Sync stock cache', n: 7 },
  { id: 'p7', lane: 'platform', row: 7, text: 'Cached stock signal', n: 8 },
  { id: 's8', lane: 'storefront', row: 8, text: 'Show availability bands', n: 9 },
  { id: 'c9', lane: 'customer', row: 9, text: 'Browses unified product', n: 10 },
  { id: 's10', lane: 'storefront', row: 10, text: 'Checkout · pick fulfilment store', n: 11 },
  { id: 'oz11', lane: 'ozow', row: 11, text: 'Payment authorised', n: 12 },
  { id: 'p12', lane: 'platform', row: 12, text: 'Order pending · not captured', n: 13 },
  { id: 'j13', lane: 'jobs', row: 13, text: 'Confirm job · rate-limited', n: 14 },
  { id: 'a14', lane: 'storeApi', row: 14, text: 'Final stock check at purchase', n: 15 },
  { id: 'fail', lane: 'platform', row: 14, text: 'Soft-fail · next-best store', optional: true },
  { id: 'iq15', lane: 'iq', row: 15, text: 'Write sales order · local SKU', n: 16 },
  { id: 'oz16', lane: 'ozow', row: 16, text: 'Capture payment. Done.', n: 17, tone: 'end' },
]

type Shape = 'v' | 'h' | 'hv' | 'vh'
type Edge = { from: string; to: string; shape: Shape; optional?: boolean }

const EDGES: Edge[] = [
  { from: 'p0', to: 'p1', shape: 'v' },
  { from: 'p1', to: 'j2', shape: 'v' },
  { from: 'j2', to: 'a3', shape: 'v' },
  { from: 'a3', to: 'm4', shape: 'v' },
  { from: 'm4', to: 'p5', shape: 'v' },
  { from: 'p5', to: 'j6', shape: 'v' },
  { from: 'j6', to: 'p7', shape: 'v' },
  { from: 'p7', to: 's8', shape: 'v' },
  { from: 's8', to: 'c9', shape: 'v' },
  { from: 'c9', to: 's10', shape: 'v' },
  { from: 's10', to: 'oz11', shape: 'v' },
  { from: 'oz11', to: 'p12', shape: 'v' },
  { from: 'p12', to: 'j13', shape: 'v' },
  { from: 'j13', to: 'a14', shape: 'v' },
  { from: 'a14', to: 'iq15', shape: 'v' },
  { from: 'iq15', to: 'oz16', shape: 'v' },
  { from: 'ops', to: 'm4', shape: 'h', optional: true },
  { from: 'a14', to: 'fail', shape: 'h', optional: true },
  { from: 'fail', to: 'j13', shape: 'vh', optional: true },
]

const VW = 1000
const LANE_W = VW / LANES.length
const NODE_W = LANE_W * 0.9
const PITCH = 88
const NODE_H = 62
const TOP = 12
const ROWS = 17
const HEIGHT = TOP * 2 + (ROWS - 1) * PITCH + NODE_H

const laneIndex = (id: LaneId) => LANES.findIndex((l) => l.id === id)
const cx = (lane: LaneId) => (laneIndex(lane) + 0.5) * LANE_W
const top = (row: number) => TOP + row * PITCH
const nodeById = new Map(NODES.map((n) => [n.id, n]))

function pathFor(edge: Edge) {
  const a = nodeById.get(edge.from)!
  const b = nodeById.get(edge.to)!
  const ax = cx(a.lane)
  const bx = cx(b.lane)
  const half = NODE_W / 2
  const ay = top(a.row)
  const by = top(b.row)
  const aMid = ay + NODE_H / 2
  const bMid = by + NODE_H / 2
  if (edge.shape === 'h') {
    const dir = bx > ax ? 1 : -1
    return `M${ax + dir * half} ${aMid} H${bx - dir * half}`
  }
  if (edge.shape === 'hv') {
    const dir = bx > ax ? 1 : -1
    return `M${ax + dir * half} ${aMid} H${bx} V${by}`
  }
  if (edge.shape === 'vh') {
    const dir = bx > ax ? 1 : -1
    return `M${ax} ${ay + NODE_H} V${bMid} H${bx - dir * half}`
  }
  if (ax === bx) return `M${ax} ${ay + NODE_H} V${by}`
  const mid = ay + NODE_H + (by - ay - NODE_H) / 2
  return `M${ax} ${ay + NODE_H} V${mid} H${bx} V${by}`
}

const MAIN = NODES.filter((node) => !node.optional)
const SIDE = new Map<string, Node[]>()
for (const node of NODES) {
  if (!node.optional) continue
  const edge = EDGES.find(
    (e) =>
      (e.from === node.id && !nodeById.get(e.to)!.optional) ||
      (e.to === node.id && !nodeById.get(e.from)!.optional),
  )!
  const anchor = edge.from === node.id ? edge.to : edge.from
  SIDE.set(anchor, [...(SIDE.get(anchor) ?? []), node])
}

function ListNode({ node }: { node: Node }) {
  const lane = LANES[laneIndex(node.lane)]
  const cls = `ff-item ${node.optional ? 'is-optional' : ''} ${node.tone ? `is-${node.tone}` : ''}`.trim()
  return (
    <div className={cls}>
      {node.n ? <i>{node.n}</i> : <i aria-hidden="true" />}
      <span>
        <small>{node.optional ? `${lane.title} · Only sometimes` : lane.title}</small>
        {node.text}
      </span>
    </div>
  )
}

function useScrollEdges() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const update = () => {
      const max = node.scrollWidth - node.clientWidth
      node.toggleAttribute('data-more-start', node.scrollLeft > 2)
      node.toggleAttribute('data-more-end', node.scrollLeft < max - 2)
    }
    update()
    node.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(node)
    return () => {
      node.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [])
  return ref
}

/** Playbook full-flow swimlane: onboard → capture. */
export function IqSystemDiagram() {
  const liveRef = useDiagramLive<HTMLElement>(0.08)
  const scrollRef = useScrollEdges()

  return (
    <article className="pb-diagram" ref={liveRef}>
      <span className="pb-pill">
        <i /> The whole picture
      </span>
      <h1>
        How everything <em>works</em>
      </h1>
      <p className="pb-lead">
        Every request follows this path. Each column is a system actor. Follow the red from top to
        bottom — from store API config to a captured payment.
      </p>

      <div className="ff-legend">
        <span>
          <i className="solid" />
          Every order
        </span>
        <span>
          <i className="dashed" />
          Only sometimes
        </span>
        <span className="ff-legend-wide">
          <i className="comet-key" />
          Direction of travel
        </span>
      </div>

      <ol className="ff-list" aria-label="The system path, step by step">
        {MAIN.map((node) => (
          <li key={node.id}>
            <ListNode node={node} />
            {SIDE.get(node.id)?.map((side) => (
              <ListNode key={side.id} node={side} />
            ))}
          </li>
        ))}
      </ol>

      <div
        ref={scrollRef}
        className="ff-scroll"
        tabIndex={0}
        aria-label="System swimlane, scrolls sideways on small screens"
      >
        <div className="ff">
          <div className="ff-head">
            {LANES.map((lane) => (
              <div key={lane.id}>
                <b>{lane.title}</b>
                <span>{lane.sub}</span>
              </div>
            ))}
          </div>
          <div className="ff-body" style={{ height: HEIGHT }}>
            <div className="ff-bands" aria-hidden="true">
              {LANES.map((lane) => (
                <span key={lane.id} />
              ))}
            </div>
            <svg
              viewBox={`0 0 ${VW} ${HEIGHT}`}
              preserveAspectRatio="none"
              className="ff-svg"
              aria-hidden="true"
            >
              <defs>
                <marker
                  id="ff-arrow"
                  viewBox="0 0 8 8"
                  refX="7"
                  refY="4"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                >
                  <path
                    d="M1 1 L7 4 L1 7"
                    fill="none"
                    stroke="rgba(32,32,38,0.4)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </marker>
              </defs>
              {EDGES.map((edge, i) => {
                const d = pathFor(edge)
                return (
                  <g key={`${edge.from}-${edge.to}`}>
                    <path
                      d={d}
                      className={edge.optional ? 'ff-rail is-optional' : 'ff-rail'}
                      vectorEffect="non-scaling-stroke"
                      markerEnd="url(#ff-arrow)"
                    />
                    {!edge.optional && (
                      <path
                        d={d}
                        pathLength={100}
                        className="ff-comet pb-ff-comet"
                        vectorEffect="non-scaling-stroke"
                        style={{ '--comet-delay': `${(i * 210) % 2600}ms` } as CSSProperties}
                      />
                    )}
                  </g>
                )
              })}
            </svg>
            {NODES.map((node) => {
              const style = {
                left: `${((cx(node.lane) - NODE_W / 2) / VW) * 100}%`,
                width: `${(NODE_W / VW) * 100}%`,
                top: top(node.row),
                height: NODE_H,
              } as CSSProperties
              const cls =
                `ff-node ${node.optional ? 'is-optional' : ''} ${node.tone ? `is-${node.tone}` : ''}`.trim()
              return (
                <div key={node.id} className={cls} style={style}>
                  {node.n && <i>{node.n}</i>}
                  <span>{node.text}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="sys-receipt">
        <span className="sys-receipt-dot" />
        onboarded · synced · matched · cached · pending · confirmed · captured
      </div>
    </article>
  )
}
