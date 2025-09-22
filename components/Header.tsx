"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Header() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // الحصول على الجلسة الحالية
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    // متابعة أي تغيّر في حالة تسجيل الدخول
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub?.subscription.unsubscribe();
  }, []);

  return (
    <header className="flex items-center justify-between p-4 shadow-md">
      {/* شعار الموقع */}
      <a href="/" className="text-xl font-bold">
        شعار الموقع
      </a>

      {/* روابط التنقل الأخرى إن وجدت */}
      <nav className="flex items-center gap-4">
        {/* مثال: <a href="/products">المنتجات</a> */}

        {/* زر تسجيل الدخول أو حسابي حسب حالة الجلسة */}
        {session ? (
          <a href="/account" className="text-blue-600 hover:underline">
            حسابي
          </a>
        ) : (
          <a href="/login" className="text-blue-600 hover:underline">
            تسجيل دخول
          </a>
        )}
      </nav>
    </header>
  );
}
