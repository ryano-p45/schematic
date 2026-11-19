import type { ReactElement } from 'react'
import { IqCatalogueDiagram } from './IqCatalogueDiagram'
import { IqOrderPathDiagram } from './IqOrderPathDiagram'
import { IqOrdersDiagram } from './IqOrdersDiagram'
import { IqSystemDiagram } from './IqSystemDiagram'
import './diagrams.css'

export type PlaybookDiagramId =
  | 'iq-system'
  | 'iq-catalogue'
  | 'iq-orders'
  | 'iq-order-path'
  | 'system'
  | 'catalogue'
  | 'order'
  | 'order-path'
  | 'orderPath'

const MAP: Record<string, () => ReactElement> = {
  'iq-system': IqSystemDiagram,
  system: IqSystemDiagram,
  'iq-catalogue': IqCatalogueDiagram,
  catalogue: IqCatalogueDiagram,
  'iq-orders': IqOrdersDiagram,
  order: IqOrdersDiagram,
  'iq-order-path': IqOrderPathDiagram,
  'order-path': IqOrderPathDiagram,
  orderPath: IqOrderPathDiagram,
}

export function PlaybookDiagram({ diagram }: { diagram: string }) {
  const Comp = MAP[diagram]
  if (!Comp) {
    return (
      <p className="muted">
        Unknown diagram: <code>{diagram}</code>
      </p>
    )
  }
  return <Comp />
}

export function isPlaybookDiagram(diagram?: string): diagram is PlaybookDiagramId {
  return !!diagram && diagram in MAP
}
