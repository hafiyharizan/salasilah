'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type Node,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { MemberNode } from './MemberNode'
import type { MemberNodeData } from '@/lib/tree-utils'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { FamilyTreeIllustration } from '@/components/shared/EmptyStateIllustration'
import { GitBranch, Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const nodeTypes = { memberNode: MemberNode }

interface FamilyTreeCanvasProps {
  familyId: string
}

export function FamilyTreeCanvas({ familyId }: FamilyTreeCanvasProps) {
  const router = useRouter()
  const t = useTranslations('tree')
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<MemberNodeData>>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadTree() {
      try {
        const res = await fetch(`/api/families/${familyId}/tree`)
        if (!res.ok) throw new Error('load-failed')
        const data = await res.json()
        setNodes(data.nodes)
        setEdges(data.edges)
      } catch {
        setError(t('errorLoad'))
      } finally {
        setLoading(false)
      }
    }
    loadTree()
  }, [familyId, t])

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      router.push(`/family/${familyId}/members/${node.id}`)
    },
    [familyId, router]
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-b from-surface to-white">
        <LoadingSpinner size="lg" label={t('loading')} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-b from-surface to-white">
        <EmptyState icon={GitBranch} title={t('errorTitle')} description={error} />
      </div>
    )
  }

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-b from-surface to-white heritage-pattern">
        <EmptyState
          title={t('empty')}
          description={t('emptyDesc')}
          illustration={<FamilyTreeIllustration className="w-52 h-52" />}
          action={
            <Link href={`/family/${familyId}/members/new`}>
              <Button className="shadow-md shadow-primary-500/20">
                <Plus className="w-4 h-4" />
                {t('addFirstMember')}
              </Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.3 }}
      minZoom={0.2}
      maxZoom={2}
      attributionPosition="bottom-right"
      proOptions={{ hideAttribution: true }}
      defaultEdgeOptions={{
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#C6E8D4', strokeWidth: 2 },
      }}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={24}
        size={1}
        color="#d4d8dc"
        className="!bg-gradient-to-b from-surface to-white"
      />
      <Controls
        showInteractive={false}
        className="!rounded-xl !border-gray-200 !shadow-md !bg-white/90 !backdrop-blur-sm"
      />
      <MiniMap
        nodeColor={(node: Node<MemberNodeData>) => node.data?.branchColor ?? '#1B4332'}
        className="!rounded-xl !border-gray-200 !shadow-md !bg-white/90 !backdrop-blur-sm"
        zoomable
        pannable
        maskColor="rgba(248, 247, 244, 0.7)"
      />
    </ReactFlow>
  )
}
