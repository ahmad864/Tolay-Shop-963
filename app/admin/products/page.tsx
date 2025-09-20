// app/admin/products/page.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", price: "", quantity: "" });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  async function fetchProducts() {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
  }
  useEffect(() => { fetchProducts(); }, []);

  async function uploadAndGetUrl(file: File) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage.from("product-images").upload(fileName, file);
    if (error) throw error;
    const { data: publicData } = supabase.storage.from("product-images").getPublicUrl(data.path);
    return publicData.publicUrl;
  }

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();
    let image_url: string | null = null;
    if (file) {
      setUploading(true);
      image_url = await uploadAndGetUrl(file);
      setUploading(false);
    }
    await supabase.from("products").insert([{
      name: form.name,
      price: Number(form.price || 0),
      quantity: Number(form.quantity || 0),
      image_url
    }]);
    setForm({ name: "", price: "", quantity: "" });
    setFile(null);
    fetchProducts();
  }

  async function deleteProduct(id: string) {
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">إدارة المنتجات</h2>

      <form onSubmit={addProduct} className="mb-6 space-y-2">
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="اسم المنتج" className="border p-2 w-full"/>
        <input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="السعر" className="border p-2 w-full"/>
        <input value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} placeholder="الكمية" className="border p-2 w-full"/>
        <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} />
        <button className="bg-[#7f5c7e] text-white px-4 py-2 rounded" disabled={uploading}>
          {uploading ? "جارٍ الرفع..." : "إضافة المنتج"}
        </button>
      </form>

      <div className="space-y-2">
        {products.map(p => (
          <div key={p.id} className="p-3 bg-white border flex justify-between items-center">
            <div className="flex items-center gap-4">
              {p.image_url && <img src={p.image_url} alt={p.name} className="w-16 h-16 object-cover rounded" />}
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-gray-500">{p.price} — كمية: {p.quantity}</div>
              </div>
            </div>
            <button onClick={()=>deleteProduct(p.id)} className="bg-red-500 text-white px-3 py-1 rounded">حذف</button>
          </div>
        ))}
      </div>
    </div>
  );
}
