import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

const AVATAR_BUCKET = 'avatars'
const MAX_SIZE = 2 * 1024 * 1024 // 2 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const memberId = formData.get('memberId') as string | null

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG or WebP images are allowed' }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum 2 MB.' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const folder = memberId ?? session.user.id
    const fileName = `${folder}/${Date.now()}-${randomUUID()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const admin = getAdmin()

    const { error: uploadError } = await admin.storage
      .from(AVATAR_BUCKET)
      .upload(fileName, buffer, { contentType: file.type, upsert: true })

    if (uploadError) {
      console.error('Avatar upload error:', uploadError)
      return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
    }

    const { data } = admin.storage.from(AVATAR_BUCKET).getPublicUrl(fileName)

    return NextResponse.json({ url: data.publicUrl }, { status: 201 })
  } catch (err) {
    console.error('Avatar route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
