"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { toDbPaymentStatus, workStatusToDbOrderStatus } from "@/lib/orders/db-maps";

export async function getPricingRows() {
  const db = createAdminClient();
  const { data, error } = await db.from("service_pricing").select("*").order("service_name");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function savePricingRow(id: string, payload: Record<string, string | number>) {
  const db = createAdminClient();
  const { error } = await db.from("service_pricing").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/pricing");
  revalidatePath("/services");
  revalidatePath("/order");
}

/** Upsert by service_name — creates the row if it doesn't exist, updates if it does */
export async function upsertPricingByServiceName(
  serviceName: string,
  basePrice: number,
  minPrice: number,
) {
  const db = createAdminClient();

  // Single atomic upsert — no extra round-trip needed
  const { error } = await db.from("service_pricing").upsert(
    {
      service_name: serviceName,
      base_price: basePrice,
      min_price: minPrice,
      price_per_page: 0,
      price_per_word: 0,
      urgent_multiplier: 1,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "service_name" },
  );

  if (error) throw new Error(`Pricing save failed: ${error.message}`);

  revalidatePath("/admin/pricing");
  revalidatePath("/services");
  revalidatePath("/order");
}


export async function getSiteSettings() {
  const db = createAdminClient();
  const { data, error } = await db.from("site_settings").select("*").order("updated_at", { ascending: false }).limit(1).single();
  if (error) throw new Error(error.message);
  return data;
}

/** Used by public pages (Services, Order) to show live prices from DB */
export async function getPublicPricing(): Promise<Array<{
  id: string;
  service_name: string;
  base_price: number;
  price_per_page: number;
  price_per_word: number;
  urgent_multiplier: number;
  min_price: number;
}>> {
  const db = createAdminClient();
  const { data, error } = await db.from("service_pricing").select("id, service_name, base_price, price_per_page, price_per_word, urgent_multiplier, min_price").order("service_name");
  if (error) {
    console.error("getPublicPricing error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function saveSiteSettings(payload: Record<string, string | number>) {
  const db = createAdminClient();
  const row = await getSiteSettings();
  const { error } = await db.from("site_settings").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", row.id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/settings");
  revalidatePath("/admin/pricing");
}

export async function createManualOrder(input: {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service: string;
  topic?: string;
  requirements?: string;
  price: number;
  advance_amount?: number;
  balance_amount?: number;
  source: string;
  work_status: string;
  payment_status: string;
  assigned_expert?: string;
  internal_notes?: string;
  send_confirmation?: boolean;
}) {
  const db = createAdminClient();
  const year = new Date().getFullYear();
  const { count } = await db.from("orders").select("*", { count: "exact", head: true }).gte("created_at", `${year}-01-01T00:00:00.000Z`);
  const sequence = String((count ?? 0) + 1).padStart(3, "0");
  const orderNo = `RS-${year}-${sequence}`;

  const advanceAmount = input.advance_amount ?? 0;
  const balanceAmount = input.balance_amount ?? input.price;

  const { data, error } = await db
    .from("orders")
    .insert({
      customer_name: input.customer_name,
      customer_email: input.customer_email,
      customer_phone: input.customer_phone,
      service: input.service,
      topic: input.topic ?? null,
      requirements: input.requirements ?? null,
      price: input.price,
      source: input.source,
      assigned_expert: input.assigned_expert ?? null,
      internal_notes: input.internal_notes ?? null,
      order_no: orderNo,
      work_status: input.work_status,
      status: workStatusToDbOrderStatus(input.work_status),
      payment_status: toDbPaymentStatus(input.payment_status),
      total_amount: input.price,
      advance_amount: advanceAmount,
      balance_amount: balanceAmount,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  // Optionally send confirmation email
  if (input.send_confirmation && input.customer_email) {
    const { sendManualOrderConfirmation } = await import("@/lib/actions/notifications");
    await sendManualOrderConfirmation({
      orderNo,
      customerName: input.customer_name,
      customerEmail: input.customer_email,
      customerPhone: input.customer_phone,
      service: input.service,
      price: input.price,
      advanceAmount,
      balanceAmount,
      orderId: data.id,
    }).catch((e) => console.error("[createManualOrder confirmation]", e));
  }

  revalidatePath("/admin/orders");
  return data;
}

/** Resend order confirmation from admin order detail page */
export async function sendOrderConfirmationAsAdmin(orderId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const db = createAdminClient();
    const { data: order, error } = await db.from("orders").select("*").eq("id", orderId).single();
    if (error || !order) return { success: false, error: "Order not found" };

    const { sendManualOrderConfirmation } = await import("@/lib/actions/notifications");
    await sendManualOrderConfirmation({
      orderNo: order.order_no,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      service: order.service,
      price: Number(order.total_amount ?? order.price),
      advanceAmount: Number(order.advance_amount ?? 0),
      balanceAmount: Number(order.balance_amount ?? order.price),
      orderId: order.id,
    });
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

/** Returns only public-safe settings: gst_rate and google_analytics_id */
export async function getPublicSettings(): Promise<{ gst_rate: number; google_analytics_id: string | null }> {
  try {
    const db = createAdminClient();
    const { data, error } = await db
      .from("site_settings")
      .select("gst_rate, google_analytics_id")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();
    if (error || !data) return { gst_rate: 0, google_analytics_id: null };
    return {
      gst_rate: Number(data.gst_rate ?? 0),
      google_analytics_id: data.google_analytics_id ?? null,
    };
  } catch {
    return { gst_rate: 0, google_analytics_id: null };
  }
}

