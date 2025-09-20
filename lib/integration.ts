// lib/whatsapp-integration.ts
export type OrderDetails = {
  customerInfo: { fullName: string; phone: string; city: string; address: string; currency?: string };
  items: { id?: string; name: string; price: number; quantity: number }[];
  totals: { subtotal: number; shipping: number; discount: number; total: number };
  orderDate?: string;
  orderId?: string;
};

function formatMessage(order: OrderDetails) {
  const { customerInfo, items, totals, orderId } = order;
  let msg = `طلب جديد\nالاسم: ${customerInfo.fullName}\nالهاتف: ${customerInfo.phone}\nالعنوان: ${customerInfo.address}\n\nالمنتجات:\n`;
  items.forEach((it, i)=> { msg += `${i+1}. ${it.name} x${it.quantity} - ${it.price}\n`; });
  msg += `\nالمجموع: ${totals.total}\nرقم الطلب: ${orderId || ""}`;
  return msg;
}

export async function sendOrderToWhatsApp(order: OrderDetails): Promise<boolean> {
  try {
    const apiKey = process.env.CALLMEBOT_API_KEY;
    const toNumber = process.env.CALLMEBOT_NUMBER;
    if (!apiKey || !toNumber) return false;
    const message = encodeURIComponent(formatMessage(order));
    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(toNumber)}&text=${message}&apikey=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url);
    return res.ok;
  } catch (err) {
    console.error("WhatsApp send error:", err);
    return false;
  }
}
