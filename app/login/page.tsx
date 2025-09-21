"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { email, password } = loginData

    // تسجيل الدخول
    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert("خطأ في تسجيل الدخول: " + error.message)
      setLoading(false)
      return
    }

    // جلب الدور من جدول profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", signInData.user.id)
      .single()

    if (profileError || !profile) {
      alert("تعذر الحصول على بيانات المستخدم.")
      setLoading(false)
      return
    }

    // توجيه حسب الدور
    if (profile.role === "admin") {
      router.push("/admin")
    } else {
      router.push("/")
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">تسجيل الدخول</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#7f5c7e] hover:bg-[#6b4c6a]"
              disabled={loading}
            >
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
