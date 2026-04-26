import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const rawBody = await req.text();

  if (!secret) return NextResponse.json({ ok: false, error: "Webhook secret missing" }, { status: 500 });

  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const verified = signature && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  if (!verified) return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 400 });

  const event = JSON.parse(rawBody);
  const db = createAdminClient();

  setTimeout(async () => {
    try {
      if (event.event === "payment.captured") {
        const payment = event.payload.payment.entity;
        const orderId = payment.notes?.order_id;
        if (!orderId) return;
        await db.from("payment_transactions").insert({
          order_id: orderId,
          amount: payment.amount / 100,
          type: "full",
          method: payment.method ?? "Razorpay",
          razorpay_payment_id: payment.id,
          razorpay_order_id: payment.order_id,
          status: "captured",
        });
        await db.from("orders").update({ payment_status: "fully_paid", balance_amount: 0 }).eq("id", orderId);
      }
      if (event.event === "payment.failed") {
        const payment = event.payload.payment.entity;
        const orderId = payment.notes?.order_id;
        if (!orderId) return;
        await db.from("payment_transactions").insert({
          order_id: orderId,
          amount: (payment.amount ?? 0) / 100,
          type: "full",
          method: payment.method ?? "Razorpay",
          razorpay_payment_id: payment.id,
          razorpay_order_id: payment.order_id,
          status: "failed",
          notes: payment.error_description ?? "Payment failed",
        });
      }
    } catch {
      // no-op
    }
  }, 0);

  return NextResponse.json({ ok: true });
}
