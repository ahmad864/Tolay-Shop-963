import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendOrderToWhatsApp, type OrderDetails } from '@/lib/whatsapp-integration'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    // ✅ التعديل هنا
    const { data: { user }, error: userError } =
      await supabase.auth.getUser({ access_token: token })

    if (userError || !user) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const orderDetails: OrderDetails = await request.json()
    if (!orderDetails.customerInfo || !orderDetails.items?.length) {
      return NextResponse.json({ error: 'معلومات الطلب غير مكتملة' }, { status: 400 })
    }

    const success = await sendOrderToWhatsApp(orderDetails)
    return success
      ? NextResponse.json({ success: true, message: 'تم إرسال الطلب بنجاح' })
      : NextResponse.json({ error: 'فشل في إرسال الطلب' }, { status: 500 })
  } catch (error) {
    console.error('Error in WhatsApp API route:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}
