"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/* ------------------------------------------------------------------
   Admin Dashboard (الكود الأصلي للوحة الإدارة – يمكنك تعديل التصميم)
-------------------------------------------------------------------*/
function AdminDashboard() {
  const [products, setProducts] = useState<{ id: number; name: string; price: number }[]>([])
  const [newProduct, setNewProduct] = useState({ name: "", price: "" })

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*")
    if (!error && data) setProducts(data)
  }

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProduct.name || !newProduct.price) return
    await supabase.from("products").insert({
      name: newProduct.name,
      price: Number(newProduct.price),
    })
    setNewProduct({ name: "", price: "" })
    fetchProducts()
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-[#7f5c7e]">لوحة التحكم</h1>
      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">المنتجات</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>إدارة المنتجات</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={addProduct} className="flex gap-4 mb-4">
                <Input
                  placeholder="اسم المنتج"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
                <Input
                  placeholder="السعر"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
                <Button type="submit" className="bg-[#7f5c7e] hover:bg-[#6b4c6a]">إضافة</Button>
              </form>
              <ul className="space-y-2">
                {products.map((p) => (
                  <li key={p.id} className="border p-2 rounded flex justify-between">
                    <span>{p.name}</span>
                    <span>{p.price} ر.س</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات عامة</CardTitle>
            </CardHeader>
            <CardContent>هنا يمكنك إضافة إعدادات أخرى لاحقًا.</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

/* ------------------------------------------------------------------
   صفحة الأدمن مع الحماية
-------------------------------------------------------------------*/
export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error || !session?.user) {
        router.push("/login")
        return
      }

      // التحقق من دور المستخدم
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single()

      if (profileError || profile?.role !== "admin") {
        router.push("/")
        return
      }

      setAuthorized(true)
      setLoading(false)
    }

    checkUser()
  }, [router])

  if (loading) {
    return <div className="p-8 text-center">جاري التحقق من الصلاحيات...</div>
  }

  if (!authorized) return null

  return <AdminDashboard />
}
