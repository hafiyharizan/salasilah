import { MarkerType, type Edge, type Node } from '@xyflow/react'
import type { FamilyMember, Relationship } from '@prisma/client'
import { getBranchColor } from '@/lib/utils'

export interface MemberNodeData extends Record<string, unknown> {
  member: FamilyMember
  branchColor: string
}

export interface SavedTreePosition {
  x: number
  y: number
}

const NODE_WIDTH = 240
const NODE_HEIGHT = 144
const SPOUSE_GAP = 40        // tight horizontal gap between spouses
const H_GAP = 96             // gap between family units
const V_GAP = 168            // vertical gap between generations

export function buildTreeData(
  members: FamilyMember[],
  relationships: Relationship[],
  savedPositions?: Record<string, SavedTreePosition>
): { nodes: Node<MemberNodeData>[]; edges: Edge[] } {
  if (members.length === 0) return { nodes: [], edges: [] }

  // ── Build adjacency maps ──────────────────────────────────────────
  const childrenOf = new Map<string, string[]>()
  const parentsOf = new Map<string, string[]>()
  const spouseOf = new Map<string, Set<string>>()

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
      if (!spouseOf.has(rel.fromId)) spouseOf.set(rel.fromId, new Set())
      spouseOf.get(rel.fromId)!.add(rel.toId)
    }
  }

  const memberIds = new Set(members.map((m) => m.id))

  // ── Determine roots (members with no parents in this family) ──────
  const roots = members.filter((m) => {
    const parents = parentsOf.get(m.id) ?? []
    return parents.filter((pid) => memberIds.has(pid)).length === 0
  })

  // ── Assign generations via BFS ────────────────────────────────────
  const generationMap = new Map<string, number>()
  const queue: [string, number][] = roots.map((r) => [r.id, 0])
  const visited = new Set<string>()

  while (queue.length > 0) {
    const [id, gen] = queue.shift()!
    if (visited.has(id)) continue
    visited.add(id)
    generationMap.set(id, gen)

    // Children go one generation down
    for (const childId of childrenOf.get(id) ?? []) {
      if (!visited.has(childId)) queue.push([childId, gen + 1])
    }
    // Spouses share the same generation
    for (const spouseId of spouseOf.get(id) ?? []) {
      if (!visited.has(spouseId)) queue.push([spouseId, gen])
    }
  }

  // Assign unvisited members to generation 0
  for (const m of members) {
    if (!generationMap.has(m.id)) generationMap.set(m.id, 0)
  }

  // ── Group into spouse pairs / singles per generation ──────────────
  // A "unit" is either a spouse pair or a single member
  interface FamilyUnit {
    primary: FamilyMember
    spouse?: FamilyMember
  }

  const memberById = new Map(members.map((m) => [m.id, m]))
  const assigned = new Set<string>()
  const byGeneration = new Map<number, FamilyUnit[]>()

  // Sort members by generation, then process
  const sortedMembers = [...members].sort((a, b) => {
    const ga = generationMap.get(a.id) ?? 0
    const gb = generationMap.get(b.id) ?? 0
    return ga - gb
  })

  for (const m of sortedMembers) {
    if (assigned.has(m.id)) continue
    assigned.add(m.id)

    const gen = generationMap.get(m.id) ?? 0
    if (!byGeneration.has(gen)) byGeneration.set(gen, [])

    // Find first unassigned spouse at same generation
    const spouseIds = spouseOf.get(m.id) ?? new Set()
    let spouseMember: FamilyMember | undefined
    for (const sid of spouseIds) {
      if (!assigned.has(sid) && generationMap.get(sid) === gen) {
        spouseMember = memberById.get(sid)
        if (spouseMember) {
          assigned.add(sid)
          break
        }
      }
    }

    byGeneration.get(gen)!.push({ primary: m, spouse: spouseMember })
  }

  // ── Position units: spouses side-by-side, generations top-to-bottom
  const positionMap = new Map<string, { x: number; y: number }>()
  const sortedGens = Array.from(byGeneration.keys()).sort((a, b) => a - b)

  for (const gen of sortedGens) {
    const units = byGeneration.get(gen)!

    // Calculate total width of this generation
    let totalWidth = 0
    for (const unit of units) {
      if (unit.spouse) {
        totalWidth += NODE_WIDTH * 2 + SPOUSE_GAP
      } else {
        totalWidth += NODE_WIDTH
      }
    }
    totalWidth += (units.length - 1) * H_GAP

    let xOffset = -totalWidth / 2
    const yPos = gen * (NODE_HEIGHT + V_GAP)

    for (const unit of units) {
      if (unit.spouse) {
        // Place primary on left, spouse on right, side by side
        positionMap.set(unit.primary.id, { x: xOffset, y: yPos })
        positionMap.set(unit.spouse.id, { x: xOffset + NODE_WIDTH + SPOUSE_GAP, y: yPos })
        xOffset += NODE_WIDTH * 2 + SPOUSE_GAP + H_GAP
      } else {
        positionMap.set(unit.primary.id, { x: xOffset, y: yPos })
        xOffset += NODE_WIDTH + H_GAP
      }
    }
  }

  // ── Build nodes ───────────────────────────────────────────────────
  const nodes: Node<MemberNodeData>[] = members.map((m) => ({
    id: m.id,
    type: 'memberNode',
    position: savedPositions?.[m.id] ?? positionMap.get(m.id) ?? { x: 0, y: 0 },
    data: {
      member: m,
      branchColor: getBranchColor(m.familyBranch),
    },
  }))

  // ── Build edges ───────────────────────────────────────────────────
  const edgeSet = new Set<string>()
  const edges: Edge[] = []

  for (const rel of relationships) {
    if (rel.type === 'SIBLING') continue

    // For SPOUSE edges, use sorted key to deduplicate bidirectional pairs
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
        sourceHandle: 'left',
        targetHandle: 'right',
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
        labelBgPadding: [8, 4] as [number, number],
        labelBgBorderRadius: 999,
        data: { relationship: 'spouse' },
      })
      continue
    }

    // PARENT relationship: from child → pointing to parent
    // We want parent→child downward edges, so render as parent (target) → child (source)
    // Actually PARENT means: fromId has PARENT toId, i.e., fromId's parent IS toId
    // So for a downward edge: source=toId (parent), target=fromId (child)
    if (rel.type === 'PARENT') {
      // Deduplicate: only create edge once per parent-child pair
      const parentChildKey = `${rel.toId}-${rel.fromId}-PARENT_EDGE`
      if (edgeSet.has(parentChildKey)) continue
      edgeSet.add(parentChildKey)

      const parentMember = memberById.get(rel.toId)
      const stroke = getBranchColor(parentMember?.familyBranch ?? null)

      edges.push({
        id: key,
        source: rel.toId,    // parent at top
        target: rel.fromId,   // child at bottom
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
        data: { relationship: 'parent-child' },
      })
    }
  }

  return { nodes, edges }
}
