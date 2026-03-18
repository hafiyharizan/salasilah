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
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" label={t('loading')} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <EmptyState icon={GitBranch} title={t('errorTitle')} description={error} />
      </div>
    )
  }

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <EmptyState
          icon={GitBranch}
          title={t('empty')}
          description={t('emptyDesc')}
          action={
            <Link href={`/family/${familyId}/members/new`}>
              <Button>
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
      fitViewOptions={{ padding: 0.2 }}
      minZoom={0.2}
      maxZoom={2}
      attributionPosition="bottom-right"
      proOptions={{ hideAttribution: true }}
    >
      <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e5e7eb" />
      <Controls
        showInteractive={false}
        className="!rounded-xl !border-gray-200 !shadow-sm"
      />
      <MiniMap
        nodeColor={(node: Node<MemberNodeData>) => node.data?.branchColor ?? '#1B4332'}
        className="!rounded-xl !border-gray-200 !shadow-sm"
        zoomable
        pannable
      />
    </ReactFlow>
  )
}
