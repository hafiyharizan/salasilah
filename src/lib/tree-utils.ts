import type { Node, Edge } from '@xyflow/react'
import type { FamilyMember, Relationship } from '@prisma/client'
import { getBranchColor } from '@/lib/utils'

export interface MemberNodeData extends Record<string, unknown> {
  member: FamilyMember
  branchColor: string
}

// Node dimensions for layout
const NODE_WIDTH = 200
const NODE_HEIGHT = 100
const H_GAP = 60
const V_GAP = 120

/**
 * Transform Prisma FamilyMember[] + Relationship[] into React Flow nodes + edges.
 * Uses a simple generational layout algorithm.
 */
export function buildTreeData(
  members: FamilyMember[],
  relationships: Relationship[]
): { nodes: Node<MemberNodeData>[]; edges: Edge[] } {
  if (members.length === 0) return { nodes: [], edges: [] }

  // Build adjacency maps
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

  // Assign generations via BFS from root nodes (members with no parents)
  const memberIds = new Set(members.map((m) => m.id))
  const roots = members.filter((m) => {
    const parents = parentsOf.get(m.id) ?? []
    return parents.filter((p) => memberIds.has(p)).length === 0
  })

  const generationMap = new Map<string, number>()
  const queue: [string, number][] = roots.map((r) => [r.id, 0])
  const visited = new Set<string>()

  while (queue.length > 0) {
    const [id, gen] = queue.shift()!
    if (visited.has(id)) continue
    visited.add(id)
    generationMap.set(id, gen)
    const children = childrenOf.get(id) ?? []
    for (const childId of children) {
      if (!visited.has(childId)) {
        queue.push([childId, gen + 1])
      }
    }
    // Spouses share the same generation
    const spouses = spouseOf.get(id) ?? []
    for (const spouseId of spouses) {
      if (!visited.has(spouseId)) {
        queue.push([spouseId, gen])
      }
    }
  }

  // Any member not reached by BFS gets gen 0
  for (const m of members) {
    if (!generationMap.has(m.id)) {
      generationMap.set(m.id, 0)
    }
  }

  // Group members by generation
  const byGeneration = new Map<number, FamilyMember[]>()
  for (const m of members) {
    const gen = generationMap.get(m.id) ?? 0
    if (!byGeneration.has(gen)) byGeneration.set(gen, [])
    byGeneration.get(gen)!.push(m)
  }

  // Assign positions
  const positionMap = new Map<string, { x: number; y: number }>()
  const sortedGens = Array.from(byGeneration.keys()).sort((a, b) => a - b)

  for (const gen of sortedGens) {
    const genMembers = byGeneration.get(gen)!
    const totalWidth = genMembers.length * (NODE_WIDTH + H_GAP) - H_GAP
    let xOffset = -totalWidth / 2

    for (const member of genMembers) {
      positionMap.set(member.id, {
        x: xOffset,
        y: gen * (NODE_HEIGHT + V_GAP),
      })
      xOffset += NODE_WIDTH + H_GAP
    }
  }

  // Build React Flow nodes
  const nodes: Node<MemberNodeData>[] = members.map((member) => ({
    id: member.id,
    type: 'memberNode',
    position: positionMap.get(member.id) ?? { x: 0, y: 0 },
    data: {
      member,
      branchColor: getBranchColor(member.familyBranch),
    },
  }))

  // Deduplicate edges (only PARENT→CHILD and SPOUSE edges, skip SIBLING for cleaner tree)
  const edgeSet = new Set<string>()
  const edges: Edge[] = []

  for (const rel of relationships) {
    if (rel.type === 'SIBLING') continue // skip siblings — too cluttered

    const key = rel.type === 'SPOUSE'
      ? [rel.fromId, rel.toId].sort().join('-') + '-SPOUSE'
      : `${rel.fromId}-${rel.toId}-${rel.type}`

    if (edgeSet.has(key)) continue
    edgeSet.add(key)

    if (rel.type === 'SPOUSE') {
      edges.push({
        id: key,
        source: rel.fromId,
        target: rel.toId,
        type: 'straight',
        style: { stroke: '#D4A017', strokeWidth: 2, strokeDasharray: '6 3' },
        label: '♥',
        labelStyle: { fill: '#D4A017', fontWeight: 600, fontSize: 14 },
      })
    } else if (rel.type === 'PARENT') {
      edges.push({
        id: key,
        source: rel.fromId,
        target: rel.toId,
        type: 'smoothstep',
        style: { stroke: '#1B4332', strokeWidth: 2 },
      })
    }
  }

  return { nodes, edges }
}
