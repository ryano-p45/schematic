export type ContentBlock = {
  label?: string
  title?: string
  body?: string
  bullets?: string[]
  tone?: 'default' | 'dark' | 'preferred'
}

export type Section = {
  headline: string
  lede?: string
  blocks: ContentBlock[]
}

export type FlowNode = {
  id: string
  type?: string
  position: { x: number; y: number }
  data: Record<string, unknown>
  style?: Record<string, unknown>
  sourcePosition?: string
  targetPosition?: string
}

export type FlowEdge = {
  id: string
  source: string
  target: string
  label?: string
  animated?: boolean
  style?: Record<string, unknown>
  type?: string
}

export type ReactFlowBundle = {
  type: 'reactflow' | 'react-flow'
  title?: string
  nodes: FlowNode[]
  edges: FlowEdge[]
}

export type SectionsFlow = {
  type: 'sections'
  title?: string
  blocks: ContentBlock[]
}

export type FlowBundle = ReactFlowBundle | SectionsFlow

export type ProjectBundle = {
  slug: string
  title: string
  client: string
  summary: string
  updatedAt: string
  sections: {
    problem: Section
    solving: Section
    solution: Section
  }
  flows: {
    system: FlowBundle
    catalogue?: FlowBundle
    order?: FlowBundle
    [key: string]: FlowBundle | undefined
  }
}

export type ProjectListItem = {
  slug: string
  title: string
  client: string
  summary: string
  updatedAt: string
}
