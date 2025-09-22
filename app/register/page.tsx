'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    // إنشاء حساب جديد
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }, // يحفظ الاسم في user_metadata
        emailRedirectTo: `${window.location.origin}/` // رابط التفعيل (يمكن تعديله)
      }
    })

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
      return
    }

    // إدخال الاسم في جدول profiles (اختياري)
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName
      })
    }

    setSuccessMsg('تم إنشاء الحساب! تحقق من بريدك لتأكيد الحساب.')
    setLoading(false)

    // توجيه للموقع الرئيسي أو صفحة الحساب بعد بضع ثوانٍ
    setTimeout(() => router.push('/'), 2500)
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">إنشاء حساب</h1>

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="الاسم الكامل"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
          minLength={6}
        />

        {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
        {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'جاري إنشاء الحساب…' : 'إنشاء الحساب'}
        </button>
      </form>
    </div>
  )
}
