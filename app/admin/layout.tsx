// app/admin/layout.tsx
"use client";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white border-r p-4">
        <h2 className="text-xl font-bold mb-4">لوحة التحكم</h2>
        <nav className="flex flex-col gap-2">
          <Link href="/admin">نظرة عامة</Link>
          <Link href="/admin/products">المنتجات</Link>
          <Link href="/admin/categories">الفئات</Link>
          <Link href="/admin/settings">الإعدادات</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-slate-50">{children}</main>
    </div>
  );
}
