// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"; // ✅ استخدم الدالة الجديدة
// إذا لديك types لقاعدة البيانات يمكنك: import type { Database } from "@/types/supabase";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // ✅ استدعاء الدالة الجديدة
  const supabase = createMiddlewareClient({ req, res });
  // أو createMiddlewareClient<Database>({ req, res }) في حال وجود types

  // حماية مسار /admin
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // توجيه غير المسجلين إلى صفحة تسجيل الدخول
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile || profile.role !== "admin") {
      // ليس أدمن -> أعد التوجيه للصفحة الرئيسية
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return res;
}

// ضبط matcher لمسارات لوحة الإدارة
export const config = {
  matcher: ["/admin/:path*"],
};
