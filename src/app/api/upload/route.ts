import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin, STORAGE_BUCKET, MAX_FILE_SIZE, ALLOWED_TYPES, getPublicUrl } from '@/lib/supabase'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Tiada fail dipilih' }, { status: 400 })
    }

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Format fail tidak disokong. Gunakan JPEG, PNG, atau WebP.' }, { status: 400 })
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Saiz fail terlalu besar. Had maksimum 5MB.' }, { status: 400 })
    }

    const ext = file.name.split('.').pop() ?? 'jpg'
    const fileName = `${session.user.id}/${randomUUID()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return NextResponse.json({ error: 'Muat naik gagal. Sila cuba lagi.' }, { status: 500 })
    }

    const url = getPublicUrl(fileName)

    return NextResponse.json({ url }, { status: 201 })
  } catch (err) {
    console.error('Upload route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
