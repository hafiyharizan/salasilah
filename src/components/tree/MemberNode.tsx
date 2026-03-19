'use client'

import { memo, type CSSProperties } from 'react'
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import Image from 'next/image'
import { CalendarDays, Sparkles } from 'lucide-react'
import { formatYear, getInitials } from '@/lib/utils'
import type { MemberNodeData } from '@/lib/tree-utils'

type MemberFlowNode = Node<MemberNodeData, 'memberNode'>

// Gender accent colors — subtle, tasteful, consistent with premium feel
const GENDER_STYLES = {
  MALE: {
    borderAccent: '#3B82F6',   // blue-500
    bgTint: 'rgba(59,130,246,0.04)',
    iconBg: 'rgba(59,130,246,0.10)',
    iconColor: '#3B82F6',
    icon: '♂',
  },
  FEMALE: {
    borderAccent: '#EC4899',   // pink-500
    bgTint: 'rgba(236,72,153,0.04)',
    iconBg: 'rgba(236,72,153,0.10)',
    iconColor: '#EC4899',
    icon: '♀',
  },
  NEUTRAL: {
    borderAccent: '#94A3B8',   // slate-400
    bgTint: 'transparent',
    iconBg: 'rgba(148,163,184,0.10)',
    iconColor: '#94A3B8',
    icon: '⚬',
  },
} as const

function MemberNodeComponent({ data, selected }: NodeProps<MemberFlowNode>) {
  const { member, branchColor } = data
  const initials = getInitials(member.fullName)
  const birthYear = member.birthDate ? formatYear(member.birthDate) : null
  const deathYear = member.deathDate ? formatYear(member.deathDate) : null
  const yearsLabel = birthYear && deathYear ? `${birthYear} - ${deathYear}` : birthYear ?? deathYear
  const branchLabel = member.familyBranch?.replace(/_/g, ' ') ?? 'Family branch'

  const gender = GENDER_STYLES[member.gender as keyof typeof GENDER_STYLES] ?? GENDER_STYLES.NEUTRAL

  return (
    <div
      className={[
        'group relative w-[240px] overflow-hidden rounded-[28px] bg-white/95 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur transition-all duration-300',
        selected
          ? 'ring-4 ring-offset-4'
          : 'hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(15,23,42,0.14)]',
      ].join(' ')}
      style={{
        // Subtle gender-coloured left border + top border accent
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: `${gender.borderAccent}30`,
        borderLeftColor: gender.borderAccent,
        borderLeftWidth: '4px',
        backgroundColor: gender.bgTint,
        ...(selected && { '--tw-ring-color': `${branchColor}40` } as CSSProperties),
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-20 opacity-90"
        style={{
          background: `linear-gradient(135deg, ${branchColor} 0%, ${branchColor}CC 48%, rgba(255,255,255,0.92) 100%)`,
        }}
      />

      <div className="relative p-4">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-md"
              style={{ boxShadow: `0 14px 28px ${branchColor}26` }}
            >
              {member.photoUrl ? (
                <Image
                  src={member.photoUrl}
                  alt={member.fullName}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-base font-bold text-white"
                  style={{ backgroundColor: branchColor }}
                >
                  {initials}
                </div>
              )}
              {member.isDeceased && (
                <div className="absolute inset-0 bg-slate-900/35" />
              )}
            </div>

            <div className="min-w-0 pt-1">
              <div
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
                style={{
                  backgroundColor: `${branchColor}18`,
                  color: branchColor,
                }}
              >
                <Sparkles className="h-3 w-3" />
                {member.generationalTitle || branchLabel}
              </div>
              <p className="mt-2 line-clamp-2 text-[17px] font-semibold leading-tight text-slate-900">
                {member.fullName}
              </p>
            </div>
          </div>

          {/* Gender indicator + deceased icon (replaces "In memoriam" pill) */}
          <div className="flex flex-col items-center gap-1.5 shrink-0 pt-0.5">
            {/* Gender badge */}
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium"
              style={{ backgroundColor: gender.iconBg, color: gender.iconColor }}
              title={member.gender === 'MALE' ? 'Male' : member.gender === 'FEMALE' ? 'Female' : 'Unknown'}
              aria-label={member.gender === 'MALE' ? 'Male' : member.gender === 'FEMALE' ? 'Female' : 'Gender not set'}
            >
              {gender.icon}
            </span>

            {/* Deceased icon — subtle dove/prayer icon instead of text pill */}
            {member.isDeceased && (
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-sm"
                title="Al-Fatihah (Deceased)"
                aria-label="Deceased"
              >
                🕊
              </span>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-3">
          {member.binBinti && (
            <p className="text-[11px] font-medium text-slate-500">
              {member.gender === 'FEMALE' ? 'Binti' : 'Bin'} {member.binBinti}
            </p>
          )}

          {yearsLabel && (
            <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>{yearsLabel}</span>
            </div>
          )}

          {!member.binBinti && !yearsLabel && (
            <p className="text-[11px] text-slate-400">Tap to view this family member</p>
          )}
        </div>
      </div>

      {/* Handles for edges */}
      <Handle
        type="target"
        position={Position.Top}
        className="!h-4 !w-4 !border-[3px] !border-white !shadow-sm"
        style={{ background: branchColor, top: -8 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-4 !w-4 !border-[3px] !border-white !shadow-sm"
        style={{ background: branchColor, bottom: -8 }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className="!h-3.5 !w-3.5 !border-2 !border-white !shadow-sm"
        style={{ background: branchColor, left: -7 }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right"
        className="!h-3.5 !w-3.5 !border-2 !border-white !shadow-sm"
        style={{ background: branchColor, right: -7 }}
      />
    </div>
  )
}

export const MemberNode = memo(MemberNodeComponent)
