import { useDiagramLive } from './useDiagramLive'

/** Playbook role-flow: many store SKUs → matching engine → catalogue. */
export function IqCatalogueDiagram() {
  const ref = useDiagramLive<HTMLElement>(0.2)

  return (
    <article className="pb-diagram" ref={ref}>
      <span className="pb-pill">
        <i /> How it moves · Catalogue
      </span>
      <h1>
        Many store SKUs. <em>One product.</em>
      </h1>
      <p className="pb-lead">
        Background jobs fetch each store’s IQ REST API. The matching engine unifies codes into a
        canonical catalogue the ecommerce storefront sells.
      </p>

      <figure
        className="role-flow"
        aria-label="Per-store IQ APIs feed the matching engine which publishes a unified catalogue"
      >
        <div className="rf-grid" aria-hidden="true">
          <ul className="rf-sources" style={{ gridTemplateRows: 'repeat(3, 1fr)' }}>
            <li>
              <div className="rf-shell">
                <div className="rf-core">
                  <div className="rf-source">
                    <span className="rf-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="4" width="18" height="16" rx="2" />
                        <path d="M7 8h4M7 12h10M7 16h8" />
                      </svg>
                    </span>
                    <span>
                      <span className="rf-title">Store A IQ API</span>
                      <span className="rf-sub">SKU 0101 · own port / TLS / auth</span>
                    </span>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="rf-shell">
                <div className="rf-core">
                  <div className="rf-source">
                    <span className="rf-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="4" width="18" height="16" rx="2" />
                        <path d="M7 8h4M7 12h10M7 16h8" />
                      </svg>
                    </span>
                    <span>
                      <span className="rf-title">Store B IQ API</span>
                      <span className="rf-sub">SKU CEM · same product, different code</span>
                    </span>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="rf-shell">
                <div className="rf-core">
                  <div className="rf-source">
                    <span className="rf-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4" />
                      </svg>
                    </span>
                    <span>
                      <span className="rf-title">Store config</span>
                      <span className="rf-sub">URL, certs, rate limit, token expiry</span>
                    </span>
                  </div>
                </div>
              </div>
            </li>
          </ul>

          <div className="rf-link">
            <svg className="pb-comet-svg" viewBox="0 0 88 360" preserveAspectRatio="none">
              <path d="M0 60 C 48.4 60, 39.6 180, 88 180" className="rail" vectorEffect="non-scaling-stroke" />
              <path
                d="M0 60 C 48.4 60, 39.6 180, 88 180"
                pathLength={100}
                className="comet"
                vectorEffect="non-scaling-stroke"
                style={{ ['--comet-delay' as string]: '0ms' }}
              />
              <path d="M0 180 C 48.4 180, 39.6 180, 88 180" className="rail" vectorEffect="non-scaling-stroke" />
              <path
                d="M0 180 C 48.4 180, 39.6 180, 88 180"
                pathLength={100}
                className="comet"
                vectorEffect="non-scaling-stroke"
                style={{ ['--comet-delay' as string]: '120ms' }}
              />
              <path d="M0 300 C 48.4 300, 39.6 180, 88 180" className="rail" vectorEffect="non-scaling-stroke" />
              <path
                d="M0 300 C 48.4 300, 39.6 180, 88 180"
                pathLength={100}
                className="comet"
                vectorEffect="non-scaling-stroke"
                style={{ ['--comet-delay' as string]: '240ms' }}
              />
            </svg>
          </div>
          <span className="rf-drop" />

          <div className="rf-hub">
            <div className="rf-hub-mark">
              <span className="rf-pulse" />
              <span className="rf-wash" />
              <span className="rf-hub-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
                  <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
                </svg>
              </span>
            </div>
            <p className="rf-hub-title">Matching engine</p>
            <p className="rf-hub-cap">AI rules + confidence</p>
          </div>

          <div className="rf-link">
            <svg className="pb-comet-svg" viewBox="0 0 88 360" preserveAspectRatio="none">
              <path d="M0 168 L88 168" className="rail" vectorEffect="non-scaling-stroke" />
              <path
                d="M0 168 L88 168"
                pathLength={100}
                className="comet"
                vectorEffect="non-scaling-stroke"
                style={{ ['--comet-delay' as string]: '1700ms' }}
              />
              <path d="M88 192 L0 192" className="rail rail-back" vectorEffect="non-scaling-stroke" />
            </svg>
            <span className="rf-link-label is-up">unify</span>
            <span className="rf-link-label is-down">re-sync</span>
          </div>
          <span className="rf-drop" />

          <div className="rf-shell rf-panel-shell">
            <div className="rf-core">
              <div className="rf-panel">
                <div className="rf-panel-head">
                  <span className="rf-panel-title">What the storefront gets</span>
                  <span className="rf-panel-note">one id, many SKUs</span>
                </div>
                <ol className="rf-stages">
                  <li>
                    <span className="rf-stage" style={{ ['--stage-delay' as string]: '700ms' }}>
                      Fetch
                    </span>
                    <span className="rf-sep">›</span>
                  </li>
                  <li>
                    <span className="rf-stage" style={{ ['--stage-delay' as string]: '920ms' }}>
                      Score
                    </span>
                    <span className="rf-sep">›</span>
                  </li>
                  <li>
                    <span className="rf-stage" style={{ ['--stage-delay' as string]: '1140ms' }}>
                      Map
                    </span>
                    <span className="rf-sep">›</span>
                  </li>
                  <li>
                    <span className="rf-stage" style={{ ['--stage-delay' as string]: '1360ms' }}>
                      Cache
                    </span>
                  </li>
                </ol>
                <ul className="rf-outcomes">
                  <li>
                    <svg className="rf-out-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 7h16M4 12h16M4 17h10" />
                    </svg>
                    <span>
                      <span className="rf-title">Canonical catalogue</span>
                      <span className="rf-sub">Ecommerce shows one cement bag, not two codes.</span>
                    </span>
                  </li>
                  <li>
                    <svg className="rf-out-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 11l3 3L22 4" />
                      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                    </svg>
                    <span>
                      <span className="rf-title">Ruleset per store</span>
                      <span className="rf-sub">
                        Auto-approve ≥98%. Below that, human review. Learns from confirms.
                      </span>
                    </span>
                  </li>
                  <li>
                    <svg className="rf-out-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 3v18M5 8h14M7 12h10M9 16h6" />
                    </svg>
                    <span>
                      <span className="rf-title">Stock cache</span>
                      <span className="rf-sub">No live on-hand on the FE. Final check only at purchase.</span>
                    </span>
                  </li>
                </ul>
                <p className="rf-receipt">
                  <span className="rf-receipt-dot" />
                  fetched · matched · cached · ready to sell
                </p>
              </div>
            </div>
          </div>
        </div>
      </figure>

      <p className="pb-note">
        <strong>Per store on Platform45:</strong> host, port, Basic auth, TLS cert/key/password, rate
        limit, token expiry — mirrored from each store’s <em>IQEntAPIRestServer</em> web server
        config.
      </p>
    </article>
  )
}
