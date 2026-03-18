'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { NEGERI_COORDS, MALAYSIA_CENTER, MALAYSIA_ZOOM } from '@/lib/malaysia-geo'
import { getBranchColor, getInitials } from '@/lib/utils'
import type { MapMember } from './FamilyMap'

interface FamilyLeafletMapProps {
  members: MapMember[]
  familyId: string
}

export function FamilyLeafletMap({ members, familyId }: FamilyLeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const membersByState = members.reduce<Record<string, MapMember[]>>((acc, member) => {
    if (member.negeri && NEGERI_COORDS[member.negeri]) {
      if (!acc[member.negeri]) acc[member.negeri] = []
      acc[member.negeri].push(member)
    }

    return acc
  }, {})

  const locatedCount = Object.values(membersByState).reduce((sum, stateMembers) => sum + stateMembers.length, 0)

  useEffect(() => {
    const container = containerRef.current as (HTMLDivElement & { _leaflet_id?: number }) | null
    if (!container) return

    delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    })

    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }

    if (container._leaflet_id) {
      delete container._leaflet_id
    }

    const map = L.map(container, {
      center: MALAYSIA_CENTER,
      zoom: MALAYSIA_ZOOM,
      scrollWheelZoom: true,
    })

    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map)

    Object.entries(membersByState).forEach(([negeri, stateMembers]) => {
      const marker = L.marker(NEGERI_COORDS[negeri], {
        icon: createIcon(getBranchColor(stateMembers[0].familyBranch)),
      })

      marker.bindPopup(buildPopupContent(negeri, stateMembers, familyId))
      marker.addTo(map)
    })

    return () => {
      map.remove()
      mapRef.current = null

      if (container._leaflet_id) {
        delete container._leaflet_id
      }
    }
  }, [familyId, membersByState])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 text-primary-700 rounded-full font-medium">
          {locatedCount} / {members.length} members with location data
        </span>
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
        <div ref={containerRef} style={{ height: '500px', width: '100%' }} />
      </div>

      {Object.keys(membersByState).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(membersByState).map(([negeri, stateMembers]) => (
            <span
              key={negeri}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: getBranchColor(stateMembers[0].familyBranch) }}
              />
              {negeri} ({stateMembers.length})
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function createIcon(color: string) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background:${color};width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })
}

function buildPopupContent(negeri: string, stateMembers: MapMember[], familyId: string) {
  const wrapper = document.createElement('div')
  wrapper.className = 'min-w-[180px]'

  const heading = document.createElement('h3')
  heading.className = 'font-semibold text-gray-900 text-sm mb-2 border-b pb-1'
  heading.textContent = `${negeri} (${stateMembers.length})`
  wrapper.appendChild(heading)

  const list = document.createElement('ul')
  list.className = 'space-y-1.5 max-h-[200px] overflow-y-auto'

  stateMembers.forEach((member) => {
    const item = document.createElement('li')
    const link = document.createElement('a')
    link.href = `/family/${familyId}/members/${member.id}`
    link.className = 'flex items-center gap-2 text-xs hover:text-primary-600 transition-colors'

    if (member.photoUrl) {
      const image = document.createElement('img')
      image.src = member.photoUrl
      image.alt = ''
      image.className = 'w-5 h-5 rounded-full object-cover'
      link.appendChild(image)
    } else {
      const initials = document.createElement('span')
      initials.className = 'w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold'
      initials.style.backgroundColor = getBranchColor(member.familyBranch)
      initials.textContent = getInitials(member.fullName)
      link.appendChild(initials)
    }

    const name = document.createElement('span')
    name.className = 'truncate'
    name.textContent = member.isDeceased ? `${member.fullName} (deceased)` : member.fullName
    link.appendChild(name)

    if (member.currentAddress) {
      const address = document.createElement('span')
      address.className = 'text-gray-400 truncate ml-auto'
      address.textContent = member.currentAddress
      link.appendChild(address)
    }

    item.appendChild(link)
    list.appendChild(item)
  })

  wrapper.appendChild(list)
  return wrapper
}
