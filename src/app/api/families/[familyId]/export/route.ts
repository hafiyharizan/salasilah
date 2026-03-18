import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Papa from 'papaparse'

type FamilyRouteContext = {
  params: Promise<{ familyId: string }>
}

// GET /api/families/[familyId]/export?format=csv
export async function GET(request: NextRequest, context: FamilyRouteContext) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { familyId } = await context.params

  const family = await prisma.family.findFirst({
    where: { id: familyId, ownerId: session.user.id },
  })
  if (!family) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format') ?? 'csv'

  const members = await prisma.familyMember.findMany({
    where: { familyId },
    orderBy: [{ birthDate: 'asc' }, { fullName: 'asc' }],
  })

  if (format === 'csv') {
    const csvData = members.map((m) => ({
      'Nama Penuh': m.fullName,
      'Nama Panggilan': m.nickname ?? '',
      'Bin/Binti': m.binBinti ?? '',
      'Jantina': m.gender === 'MALE' ? 'Lelaki' : 'Perempuan',
      'Tarikh Lahir': m.birthDate ? new Date(m.birthDate).toLocaleDateString('ms-MY') : '',
      'Tarikh Meninggal': m.deathDate ? new Date(m.deathDate).toLocaleDateString('ms-MY') : '',
      'Tempat Lahir': m.placeOfBirth ?? '',
      'Alamat Semasa': m.currentAddress ?? '',
      'Negeri': m.negeri ?? '',
      'Agama': m.religion,
      'Gelaran Keluarga': m.generationalTitle ?? '',
      'Cawangan Keluarga': m.familyBranch ?? '',
      'Pekerjaan': m.occupation ?? '',
      'No. IC': m.icNumber ?? '',
      'Emel': m.contactEmail ?? '',
      'Telefon': m.contactPhone ?? '',
      'Biografi': m.biography ?? '',
    }))

    const csv = Papa.unparse(csvData, { delimiter: ',', header: true })

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="salasilah-${family.name.replace(/\s+/g, '-')}.csv"`,
      },
    })
  }

  return NextResponse.json({ error: 'Format tidak disokong. Gunakan format=csv' }, { status: 400 })
}
