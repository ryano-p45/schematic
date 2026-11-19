import { useDiagramLive } from './useDiagramLive'

/** Playbook role-flow: pending payment → store confirm (screenshot target). */
export function IqOrdersDiagram() {
  const ref = useDiagramLive<HTMLElement>(0.2)

  return (
    <article className="pb-diagram" ref={ref}>
      <span className="pb-pill">
        <i /> How it moves · Orders
      </span>
      <h1>
        Pay pending. <em>Confirm with the store.</em>
      </h1>
      <p className="pb-lead">
        Checkout creates a pending order after Ozow. A background job calls that store’s IQ API, writes
        the sales order, then payment completes.
      </p>

      <figure className="role-flow" aria-label="Pending payment confirmed with store IQ API via background job">
        <div className="rf-grid" aria-hidden="true">
          <ul className="rf-sources" style={{ gridTemplateRows: 'repeat(3, 1fr)' }}>
            <li>
              <div className="rf-shell">
                <div className="rf-core">
                  <div className="rf-source">
                    <span className="rf-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="9" cy="19" r="1.5" />
                        <circle cx="17" cy="19" r="1.5" />
                        <path d="M3 3h2l2.4 11.2a2 2 0 002 1.6h7.8a2 2 0 001.9-1.4L21 7H7" />
                      </svg>
                    </span>
                    <span>
                      <span className="rf-title">Ecommerce cart</span>
                      <span className="rf-sub">Canonical product · winning store</span>
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
                        <rect x="3" y="6" width="18" height="13" rx="2" />
                        <path d="M3 10h18M7 14h4" />
                      </svg>
                    </span>
                    <span>
                      <span className="rf-title">Ozow</span>
                      <span className="rf-sub">Payment authorised, still pending</span>
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
                        <path d="M12 8v4l3 2" />
                        <circle cx="12" cy="12" r="9" />
                      </svg>
                    </span>
                    <span>
                      <span className="rf-title">Job queue</span>
                      <span className="rf-sub">Respect store rate limits</span>
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
                  <path d="M4 12h4l2-6 4 12 2-6h4" />
                </svg>
              </span>
            </div>
            <p className="rf-hub-title">Background job</p>
            <p className="rf-hub-cap">calls store REST API</p>
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
            <span className="rf-link-label is-up">confirm</span>
            <span className="rf-link-label is-down">retry</span>
          </div>
          <span className="rf-drop" />

          <div className="rf-shell rf-panel-shell">
            <div className="rf-core">
              <div className="rf-panel">
                <div className="rf-panel-head">
                  <span className="rf-panel-title">What comes out</span>
                  <span className="rf-panel-note">SO in IQ, then capture</span>
                </div>
                <ol className="rf-stages">
                  <li>
                    <span className="rf-stage" style={{ ['--stage-delay' as string]: '700ms' }}>
                      Allocate
                    </span>
                    <span className="rf-sep">›</span>
                  </li>
                  <li>
                    <span className="rf-stage" style={{ ['--stage-delay' as string]: '920ms' }}>
                      Stock check
                    </span>
                    <span className="rf-sep">›</span>
                  </li>
                  <li>
                    <span className="rf-stage" style={{ ['--stage-delay' as string]: '1140ms' }}>
                      Write SO
                    </span>
                    <span className="rf-sep">›</span>
                  </li>
                  <li>
                    <span className="rf-stage" style={{ ['--stage-delay' as string]: '1360ms' }}>
                      Capture
                    </span>
                  </li>
                </ol>
                <ul className="rf-outcomes">
                  <li>
                    <svg className="rf-out-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-6-6z" />
                      <path d="M14 3v6h6M8 13h8M8 17h5" />
                    </svg>
                    <span>
                      <span className="rf-title">Sales order in IQ</span>
                      <span className="rf-sub">Local store SKU + web / payment reference.</span>
                    </span>
                  </li>
                  <li>
                    <svg className="rf-out-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>
                      <span className="rf-title">Payment captured</span>
                      <span className="rf-sub">Only after the store API confirms the write.</span>
                    </span>
                  </li>
                  <li>
                    <svg className="rf-out-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 9v4M12 17h.01" />
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                    <span>
                      <span className="rf-title">Soft-fail path</span>
                      <span className="rf-sub">
                        API down → keep pending, don’t allocate more, never double-post.
                      </span>
                    </span>
                  </li>
                </ul>
                <p className="rf-receipt">
                  <span className="rf-receipt-dot" />
                  pending · confirmed · captured · done
                </p>
              </div>
            </div>
          </div>
        </div>
      </figure>

      <p className="pb-note">
        <strong>Approach:</strong> API path (not a store-side SQL agent). Platform45 jobs dial each
        store’s <em>IQEntAPIRestServer</em>.
      </p>
    </article>
  )
}
