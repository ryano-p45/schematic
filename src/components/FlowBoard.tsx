import { useMemo, memo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  type NodeProps,
  type Node,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { FlowEdge, FlowNode } from '../api'

function nodeDetail(data: Record<string, unknown>) {
  const value = data.detail ?? data.sub
  return value ? String(value) : ''
}

function DefaultNode({ data }: NodeProps) {
  const detail = nodeDetail(data as Record<string, unknown>)
  return (
    <div className="flow-node">
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <b>{String(data.label || '')}</b>
      {detail ? <small>{detail}</small> : null}
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  )
}

function InkNode({ data }: NodeProps) {
  const detail = nodeDetail(data as Record<string, unknown>)
  return (
    <div className="flow-node ink">
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <b>{String(data.label || '')}</b>
      {detail ? <small>{detail}</small> : null}
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  )
}

function PhaseNode({ data }: NodeProps) {
  const detail = nodeDetail(data as Record<string, unknown>)
  return (
    <div className="flow-phase">
      {String(data.label || '')}
      {detail ? <small>{detail}</small> : null}
    </div>
  )
}

const nodeTypes = {
  default: memo(DefaultNode),
  ink: memo(InkNode),
  phase: memo(PhaseNode),
}

type Props = {
  nodes: FlowNode[]
  edges: FlowEdge[]
  compact?: boolean
}

export function FlowBoard({ nodes, edges, compact }: Props) {
  const rfNodes = useMemo<Node[]>(
    () =>
      nodes.map((n) => ({
        id: n.id,
        type: n.type || 'default',
        position: n.position,
        data: n.data,
        draggable: false,
        selectable: false,
      })),
    [nodes],
  )
  const rfEdges = useMemo<Edge[]>(
    () =>
      edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        animated: e.animated ?? true,
        label: e.label,
        style: { stroke: '#e92030', strokeWidth: 1.5 },
      })),
    [edges],
  )

  return (
    <div className={`flow-board${compact ? ' compact' : ''}`}>
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        minZoom={0.35}
        maxZoom={1.6}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnScroll
        proOptions={{ hideAttribution: true }}
      >
        <Background color="rgba(32,32,38,0.08)" gap={18} size={1} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  )
}
