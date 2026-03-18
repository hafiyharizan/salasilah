'use client'

import dynamic from 'next/dynamic'

export interface MapMember {
  id: string
  fullName: string
  negeri: string | null
  currentAddress: string | null
  photoUrl: string | null
  familyBranch: string | null
  isDeceased: boolean
}

interface FamilyMapProps {
  members: MapMember[]
  familyId: string
}

const LeafletFamilyMap = dynamic(() => import('./FamilyLeafletMap').then((mod) => mod.FamilyLeafletMap), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] rounded-xl bg-gray-100 flex items-center justify-center">
      <div className="text-center text-gray-500">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm">Loading map...</p>
      </div>
    </div>
  ),
})

export function FamilyMap({ members, familyId }: FamilyMapProps) {
  return <LeafletFamilyMap members={members} familyId={familyId} />
}
