import { PrismaClient, Gender, Religion, RelationshipType, FamilyRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Salasilah database...')

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo1234', 10)
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@salasilah.my' },
    update: {},
    create: {
      email: 'demo@salasilah.my',
      name: 'Ahmad Fadzillah',
      password: hashedPassword,
    },
  })

  console.log('✅ Created demo user:', demoUser.email)

  // Create family
  const family = await prisma.family.upsert({
    where: { id: 'family-demo-001' },
    update: {},
    create: {
      id: 'family-demo-001',
      name: 'Keluarga Haji Ahmad bin Ibrahim',
      description: 'Salasilah keluarga dari Kampung Baru, Kota Bharu, Kelantan',
      ownerId: demoUser.id,
    },
  })

  console.log('✅ Created family:', family.name)

  // ── Generation 1: Grandparents ──────────────────────────────────
  const tok = await prisma.familyMember.create({
    data: {
      id: 'member-tok-001',
      familyId: family.id,
      fullName: 'Ahmad bin Ibrahim',
      nickname: 'Tok Ahmad',
      gender: Gender.MALE,
      birthDate: new Date('1930-03-15'),
      deathDate: new Date('2008-11-20'),
      isDeceased: true,
      placeOfBirth: 'Kampung Baru, Kota Bharu, Kelantan',
      currentAddress: 'Kampung Baru',
      negeri: 'Kelantan',
      binBinti: 'bin Ibrahim',
      religion: Religion.ISLAM,
      generationalTitle: 'Tok',
      familyBranch: 'Asal',
      occupation: 'Petani & Guru Mengaji',
      biography: 'Tok Ahmad adalah pengasas keluarga kami. Beliau merupakan seorang petani yang tekun dan guru mengaji yang dihormati di kampung. Beliau sangat mementingkan pendidikan agama dan ilmu pengetahuan untuk anak-cucunya.',
      role: FamilyRole.VIEWER,
    },
  })

  const wan = await prisma.familyMember.create({
    data: {
      id: 'member-wan-001',
      familyId: family.id,
      fullName: 'Siti binti Yusof',
      nickname: 'Wan Siti',
      gender: Gender.FEMALE,
      birthDate: new Date('1935-07-22'),
      deathDate: new Date('2015-04-05'),
      isDeceased: true,
      placeOfBirth: 'Pasir Mas, Kelantan',
      currentAddress: 'Pasir Mas',
      negeri: 'Kelantan',
      binBinti: 'binti Yusof',
      religion: Religion.ISLAM,
      generationalTitle: 'Wan',
      familyBranch: 'Asal',
      occupation: 'Suri Rumah',
      biography: 'Wan Siti adalah tulang belakang keluarga. Beliau terkenal dengan masakan tradisional Kelantan yang lazat, terutama nasi kerabu dan ayam percik.',
      role: FamilyRole.VIEWER,
    },
  })

  // ── Generation 2: Children ──────────────────────────────────────
  const pakLong = await prisma.familyMember.create({
    data: {
      id: 'member-paklong-001',
      familyId: family.id,
      fullName: 'Mohd Fauzi bin Ahmad',
      nickname: 'Pak Long',
      gender: Gender.MALE,
      birthDate: new Date('1958-01-10'),
      placeOfBirth: 'Kota Bharu, Kelantan',
      currentAddress: 'Kampung Baru',
      negeri: 'Kelantan',
      binBinti: 'bin Ahmad',
      religion: Religion.ISLAM,
      generationalTitle: 'Pak Long',
      familyBranch: 'Cawangan Pak Long',
      occupation: 'Penjawat Awam (Bersara)',
      role: FamilyRole.VIEWER,
    },
  })

  const makLongSpouse = await prisma.familyMember.create({
    data: {
      id: 'member-maklong-001',
      familyId: family.id,
      fullName: 'Rohani binti Hassan',
      nickname: 'Mak Long',
      gender: Gender.FEMALE,
      birthDate: new Date('1960-05-18'),
      placeOfBirth: 'Kuala Terengganu, Terengganu',
      currentAddress: 'Kuala Terengganu',
      negeri: 'Terengganu',
      binBinti: 'binti Hassan',
      religion: Religion.ISLAM,
      generationalTitle: 'Mak Long',
      familyBranch: 'Cawangan Pak Long',
      occupation: 'Guru Sekolah Rendah',
      role: FamilyRole.VIEWER,
    },
  })

  const pakNgah = await prisma.familyMember.create({
    data: {
      id: 'member-pakngah-001',
      familyId: family.id,
      fullName: 'Mohd Razif bin Ahmad',
      nickname: 'Pak Ngah',
      gender: Gender.MALE,
      birthDate: new Date('1961-09-25'),
      placeOfBirth: 'Kota Bharu, Kelantan',
      currentAddress: 'Kampung Baru',
      negeri: 'Kelantan',
      binBinti: 'bin Ahmad',
      religion: Religion.ISLAM,
      generationalTitle: 'Pak Ngah',
      familyBranch: 'Cawangan Pak Ngah',
      occupation: 'Doktor Perubatan',
      role: FamilyRole.EDITOR,
      userId: demoUser.id,
    },
  })

  const makNgahSpouse = await prisma.familyMember.create({
    data: {
      id: 'member-makngah-001',
      familyId: family.id,
      fullName: 'Faridah binti Osman',
      nickname: 'Mak Ngah',
      gender: Gender.FEMALE,
      birthDate: new Date('1963-12-03'),
      placeOfBirth: 'Petaling Jaya, Selangor',
      currentAddress: 'Petaling Jaya',
      negeri: 'Selangor',
      binBinti: 'binti Osman',
      religion: Religion.ISLAM,
      generationalTitle: 'Mak Ngah',
      familyBranch: 'Cawangan Pak Ngah',
      occupation: 'Jururawat',
      role: FamilyRole.VIEWER,
    },
  })

  const makTeh = await prisma.familyMember.create({
    data: {
      id: 'member-makteh-001',
      familyId: family.id,
      fullName: 'Norhasimah binti Ahmad',
      nickname: 'Mak Teh',
      gender: Gender.FEMALE,
      birthDate: new Date('1965-04-14'),
      placeOfBirth: 'Kota Bharu, Kelantan',
      currentAddress: 'Kampung Baru',
      negeri: 'Kelantan',
      binBinti: 'binti Ahmad',
      religion: Religion.ISLAM,
      generationalTitle: 'Mak Teh',
      familyBranch: 'Cawangan Mak Teh',
      occupation: 'Usahawan',
      role: FamilyRole.VIEWER,
    },
  })

  const pakTehSpouse = await prisma.familyMember.create({
    data: {
      id: 'member-pakteh-001',
      familyId: family.id,
      fullName: 'Zulkifli bin Hamid',
      nickname: 'Pak Teh',
      gender: Gender.MALE,
      birthDate: new Date('1963-07-29'),
      placeOfBirth: 'Ipoh, Perak',
      currentAddress: 'Ipoh',
      negeri: 'Perak',
      binBinti: 'bin Hamid',
      religion: Religion.ISLAM,
      generationalTitle: 'Pak Teh',
      familyBranch: 'Cawangan Mak Teh',
      occupation: 'Jurutera',
      role: FamilyRole.VIEWER,
    },
  })

  const pakSu = await prisma.familyMember.create({
    data: {
      id: 'member-paksu-001',
      familyId: family.id,
      fullName: 'Mohd Khairul bin Ahmad',
      nickname: 'Pak Su',
      gender: Gender.MALE,
      birthDate: new Date('1970-11-08'),
      placeOfBirth: 'Kota Bharu, Kelantan',
      currentAddress: 'Kampung Baru',
      negeri: 'Kelantan',
      binBinti: 'bin Ahmad',
      religion: Religion.ISLAM,
      generationalTitle: 'Pak Su',
      familyBranch: 'Cawangan Pak Su',
      occupation: 'Peguam',
      role: FamilyRole.VIEWER,
    },
  })

  const makSuSpouse = await prisma.familyMember.create({
    data: {
      id: 'member-maksu-001',
      familyId: family.id,
      fullName: 'Nurul Ain binti Aziz',
      nickname: 'Mak Su',
      gender: Gender.FEMALE,
      birthDate: new Date('1973-02-17'),
      placeOfBirth: 'Kuala Lumpur',
      currentAddress: 'Bangsar',
      negeri: 'Kuala Lumpur',
      binBinti: 'binti Aziz',
      religion: Religion.ISLAM,
      generationalTitle: 'Mak Su',
      familyBranch: 'Cawangan Pak Su',
      occupation: 'Akauntan',
      role: FamilyRole.VIEWER,
    },
  })

  // ── Generation 3: Grandchildren ─────────────────────────────────
  const fadzillah = await prisma.familyMember.create({
    data: {
      id: 'member-fadzillah-001',
      familyId: family.id,
      fullName: 'Ahmad Fadzillah bin Mohd Razif',
      nickname: 'Fadzillah',
      gender: Gender.MALE,
      birthDate: new Date('1988-06-15'),
      placeOfBirth: 'Kuala Lumpur',
      currentAddress: 'Ampang',
      negeri: 'Selangor',
      binBinti: 'bin Mohd Razif',
      religion: Religion.ISLAM,
      familyBranch: 'Cawangan Pak Ngah',
      occupation: 'Jurutera Perisian',
      role: FamilyRole.OWNER,
      userId: demoUser.id,
    },
  })

  const syafiqah = await prisma.familyMember.create({
    data: {
      id: 'member-syafiqah-001',
      familyId: family.id,
      fullName: 'Nur Syafiqah binti Mohd Razif',
      nickname: 'Syafiqah',
      gender: Gender.FEMALE,
      birthDate: new Date('1991-03-28'),
      placeOfBirth: 'Kuala Lumpur',
      currentAddress: 'Ampang',
      negeri: 'Selangor',
      binBinti: 'binti Mohd Razif',
      religion: Religion.ISLAM,
      familyBranch: 'Cawangan Pak Ngah',
      occupation: 'Pensyarah Universiti',
      role: FamilyRole.VIEWER,
    },
  })

  const hafizuddin = await prisma.familyMember.create({
    data: {
      id: 'member-hafizuddin-001',
      familyId: family.id,
      fullName: 'Hafizuddin bin Mohd Fauzi',
      nickname: 'Hafiz',
      gender: Gender.MALE,
      birthDate: new Date('1985-09-12'),
      placeOfBirth: 'Kota Bharu, Kelantan',
      currentAddress: 'Kota Bharu',
      negeri: 'Kelantan',
      binBinti: 'bin Mohd Fauzi',
      religion: Religion.ISLAM,
      familyBranch: 'Cawangan Pak Long',
      occupation: 'Guru',
      role: FamilyRole.VIEWER,
    },
  })

  const izzatul = await prisma.familyMember.create({
    data: {
      id: 'member-izzatul-001',
      familyId: family.id,
      fullName: 'Izzatul Husna binti Mohd Fauzi',
      nickname: 'Izzatul',
      gender: Gender.FEMALE,
      birthDate: new Date('1989-11-05'),
      placeOfBirth: 'Kota Bharu, Kelantan',
      currentAddress: 'Kota Bharu',
      negeri: 'Kelantan',
      binBinti: 'binti Mohd Fauzi',
      religion: Religion.ISLAM,
      familyBranch: 'Cawangan Pak Long',
      occupation: 'Arkitek',
      role: FamilyRole.VIEWER,
    },
  })

  const amirulhakimi = await prisma.familyMember.create({
    data: {
      id: 'member-amirul-001',
      familyId: family.id,
      fullName: 'Amirul Hakimi bin Zulkifli',
      nickname: 'Amirul',
      gender: Gender.MALE,
      birthDate: new Date('1993-08-20'),
      placeOfBirth: 'Ipoh, Perak',
      currentAddress: 'Ipoh',
      negeri: 'Perak',
      binBinti: 'bin Zulkifli',
      religion: Religion.ISLAM,
      familyBranch: 'Cawangan Mak Teh',
      occupation: 'Pelajar Perubatan',
      role: FamilyRole.VIEWER,
    },
  })

  const nurhidayah = await prisma.familyMember.create({
    data: {
      id: 'member-hidayah-001',
      familyId: family.id,
      fullName: 'Nur Hidayah binti Zulkifli',
      nickname: 'Dayah',
      gender: Gender.FEMALE,
      birthDate: new Date('1996-01-30'),
      placeOfBirth: 'Ipoh, Perak',
      currentAddress: 'Ipoh',
      negeri: 'Perak',
      binBinti: 'binti Zulkifli',
      religion: Religion.ISLAM,
      familyBranch: 'Cawangan Mak Teh',
      occupation: 'Pelajar Universiti',
      role: FamilyRole.VIEWER,
    },
  })

  const aisyah = await prisma.familyMember.create({
    data: {
      id: 'member-aisyah-001',
      familyId: family.id,
      fullName: 'Aisyah Humaira binti Mohd Khairul',
      nickname: 'Aisyah',
      gender: Gender.FEMALE,
      birthDate: new Date('1998-05-14'),
      placeOfBirth: 'Kuala Lumpur',
      currentAddress: 'Damansara',
      negeri: 'Kuala Lumpur',
      binBinti: 'binti Mohd Khairul',
      religion: Religion.ISLAM,
      familyBranch: 'Cawangan Pak Su',
      occupation: 'Pelajar Sekolah',
      role: FamilyRole.VIEWER,
    },
  })

  const ibrahim = await prisma.familyMember.create({
    data: {
      id: 'member-ibrahim-001',
      familyId: family.id,
      fullName: 'Ibrahim Mikael bin Mohd Khairul',
      nickname: 'Ibrahim',
      gender: Gender.MALE,
      birthDate: new Date('2001-10-22'),
      placeOfBirth: 'Kuala Lumpur',
      currentAddress: 'Damansara',
      negeri: 'Kuala Lumpur',
      binBinti: 'bin Mohd Khairul',
      religion: Religion.ISLAM,
      familyBranch: 'Cawangan Pak Su',
      occupation: 'Pelajar Sekolah',
      role: FamilyRole.VIEWER,
    },
  })

  console.log('✅ Created 16 family members')

  // ── Wire up Relationships ────────────────────────────────────────

  const relationships = [
    // Tok Ahmad ↔ Wan Siti (spouses)
    { fromId: tok.id, toId: wan.id, type: RelationshipType.SPOUSE },
    { fromId: wan.id, toId: tok.id, type: RelationshipType.SPOUSE },

    // Tok Ahmad → Children
    { fromId: tok.id, toId: pakLong.id, type: RelationshipType.CHILD },
    { fromId: tok.id, toId: pakNgah.id, type: RelationshipType.CHILD },
    { fromId: tok.id, toId: makTeh.id, type: RelationshipType.CHILD },
    { fromId: tok.id, toId: pakSu.id, type: RelationshipType.CHILD },
    { fromId: wan.id, toId: pakLong.id, type: RelationshipType.CHILD },
    { fromId: wan.id, toId: pakNgah.id, type: RelationshipType.CHILD },
    { fromId: wan.id, toId: makTeh.id, type: RelationshipType.CHILD },
    { fromId: wan.id, toId: pakSu.id, type: RelationshipType.CHILD },

    // Children → Parents
    { fromId: pakLong.id, toId: tok.id, type: RelationshipType.PARENT },
    { fromId: pakLong.id, toId: wan.id, type: RelationshipType.PARENT },
    { fromId: pakNgah.id, toId: tok.id, type: RelationshipType.PARENT },
    { fromId: pakNgah.id, toId: wan.id, type: RelationshipType.PARENT },
    { fromId: makTeh.id, toId: tok.id, type: RelationshipType.PARENT },
    { fromId: makTeh.id, toId: wan.id, type: RelationshipType.PARENT },
    { fromId: pakSu.id, toId: tok.id, type: RelationshipType.PARENT },
    { fromId: pakSu.id, toId: wan.id, type: RelationshipType.PARENT },

    // Spouses
    { fromId: pakLong.id, toId: makLongSpouse.id, type: RelationshipType.SPOUSE },
    { fromId: makLongSpouse.id, toId: pakLong.id, type: RelationshipType.SPOUSE },
    { fromId: pakNgah.id, toId: makNgahSpouse.id, type: RelationshipType.SPOUSE },
    { fromId: makNgahSpouse.id, toId: pakNgah.id, type: RelationshipType.SPOUSE },
    { fromId: makTeh.id, toId: pakTehSpouse.id, type: RelationshipType.SPOUSE },
    { fromId: pakTehSpouse.id, toId: makTeh.id, type: RelationshipType.SPOUSE },
    { fromId: pakSu.id, toId: makSuSpouse.id, type: RelationshipType.SPOUSE },
    { fromId: makSuSpouse.id, toId: pakSu.id, type: RelationshipType.SPOUSE },

    // Grandchildren → Parents (Pak Ngah branch)
    { fromId: fadzillah.id, toId: pakNgah.id, type: RelationshipType.PARENT },
    { fromId: fadzillah.id, toId: makNgahSpouse.id, type: RelationshipType.PARENT },
    { fromId: syafiqah.id, toId: pakNgah.id, type: RelationshipType.PARENT },
    { fromId: syafiqah.id, toId: makNgahSpouse.id, type: RelationshipType.PARENT },
    { fromId: pakNgah.id, toId: fadzillah.id, type: RelationshipType.CHILD },
    { fromId: pakNgah.id, toId: syafiqah.id, type: RelationshipType.CHILD },
    { fromId: makNgahSpouse.id, toId: fadzillah.id, type: RelationshipType.CHILD },
    { fromId: makNgahSpouse.id, toId: syafiqah.id, type: RelationshipType.CHILD },

    // Grandchildren → Parents (Pak Long branch)
    { fromId: hafizuddin.id, toId: pakLong.id, type: RelationshipType.PARENT },
    { fromId: hafizuddin.id, toId: makLongSpouse.id, type: RelationshipType.PARENT },
    { fromId: izzatul.id, toId: pakLong.id, type: RelationshipType.PARENT },
    { fromId: izzatul.id, toId: makLongSpouse.id, type: RelationshipType.PARENT },
    { fromId: pakLong.id, toId: hafizuddin.id, type: RelationshipType.CHILD },
    { fromId: pakLong.id, toId: izzatul.id, type: RelationshipType.CHILD },
    { fromId: makLongSpouse.id, toId: hafizuddin.id, type: RelationshipType.CHILD },
    { fromId: makLongSpouse.id, toId: izzatul.id, type: RelationshipType.CHILD },

    // Grandchildren → Parents (Mak Teh branch)
    { fromId: amirulhakimi.id, toId: makTeh.id, type: RelationshipType.PARENT },
    { fromId: amirulhakimi.id, toId: pakTehSpouse.id, type: RelationshipType.PARENT },
    { fromId: nurhidayah.id, toId: makTeh.id, type: RelationshipType.PARENT },
    { fromId: nurhidayah.id, toId: pakTehSpouse.id, type: RelationshipType.PARENT },
    { fromId: makTeh.id, toId: amirulhakimi.id, type: RelationshipType.CHILD },
    { fromId: makTeh.id, toId: nurhidayah.id, type: RelationshipType.CHILD },
    { fromId: pakTehSpouse.id, toId: amirulhakimi.id, type: RelationshipType.CHILD },
    { fromId: pakTehSpouse.id, toId: nurhidayah.id, type: RelationshipType.CHILD },

    // Grandchildren → Parents (Pak Su branch)
    { fromId: aisyah.id, toId: pakSu.id, type: RelationshipType.PARENT },
    { fromId: aisyah.id, toId: makSuSpouse.id, type: RelationshipType.PARENT },
    { fromId: ibrahim.id, toId: pakSu.id, type: RelationshipType.PARENT },
    { fromId: ibrahim.id, toId: makSuSpouse.id, type: RelationshipType.PARENT },
    { fromId: pakSu.id, toId: aisyah.id, type: RelationshipType.CHILD },
    { fromId: pakSu.id, toId: ibrahim.id, type: RelationshipType.CHILD },
    { fromId: makSuSpouse.id, toId: aisyah.id, type: RelationshipType.CHILD },
    { fromId: makSuSpouse.id, toId: ibrahim.id, type: RelationshipType.CHILD },

    // Siblings (Gen 2)
    { fromId: pakLong.id, toId: pakNgah.id, type: RelationshipType.SIBLING },
    { fromId: pakLong.id, toId: makTeh.id, type: RelationshipType.SIBLING },
    { fromId: pakLong.id, toId: pakSu.id, type: RelationshipType.SIBLING },
    { fromId: pakNgah.id, toId: pakLong.id, type: RelationshipType.SIBLING },
    { fromId: pakNgah.id, toId: makTeh.id, type: RelationshipType.SIBLING },
    { fromId: pakNgah.id, toId: pakSu.id, type: RelationshipType.SIBLING },
    { fromId: makTeh.id, toId: pakLong.id, type: RelationshipType.SIBLING },
    { fromId: makTeh.id, toId: pakNgah.id, type: RelationshipType.SIBLING },
    { fromId: makTeh.id, toId: pakSu.id, type: RelationshipType.SIBLING },
    { fromId: pakSu.id, toId: pakLong.id, type: RelationshipType.SIBLING },
    { fromId: pakSu.id, toId: pakNgah.id, type: RelationshipType.SIBLING },
    { fromId: pakSu.id, toId: makTeh.id, type: RelationshipType.SIBLING },

    // Siblings (Gen 3 — Pak Ngah branch)
    { fromId: fadzillah.id, toId: syafiqah.id, type: RelationshipType.SIBLING },
    { fromId: syafiqah.id, toId: fadzillah.id, type: RelationshipType.SIBLING },

    // Siblings (Gen 3 — Pak Long branch)
    { fromId: hafizuddin.id, toId: izzatul.id, type: RelationshipType.SIBLING },
    { fromId: izzatul.id, toId: hafizuddin.id, type: RelationshipType.SIBLING },

    // Siblings (Gen 3 — Pak Su branch)
    { fromId: aisyah.id, toId: ibrahim.id, type: RelationshipType.SIBLING },
    { fromId: ibrahim.id, toId: aisyah.id, type: RelationshipType.SIBLING },
  ]

  for (const rel of relationships) {
    await prisma.relationship.upsert({
      where: {
        fromId_toId_type: {
          fromId: rel.fromId,
          toId: rel.toId,
          type: rel.type,
        },
      },
      update: {},
      create: {
        ...rel,
        familyId: family.id,
      },
    })
  }

  console.log('✅ Created', relationships.length, 'relationships')
  console.log('')
  console.log('🎉 Seed complete!')
  console.log('')
  console.log('📧 Demo login:')
  console.log('   Email:    demo@salasilah.my')
  console.log('   Password: demo1234')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
