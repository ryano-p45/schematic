import { useDiagramLive } from './useDiagramLive'

/** Playbook swimlane: paid order path with IQ API. */
export function IqOrderPathDiagram() {
  const ref = useDiagramLive<HTMLElement>(0.25)

  return (
    <article className="pb-diagram" ref={ref}>
      <span className="pb-pill">
        <i /> Data flow · Preferred pattern
      </span>
      <h1>
        Paid order path with the <em>IQ API</em>
      </h1>
      <p className="pb-lead">
        Shopper → platform (pending) → background job → store IQEntAPIRestServer → capture. Red comet
        is the happy path.
      </p>

      <div className="op-scroll">
        <div className="op-swim-heads" aria-hidden="true">
          <div className="op-lane-head">
            <b>Customer</b>Checkout
          </div>
          <div className="op-lane-head">
            <b>Platform45</b>Orders + Ozow
          </div>
          <div className="op-lane-head">
            <b>Job queue</b>Background
          </div>
          <div className="op-lane-head">
            <b>Store API</b>IQEntAPIRestServer
          </div>
          <div className="op-lane-head">
            <b>IQ Retail</b>Sales order
          </div>
        </div>

        <div className="op-lanes">
          <div className="op-lane-bg">
            <div />
            <div />
            <div />
            <div />
            <div />
          </div>

          <svg className="op-ff-svg" viewBox="0 0 1000 200" preserveAspectRatio="none">
            <path className="op-ff-rail" d="M160 42 H240" />
            <path
              className="pb-ff-comet"
              pathLength={100}
              d="M160 42 H240"
              style={{ ['--comet-delay' as string]: '0ms' }}
            />
            <path className="op-ff-rail" d="M360 42 H440" />
            <path
              className="pb-ff-comet"
              pathLength={100}
              d="M360 42 H440"
              style={{ ['--comet-delay' as string]: '200ms' }}
            />
            <path className="op-ff-rail" d="M560 42 H640" />
            <path
              className="pb-ff-comet"
              pathLength={100}
              d="M560 42 H640"
              style={{ ['--comet-delay' as string]: '400ms' }}
            />
            <path className="op-ff-rail" d="M760 42 H840" />
            <path
              className="pb-ff-comet"
              pathLength={100}
              d="M760 42 H840"
              style={{ ['--comet-delay' as string]: '600ms' }}
            />
            <path className="op-ff-rail is-optional" d="M500 78 V120 H700 V138" />
            <path
              className="pb-ff-comet"
              pathLength={100}
              d="M500 78 V120 H700 V138"
              style={{ ['--comet-delay' as string]: '900ms' }}
            />
            <path className="op-ff-rail is-optional" d="M700 78 V100 H300 V138" />
            <path
              className="pb-ff-comet"
              pathLength={100}
              d="M700 78 V100 H300 V138"
              style={{ ['--comet-delay' as string]: '1400ms' }}
            />
          </svg>

          <div className="op-node is-start" style={{ left: '2%', width: '16%', top: 12 }}>
            <i>1</i>
            <span>
              Places order<small>Canonical SKU</small>
            </span>
          </div>
          <div className="op-node" style={{ left: '22%', width: '16%', top: 12 }}>
            <i>2</i>
            <span>
              Pending + Ozow<small>Not captured yet</small>
            </span>
          </div>
          <div className="op-node" style={{ left: '42%', width: '16%', top: 12 }}>
            <i>3</i>
            <span>
              Confirm job<small>Rate-limited</small>
            </span>
          </div>
          <div className="op-node" style={{ left: '62%', width: '16%', top: 12 }}>
            <i>4</i>
            <span>
              REST write<small>TLS + Basic auth</small>
            </span>
          </div>
          <div className="op-node is-end" style={{ left: '82%', width: '16%', top: 12 }}>
            <i>5</i>
            <span>
              SO posted<small>Local store SKU</small>
            </span>
          </div>
          <div className="op-node" style={{ left: '42%', width: '16%', top: 118 }}>
            <i>6</i>
            <span>
              Final stock check<small>Not shown on FE</small>
            </span>
          </div>
          <div className="op-node" style={{ left: '22%', width: '16%', top: 118 }}>
            <i>7</i>
            <span>
              Capture payment<small>Or soft-fail / retry</small>
            </span>
          </div>
        </div>
      </div>

      <div className="pb-legend">
        <span>
          <i /> Every order
        </span>
        <span>
          <i className="dashed" /> Confirm / stock loop
        </span>
        <span>
          <i className="comet" /> Direction of travel
        </span>
      </div>
      <p className="pb-note" style={{ marginTop: '1rem' }}>
        Each store added to Platform45 carries its own IQ web-server config (port, SSL certs, auth,
        rate limit). Jobs never hammer a till beyond that store’s limit.
      </p>
    </article>
  )
}
