import type { FamilyMember } from '@prisma/client'

/**
 * Convert family members to CSV format
 */
export function membersToCSV(members: FamilyMember[]): string {
  const headers = [
    'Nama Penuh', 'Nama Panggilan', 'Bin/Binti', 'Jantina',
    'Tarikh Lahir', 'Tarikh Meninggal', 'Tempat Lahir',
    'Alamat Semasa', 'Negeri', 'Agama', 'Gelaran Keluarga',
    'Cawangan Keluarga', 'Pekerjaan', 'No. IC',
    'Emel', 'Telefon', 'Biografi'
  ]

  const rows = members.map((m) => [
    m.fullName,
    m.nickname ?? '',
    m.binBinti ?? '',
    m.gender === 'MALE' ? 'Lelaki' : 'Perempuan',
    m.birthDate ? new Date(m.birthDate).toLocaleDateString('ms-MY') : '',
    m.deathDate ? new Date(m.deathDate).toLocaleDateString('ms-MY') : '',
    m.placeOfBirth ?? '',
    m.currentAddress ?? '',
    m.negeri ?? '',
    m.religion,
    m.generationalTitle ?? '',
    m.familyBranch ?? '',
    m.occupation ?? '',
    m.icNumber ?? '',
    m.contactEmail ?? '',
    m.contactPhone ?? '',
    (m.biography ?? '').replace(/\n/g, ' '),
  ])

  const escape = (v: string) => {
    if (v.includes(',') || v.includes('"') || v.includes('\n')) {
      return `"${v.replace(/"/g, '""')}"`
    }
    return v
  }

  return [
    headers.join(','),
    ...rows.map((row) => row.map(escape).join(',')),
  ].join('\n')
}
