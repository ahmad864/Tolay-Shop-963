// app/api/orders/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendOrderToWhatsApp, type OrderDetails } from "@/lib/whatsapp-integration"

// إنشاء عميل Supabase باستخدام Service Role (صلاحيات كاملة للـ Insert)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    // قراءة بيانات الطلب من جسم الطلب
    const order: OrderDetails = await request.json()

    // تحقّق مبسّط من الحقول الأساسية
    if (
      !order?.customerInfo?.fullName ||
      !order?.customerInfo?.phone ||
      !order?.items ||
      !Array.isArray(order.items)
    ) {
      return NextResponse.json(
        { error: "بيانات الطلب غير مكتملة" },
        { status: 400 }
      )
    }

    // حفظ الطلب في جدول orders
    const { error } = await supabaseAdmin.from("orders").insert([
      {
        customer_name: order.customerInfo.fullName,
        customer_phone: order.customerInfo.phone,
        customer_address: order.customerInfo.address || "",
        customer_city: order.customerInfo.city || "",
        items: order.items,
        totals: order.totals,
        order_date: new Date().toISOString(),
      },
    ])

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // إرسال الطلب إلى واتساب (وظيفة مخصصة لديك)
    await sendOrderToWhatsApp(order)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Server error:", err)
    return NextResponse.json({ error: "server error" }, { status: 500 })
  }
}
