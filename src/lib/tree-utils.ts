import { MarkerType, type Edge, type Node } from '@xyflow/react'
import type { FamilyMember, Relationship } from '@prisma/client'
import { getBranchColor } from '@/lib/utils'

export interface MemberNodeData extends Record<string, unknown> {
  member: FamilyMember
  branchColor: string
}

const NODE_WIDTH = 240
const NODE_HEIGHT = 144
const H_GAP = 96
const V_GAP = 168

export function buildTreeData(
  members: FamilyMember[],
  relationships: Relationship[]
): { nodes: Node<MemberNodeData>[]; edges: Edge[] } {
  if (members.length === 0) return { nodes: [], edges: [] }

  const childrenOf = new Map<string, string[]>()
  const parentsOf = new Map<string, string[]>()
  const spouseOf = new Map<string, string[]>()

  for (const rel of relationships) {
    if (rel.type === 'CHILD') {
      if (!childrenOf.has(rel.fromId)) childrenOf.set(rel.fromId, [])
      childrenOf.get(rel.fromId)!.push(rel.toId)
    }

    if (rel.type === 'PARENT') {
      if (!parentsOf.has(rel.fromId)) parentsOf.set(rel.fromId, [])
      parentsOf.get(rel.fromId)!.push(rel.toId)
    }

    if (rel.type === 'SPOUSE') {
      if (!spouseOf.has(rel.fromId)) spouseOf.set(rel.fromId, [])
      spouseOf.get(rel.fromId)!.push(rel.toId)
    }
  }

  const memberIds = new Set(members.map((member) => member.id))
  const roots = members.filter((member) => {
    const parents = parentsOf.get(member.id) ?? []
    return parents.filter((parentId) => memberIds.has(parentId)).length === 0
  })

  const generationMap = new Map<string, number>()
  const queue: [string, number][] = roots.map((root) => [root.id, 0])
  const visited = new Set<string>()

  while (queue.length > 0) {
    const [id, generation] = queue.shift()!
    if (visited.has(id)) continue

    visited.add(id)
    generationMap.set(id, generation)

    for (const childId of childrenOf.get(id) ?? []) {
      if (!visited.has(childId)) {
        queue.push([childId, generation + 1])
      }
    }

    for (const spouseId of spouseOf.get(id) ?? []) {
      if (!visited.has(spouseId)) {
        queue.push([spouseId, generation])
      }
    }
  }

  for (const member of members) {
    if (!generationMap.has(member.id)) {
      generationMap.set(member.id, 0)
    }
  }

  const byGeneration = new Map<number, FamilyMember[]>()
  for (const member of members) {
    const generation = generationMap.get(member.id) ?? 0
    if (!byGeneration.has(generation)) byGeneration.set(generation, [])
    byGeneration.get(generation)!.push(member)
  }

  const positionMap = new Map<string, { x: number; y: number }>()
  const sortedGenerations = Array.from(byGeneration.keys()).sort((a, b) => a - b)

  for (const generation of sortedGenerations) {
    const generationMembers = byGeneration.get(generation)!
    const totalWidth = generationMembers.length * (NODE_WIDTH + H_GAP) - H_GAP
    let xOffset = -totalWidth / 2

    for (const member of generationMembers) {
      positionMap.set(member.id, {
        x: xOffset,
        y: generation * (NODE_HEIGHT + V_GAP),
      })
      xOffset += NODE_WIDTH + H_GAP
    }
  }

  const nodes: Node<MemberNodeData>[] = members.map((member) => ({
    id: member.id,
    type: 'memberNode',
    position: positionMap.get(member.id) ?? { x: 0, y: 0 },
    data: {
      member,
      branchColor: getBranchColor(member.familyBranch),
    },
  }))

  const edgeSet = new Set<string>()
  const memberById = new Map(members.map((member) => [member.id, member]))
  const edges: Edge[] = []

  for (const rel of relationships) {
    if (rel.type === 'SIBLING') continue

    const key = rel.type === 'SPOUSE'
      ? [rel.fromId, rel.toId].sort().join('-') + '-SPOUSE'
      : `${rel.fromId}-${rel.toId}-${rel.type}`

    if (edgeSet.has(key)) continue
    edgeSet.add(key)

    if (rel.type === 'SPOUSE') {
      const spouseColor = '#B8891E'

      edges.push({
        id: key,
        source: rel.fromId,
        target: rel.toId,
        type: 'bezier',
        style: {
          stroke: spouseColor,
          strokeWidth: 2.5,
          strokeDasharray: '8 6',
        },
        label: '♥',
        labelStyle: {
          fill: spouseColor,
          fontWeight: 700,
          fontSize: 14,
        },
        labelBgStyle: {
          fill: '#FFFBEB',
          fillOpacity: 0.96,
          stroke: '#F3E5AB',
          strokeWidth: 1,
        },
        labelBgPadding: [8, 4],
        labelBgBorderRadius: 999,
        data: { relationship: 'spouse' },
      })
      continue
    }

    if (rel.type === 'PARENT') {
      const sourceMember = memberById.get(rel.fromId)
      const stroke = getBranchColor(sourceMember?.familyBranch ?? null)

      edges.push({
        id: key,
        source: rel.fromId,
        target: rel.toId,
        type: 'smoothstep',
        style: {
          stroke,
          strokeWidth: 3,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: stroke,
          width: 18,
          height: 18,
        },
        data: { relationship: 'parent' },
      })
    }
  }

  return { nodes, edges }
}
