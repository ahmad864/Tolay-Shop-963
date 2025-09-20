// app/admin/categories/page.tsx
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");

  async function fetchCategories() {
    const { data } = await supabase.from("categories").select("*").order("created_at", { ascending: false });
    setCategories(data || []);
  }
  useEffect(() => { fetchCategories(); }, []);

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from("categories").insert([{ name }]);
    setName("");
    fetchCategories();
  }

  async function deleteCategory(id: string) {
    await supabase.from("categories").delete().eq("id", id);
    fetchCategories();
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">إدارة الفئات</h2>
      <form onSubmit={addCategory} className="mb-4 flex gap-2">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="اسم الفئة" className="border p-2 flex-1"/>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">إضافة</button>
      </form>
      <ul>
        {categories.map(c => (
          <li key={c.id} className="flex justify-between p-2 bg-white border mb-1">
            {c.name}
            <button onClick={()=>deleteCategory(c.id)} className="text-red-500">حذف</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
