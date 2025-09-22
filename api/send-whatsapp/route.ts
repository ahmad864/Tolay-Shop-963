import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendOrderToWhatsApp, type OrderDetails } from "@/lib/whatsapp-integration";

// إنشاء عميل Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // 🔒 1) جلب التوكن من الهيدر
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    // 🔒 2) التحقق من صحة التوكن (التعديل هنا)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUserByAccessToken(token);

    if (userError || !user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    // 3) قراءة بيانات الطلب
    const orderDetails: OrderDetails = await request.json();
    if (
      !orderDetails.customerInfo ||
      !orderDetails.items ||
      orderDetails.items.length === 0
    ) {
      return NextResponse.json(
        { error: "معلومات الطلب غير مكتملة" },
        { status: 400 }
      );
    }

    // 4) إرسال الطلب إلى واتساب
    const success = await sendOrderToWhatsApp(orderDetails);
    if (success) {
      return NextResponse.json({
        success: true,
        message: "تم إرسال الطلب بنجاح",
      });
    } else {
      return NextResponse.json(
        { error: "فشل في إرسال الطلب" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in WhatsApp API route:", error);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
