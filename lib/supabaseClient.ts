// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// نستخدم متغيرات البيئة التي أضفتها في Vercel
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)
