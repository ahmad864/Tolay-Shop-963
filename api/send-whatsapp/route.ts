import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendOrderToWhatsApp, type OrderDetails } from "@/lib/whatsapp-integration"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // 🔒 1) تحقق من وجود توكن
    const authHeader = request.headers.get("Authorization")
    const token = authHeader?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    // 🔒 2) تحقق من صحة التوكن
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    // 3) استكمال منطق إرسال الطلب
    const orderDetails: OrderDetails = await request.json()
    if (!orderDetails.customerInfo || !orderDetails.items || orderDetails.items.length === 0) {
      return NextResponse.json({ error: "معلومات الطلب غير مكتملة" }, { status: 400 })
    }

    const success = await sendOrderToWhatsApp(orderDetails)
    if (success) {
      return NextResponse.json({ success: true, message: "تم إرسال الطلب بنجاح" })
    } else {
      return NextResponse.json({ error: "فشل في إرسال الطلب" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in WhatsApp API route:", error)
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 })
  }
}
