'use client'

import { memo } from 'react'
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import Image from 'next/image'
import { formatYear, getInitials } from '@/lib/utils'
import type { MemberNodeData } from '@/lib/tree-utils'

type MemberFlowNode = Node<MemberNodeData, 'memberNode'>

function MemberNodeComponent({ data, selected }: NodeProps<MemberFlowNode>) {
  const { member, branchColor } = data
  const initials = getInitials(member.fullName)
  const birthYear = member.birthDate ? formatYear(member.birthDate) : null
  const deathYear = member.deathDate ? formatYear(member.deathDate) : null

  return (
    <div
      className={`
        relative bg-white rounded-2xl border-2 shadow-sm transition-all duration-200 cursor-pointer
        w-[200px] overflow-hidden
        ${selected ? 'shadow-lg ring-2 ring-offset-2' : 'hover:shadow-md hover:-translate-y-0.5'}
      `}
      style={{
        borderColor: selected ? branchColor : '#E5E7EB',
        ...(selected && { '--tw-ring-color': branchColor } as React.CSSProperties),
      }}
    >
      {/* Top accent bar */}
      <div className="h-1.5 w-full" style={{ backgroundColor: branchColor }} />

      {/* Content */}
      <div className="p-3 flex items-center gap-3">
        {/* Avatar */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0 overflow-hidden relative"
          style={{ backgroundColor: branchColor }}
        >
          {member.photoUrl ? (
            <Image
              src={member.photoUrl}
              alt={member.fullName}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <span>{initials}</span>
          )}
          {member.isDeceased && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="text-[10px]">🤲</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {member.generationalTitle && (
            <p className="text-[10px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: branchColor }}>
              {member.generationalTitle}
            </p>
          )}
          <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
            {member.fullName}
          </p>
          {member.binBinti && (
            <p className="text-[10px] text-gray-400 truncate">
              {member.gender === 'FEMALE' ? 'binti' : 'bin'} {member.binBinti}
            </p>
          )}
          {(birthYear || deathYear) && (
            <p className="text-[10px] text-gray-400 mt-0.5">
              {birthYear}
              {deathYear && ` — ${deathYear}`}
            </p>
          )}
        </div>
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !border-2 !border-white" style={{ background: branchColor }} />
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !border-2 !border-white" style={{ background: branchColor }} />
      <Handle type="source" position={Position.Left} id="left" className="!w-3 !h-3 !border-2 !border-white" style={{ background: branchColor }} />
      <Handle type="target" position={Position.Right} id="right" className="!w-3 !h-3 !border-2 !border-white" style={{ background: branchColor }} />
    </div>
  )
}

export const MemberNode = memo(MemberNodeComponent)
