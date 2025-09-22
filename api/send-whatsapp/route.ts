// app/api/orders/route.ts  أو  app/api/orders/route.js

export const runtime = "nodejs"

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendOrderToWhatsApp, type OrderDetails } from "@/lib/whatsapp-integration"

// أنشئ عميل Supabase باستخدام متغيرات البيئة
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
)

export async function POST(request: NextRequest) {
  try {
    // 1️⃣ التحقق من وجود توكن
    const authHeader = request.headers.get("Authorization")
    const token = authHeader?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    // 2️⃣ التحقق من صحة التوكن
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser(token)

    if (userError || !user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    // 3️⃣ استكمال منطق إرسال الطلب
    const orderDetails: OrderDetails = await request.json()
    if (
      !orderDetails.customerInfo ||
      !orderDetails.items ||
      orderDetails.items.length === 0
    ) {
      return NextResponse.json(
        { error: "معلومات الطلب غير مكتملة" },
        { status: 400 }
      )
    }

    const success = await sendOrderToWhatsApp(orderDetails)
    if (success) {
      return NextResponse.json({
        success: true,
        message: "تم إرسال الطلب بنجاح"
      })
    } else {
      return NextResponse.json(
        { error: "فشل في إرسال الطلب" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error in WhatsApp API route:", error)
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 })
  }
}
