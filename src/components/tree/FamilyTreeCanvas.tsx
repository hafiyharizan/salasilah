'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { GitBranch, Heart, Plus, RotateCcw, Save, Users } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { MemberNode } from './MemberNode'
import type { MemberNodeData } from '@/lib/tree-utils'

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
  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const loadTree = useCallback(async () => {
    try {
      const res = await fetch(`/api/families/${familyId}/tree`)
      if (!res.ok) throw new Error('load-failed')
      const data = await res.json()
      setNodes(data.nodes)
      setEdges(data.edges)
      setIsDirty(false)
      setError(null)
    } catch {
      setError(t('errorLoad'))
    } finally {
      setLoading(false)
    }
  }, [familyId, setEdges, setNodes, t])

  useEffect(() => {
    loadTree()
  }, [loadTree])

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      router.push(`/family/${familyId}/members/${node.id}`)
    },
    [familyId, router]
  )

  const handleNodeDragStop = useCallback(() => {
    setIsDirty(true)
  }, [])

  const handleSaveLayout = useCallback(async () => {
    setIsSaving(true)

    try {
      const res = await fetch(`/api/families/${familyId}/tree`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodes: nodes.map((node) => ({
            id: node.id,
            position: node.position,
          })),
        }),
      })

      if (!res.ok) throw new Error('save-failed')

      setIsDirty(false)
      toast.success('Tree layout saved')
    } catch {
      toast.error('Unable to save tree layout')
    } finally {
      setIsSaving(false)
    }
  }, [familyId, nodes])

  const handleResetLayout = useCallback(async () => {
    setIsSaving(true)

    try {
      const res = await fetch(`/api/families/${familyId}/tree`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('reset-failed')

      setLoading(true)
      await loadTree()
      toast.success('Tree layout reset')
    } catch {
      setLoading(false)
      toast.error('Unable to reset tree layout')
    } finally {
      setIsSaving(false)
    }
  }, [familyId, loadTree])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,#f8fafc_0%,#eef4ef_45%,#ffffff_100%)]">
        <LoadingSpinner size="lg" label={t('loading')} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,#f8fafc_0%,#eef4ef_45%,#ffffff_100%)]">
        <EmptyState icon={GitBranch} title={t('errorTitle')} description={error} />
      </div>
    )
  }

  if (nodes.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,#f8fafc_0%,#eef4ef_45%,#ffffff_100%)]">
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
    <div className="h-full bg-[radial-gradient(circle_at_top,#f8fafc_0%,#eef4ef_42%,#ffffff_100%)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onNodeDragStop={handleNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.24 }}
        minZoom={0.2}
        maxZoom={1.8}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        attributionPosition="bottom-right"
        proOptions={{ hideAttribution: true }}
        className="[&_.react-flow__pane]:cursor-grab [&_.react-flow__pane]:active:cursor-grabbing [&_.react-flow__edge-path]:drop-shadow-[0_6px_12px_rgba(15,23,42,0.10)] [&_.react-flow__node.selected]:z-20"
      >
        <Background variant={BackgroundVariant.Dots} gap={28} size={1.2} color="#d8e4dc" />

        <Panel position="top-left">
          <div className="max-w-xs rounded-3xl border border-white/70 bg-white/88 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.10)] backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary-700">
              Family View
            </p>
            <h2 className="mt-2 text-base font-semibold text-slate-900">Trace generations at a glance</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Solid branches show lineage. Dashed gold links mark spouses. Tap any card to open the full profile.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <span className="h-0.5 w-10 rounded-full bg-primary-700" />
                Parent → Child (downward)
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <span className="h-0.5 w-8 border-t-2 border-dashed border-[#B8891E]" />
                  <Heart className="h-3 w-3 text-[#B8891E]" />
                </span>
                Spouse (side by side)
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-50 text-[10px] text-blue-500">♂</span>
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-pink-50 text-[10px] text-pink-500">♀</span>
                </span>
                Gender indicator
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-[10px]">🕊</span>
                Deceased
              </div>
            </div>
          </div>
        </Panel>

        <Panel position="top-right">
          <div className="rounded-3xl border border-white/70 bg-white/88 px-4 py-3 text-right shadow-[0_18px_40px_rgba(15,23,42,0.10)] backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">People shown</p>
            <div className="mt-2 flex items-center justify-end gap-2 text-slate-900">
              <Users className="h-4 w-4 text-primary-700" />
              <span className="text-lg font-semibold">{nodes.length}</span>
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleResetLayout}
                disabled={isSaving}
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSaveLayout}
                disabled={!isDirty || isSaving}
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save layout'}
              </Button>
            </div>
          </div>
        </Panel>

        <Controls
          showInteractive={false}
          className="!rounded-2xl !border !border-white/70 !bg-white/92 !shadow-[0_12px_30px_rgba(15,23,42,0.12)] backdrop-blur"
        />

        <MiniMap
          nodeColor={(node: Node<MemberNodeData>) => node.data?.branchColor ?? '#1B4332'}
          maskColor="rgba(241,245,249,0.72)"
          pannable
          zoomable
          className="!rounded-3xl !border !border-white/70 !bg-white/92 !shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur"
        />
      </ReactFlow>
    </div>
  )
}
