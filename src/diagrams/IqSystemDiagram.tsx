import { useDiagramLive } from './useDiagramLive'

function Track({ delay }: { delay: string }) {
  return (
    <span className="sys-track" aria-hidden="true">
      <svg viewBox="0 0 36 12" preserveAspectRatio="none">
        <path className="rail" d="M2 6 H34" />
        <path
          className="pb-track-comet"
          pathLength={100}
          d="M2 6 H34"
          style={{ ['--d' as string]: delay }}
        />
      </svg>
    </span>
  )
}

type NodeProps = { n: string; title: string; sub: string; ink?: boolean }

function Node({ n, title, sub, ink }: NodeProps) {
  return (
    <div className={`sys-node${ink ? ' is-ink' : ''}`}>
      <i>{n}</i>
      <span>
        <b>{title}</b>
        <small>{sub}</small>
      </span>
    </div>
  )
}

/** Playbook vertical spine: onboard → capture. */
export function IqSystemDiagram() {
  const ref = useDiagramLive<HTMLElement>(0.12)

  return (
    <article className="pb-diagram" ref={ref}>
      <span className="pb-pill">
        <i /> Full system
      </span>
      <h1>
        How everything <em>works</em>
      </h1>
      <p className="pb-lead">
        From store API config to a captured payment. Each row is a phase. Follow the red comet left
        to right, then down.
      </p>

      <div className="pb-legend">
        <span>
          <i /> Main path
        </span>
        <span>
          <i className="dashed" /> Only sometimes
        </span>
        <span>
          <i className="comet" /> Direction of travel
        </span>
      </div>

      <div className="sys-board">
        <div className="sys-phase" data-n="1">
          <div className="pb-soft">
            <div className="pb-soft-core sys-phase-core">
              <div className="sys-phase-head">
                <span className="sys-phase-title">Onboard each store</span>
                <span className="sys-phase-note">IQEntAPIRestServer config on Platform45</span>
              </div>
              <div className="sys-flow">
                <Node n="1" title="Add store" sub="Blyvoor / pilot store" ink />
                <Track delay="0ms" />
                <Node n="2" title="API config" sub="Host · port · TLS · auth" />
                <Track delay="200ms" />
                <Node n="3" title="Rate limits" sub="Token expiry · QPS cap" />
              </div>
            </div>
          </div>
        </div>

        <div className="sys-phase" data-n="2">
          <div className="pb-soft">
            <div className="pb-soft-core sys-phase-core">
              <div className="sys-phase-head">
                <span className="sys-phase-title">Sync catalogue from every store</span>
                <span className="sys-phase-note">Background jobs call each store REST API</span>
              </div>
              <div className="sys-flow">
                <Node n="4" title="Job: fetch" sub="Products per store" />
                <Track delay="100ms" />
                <Node n="5" title="Store A" sub="SKU e.g. 0101" />
                <Track delay="250ms" />
                <Node n="6" title="Store B" sub="SKU e.g. CEM" />
              </div>
            </div>
          </div>
        </div>

        <div className="sys-phase" data-n="3">
          <div className="pb-soft">
            <div className="pb-soft-core sys-phase-core">
              <div className="sys-phase-head">
                <span className="sys-phase-title">Unify products</span>
                <span className="sys-phase-note">Matching engine · one product, many store SKUs</span>
              </div>
              <div className="sys-flow">
                <Node n="7" title="Score matches" sub="AI rules + confidence" />
                <Track delay="150ms" />
                <Node n="8" title="Auto ≥98%" sub="Learns from confirms" />
                <Track delay="300ms" />
                <Node n="9" title="Canonical catalogue" sub="Ready for the storefront" />
              </div>
              <div className="sys-branch">
                <strong>Only sometimes:</strong> low-confidence matches go to human review (FTG
                master map + ops) before they publish.
              </div>
            </div>
          </div>
        </div>

        <div className="sys-phase" data-n="4">
          <div className="pb-soft">
            <div className="pb-soft-core sys-phase-core">
              <div className="sys-phase-head">
                <span className="sys-phase-title">Stock cache</span>
                <span className="sys-phase-note">Honest scarcity · no live on-hand on the front end</span>
              </div>
              <div className="sys-flow">
                <Node n="10" title="Jobs sync stock" sub="On a safe cadence" />
                <Track delay="100ms" />
                <Node n="11" title="Platform cache" sub="Per store signal" />
                <Track delay="250ms" />
                <Node n="12" title="Storefront" sub="In / out or bands" />
              </div>
            </div>
          </div>
        </div>

        <div className="sys-phase" data-n="5">
          <div className="pb-soft">
            <div className="pb-soft-core sys-phase-core">
              <div className="sys-phase-head">
                <span className="sys-phase-title">Shop and checkout</span>
                <span className="sys-phase-note">One product experience · allocate a winning store</span>
              </div>
              <div className="sys-flow">
                <Node n="13" title="Customer browses" sub="Unified product" />
                <Track delay="100ms" />
                <Node n="14" title="Checkout" sub="Pick fulfilment store" />
                <Track delay="250ms" />
                <Node n="15" title="Ozow" sub="Payment authorised" />
                <Track delay="400ms" />
                <Node n="16" title="Order pending" sub="Not captured yet" />
              </div>
            </div>
          </div>
        </div>

        <div className="sys-phase is-end" data-n="6">
          <div className="pb-soft">
            <div className="pb-soft-core sys-phase-core">
              <div className="sys-phase-head">
                <span className="sys-phase-title">Confirm with the store, then capture</span>
                <span className="sys-phase-note">
                  Background job → store IQ API → sales order → payment
                </span>
              </div>
              <div className="sys-flow">
                <Node n="17" title="Confirm job" sub="Respect rate limit" />
                <Track delay="100ms" />
                <Node n="18" title="Final stock check" sub="API hit at purchase" />
                <Track delay="250ms" />
                <Node n="19" title="Write sales order" sub="Local store SKU" />
                <Track delay="400ms" />
                <Node n="20" title="Capture payment" sub="Done" ink />
              </div>
              <div className="sys-branch">
                <strong>Only sometimes:</strong> if the store API is down, keep payment pending, mark
                the store unhealthy, offer next-best, and never double-post the same web order id.
              </div>
            </div>
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
