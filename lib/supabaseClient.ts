// lib/supabaseClient.ts
"use client"

import { createBrowserClient } from "@supabase/ssr"

// ⚠️ يجب أن تكون هذه القيم معرفة في بيئة التشغيل (Vercel, .env.local)
// وبأسماء تبدأ بـ NEXT_PUBLIC_ حتى يتمكن المتصفح من الوصول إليها.
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
