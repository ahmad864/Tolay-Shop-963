// lib/supabaseServer.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * في صفحات Server Components أو API routes استعمل هذه الدالة للحصول على عميل سوبابيز مرتبط بالـ cookies الحالية.
 * ملاحظة: إذا تحتاج صلاحيات أعلى (write / admin) استخدم SUPABASE_SERVICE_ROLE_KEY في env — لكن احذر كشفه في المتصفح.
 */
export function createSupabaseServer() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // استخدم SERVICE_ROLE_KEY للعمليات الإدارية داخل server/API فقط
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies }
  );
}
