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
        relative bg-white rounded-2xl border-2 shadow-sm cursor-pointer
        w-[210px] overflow-hidden
        transition-all duration-300 ease-out
        ${selected
          ? 'shadow-xl ring-2 ring-offset-2 scale-[1.02]'
          : 'hover:shadow-lg hover:-translate-y-1 hover:scale-[1.01]'
        }
        ${member.isDeceased ? 'opacity-90' : ''}
      `}
      style={{
        borderColor: selected ? branchColor : '#E5E7EB',
        ...(selected && { '--tw-ring-color': branchColor } as React.CSSProperties),
      }}
    >
      {/* Top accent bar with gradient */}
      <div
        className="h-1.5 w-full"
        style={{
          background: `linear-gradient(90deg, ${branchColor}, ${branchColor}88, ${branchColor})`,
        }}
      />

      {/* Content */}
      <div className="p-3 flex items-center gap-3">
        {/* Avatar with ring */}
        <div className="relative shrink-0">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm overflow-hidden relative ring-2 ring-offset-1"
            style={{
              backgroundColor: branchColor,
              '--tw-ring-color': `${branchColor}30`,
            } as React.CSSProperties}
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
              <span className="font-display">{initials}</span>
            )}
          </div>
          {member.isDeceased && (
            <div
              className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100"
              title="Al-Fatihah"
            >
              <span className="text-[9px]">🤲</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {member.generationalTitle && (
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-0.5"
              style={{ color: branchColor }}
            >
              {member.generationalTitle}
            </p>
          )}
          <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
            {member.fullName}
          </p>
          {member.binBinti && (
            <p className="text-[10px] text-gray-400 truncate mt-0.5">
              {member.gender === 'FEMALE' ? 'binti' : 'bin'} {member.binBinti}
            </p>
          )}
          {(birthYear || deathYear) && (
            <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full" style={{ backgroundColor: branchColor }} />
              {birthYear}
              {deathYear && ` — ${deathYear}`}
            </p>
          )}
        </div>
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Top} className="!w-2.5 !h-2.5 !border-2 !border-white !shadow-sm" style={{ background: branchColor }} />
      <Handle type="source" position={Position.Bottom} className="!w-2.5 !h-2.5 !border-2 !border-white !shadow-sm" style={{ background: branchColor }} />
      <Handle type="source" position={Position.Left} id="left" className="!w-2.5 !h-2.5 !border-2 !border-white !shadow-sm" style={{ background: branchColor }} />
      <Handle type="target" position={Position.Right} id="right" className="!w-2.5 !h-2.5 !border-2 !border-white !shadow-sm" style={{ background: branchColor }} />
    </div>
  )
}

export const MemberNode = memo(MemberNodeComponent)
