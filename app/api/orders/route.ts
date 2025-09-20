// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendOrderToWhatsApp, type OrderDetails } from "@/lib/whatsapp-integration";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const order: OrderDetails = await request.json();

    const { error } = await supabaseAdmin.from("orders").insert([{
      customer_name: order.customerInfo.fullName,
      customer_phone: order.customerInfo.phone,
      customer_address: order.customerInfo.address,
      customer_city: order.customerInfo.city,
      items: order.items,
      totals: order.totals,
      order_date: new Date().toISOString()
    }]);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await sendOrderToWhatsApp(order);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
