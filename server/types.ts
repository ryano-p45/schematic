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

export type PlaybookFlow = {
  type: 'playbook'
  title?: string
  /** Built-in diagram id, e.g. iq-system | iq-catalogue | iq-orders | iq-order-path */
  diagram: string
}

export type SectionsFlow = {
  type: 'sections'
  title?: string
  blocks: ContentBlock[]
}

export type FlowBundle = PlaybookFlow | SectionsFlow

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
    system?: FlowBundle
    catalogue?: FlowBundle
    order?: FlowBundle
    orderPath?: FlowBundle
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
