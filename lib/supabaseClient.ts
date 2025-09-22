// lib/supabaseServer.ts
import { createClient } from "@supabase/supabase-js";

export const supabaseServer = createClient(
  process.env.SUPABASE_URL!,          // بدون NEXT_PUBLIC
  process.env.SUPABASE_ANON_KEY!
);
