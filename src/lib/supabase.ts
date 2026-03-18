import 'server-only'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client-side Supabase (anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase (service role — for uploads)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export const STORAGE_BUCKET = 'salasilah-photos'
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export function getPublicUrl(path: string): string {
  const { data } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
