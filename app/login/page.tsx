"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement login logic
    console.log("Login data:", loginData)
    alert("تم تسجيل الدخول بنجاح!")
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (registerData.password !== registerData.confirmPassword) {
      alert("كلمات المرور غير متطابقة")
      return
    }
    // TODO: Implement registration logic
    console.log("Register data:", registerData)
    alert("تم إنشاء الحساب بنجاح! يرجى تفعيل حسابك من خلال الرابط المرسل إلى بريدك الإلكتروني")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#7f5c7e]/10 to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#7f5c7e] font-tajawal mb-2">مرحباً بك في TOLAY</h1>
          <p className="text-gray-600 font-tajawal">سجلي دخولك أو أنشئي حساباً جديداً</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login" className="font-tajawal">
              تسجيل الدخول
            </TabsTrigger>
            <TabsTrigger value="register" className="font-tajawal">
              إنشاء حساب
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#7f5c7e] font-tajawal">تسجيل الدخول</CardTitle>
                <CardDescription className="font-tajawal">أدخلي بياناتك لتسجيل الدخول إلى حسابك</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="font-tajawal">
                      البريد الإلكتروني
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="أدخلي بريدك الإلكتروني"
                        className="pl-10 font-tajawal"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="font-tajawal">
                      كلمة المرور
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="أدخلي كلمة المرور"
                        className="pl-10 pr-10 font-tajawal"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-[#7f5c7e] hover:bg-[#6b4c6a] font-tajawal">
                    تسجيل الدخول
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#7f5c7e] font-tajawal">إنشاء حساب جديد</CardTitle>
                <CardDescription className="font-tajawal">
                  أنشئي حساباً جديداً للاستمتاع بتجربة تسوق مميزة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="font-tajawal">
                      الاسم الكامل
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="أدخلي اسمك الكامل"
                        className="pl-10 font-tajawal"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="font-tajawal">
                      البريد الإلكتروني
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="أدخلي بريدك الإلكتروني"
                        className="pl-10 font-tajawal"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-phone" className="font-tajawal">
                      رقم الهاتف
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-phone"
                        type="tel"
                        placeholder="أدخلي رقم هاتفك"
                        className="pl-10 font-tajawal"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="font-tajawal">
                      كلمة المرور
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="أدخلي كلمة المرور"
                        className="pl-10 pr-10 font-tajawal"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password" className="font-tajawal">
                      تأكيد كلمة المرور
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="أعيدي إدخال كلمة المرور"
                        className="pl-10 pr-10 font-tajawal"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-[#7f5c7e] hover:bg-[#6b4c6a] font-tajawal">
                    إنشاء الحساب
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6">
          <Link href="/" className="text-[#7f5c7e] hover:underline font-tajawal">
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}
