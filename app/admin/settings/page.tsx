// app/admin/settings/page.tsx
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SettingsPage() {
  const [logo, setLogo] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");

  async function fetchSettings() {
    const { data } = await supabase.from("store_settings").select("*");
    if (data) {
      data.forEach((row:any) => {
        if (row.key === "logo") setLogo(row.value);
        if (row.key === "primary_color") setPrimaryColor(row.value);
      });
    }
  }
  useEffect(() => { fetchSettings(); }, []);

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from("store_settings").upsert([
      { key: "logo", value: logo },
      { key: "primary_color", value: primaryColor },
    ]);
    alert("تم الحفظ");
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">إعدادات المتجر</h2>
      <form onSubmit={saveSettings} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1">رابط اللوجو</label>
          <input value={logo} onChange={e=>setLogo(e.target.value)} className="border p-2 w-full"/>
        </div>
        <div>
          <label className="block mb-1">اللون الأساسي</label>
          <input value={primaryColor} onChange={e=>setPrimaryColor(e.target.value)} className="border p-2 w-full"/>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded">حفظ</button>
      </form>
    </div>
  );
}
