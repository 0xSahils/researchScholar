"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ───────────────────────────────────────────────
// PUBLIC — order placement
// ───────────────────────────────────────────────
export interface CreateOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  institution?: string;
  service: string;
  price: number;
  topic?: string;
  requirements?: string;
}

export interface CreateOrderResult {
  success: boolean;
  orderNo?: string;
  orderId?: string;
  error?: string;
}

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  try {
    const db = createAdminClient();

    // 1. Upsert customer
    const { data: customerId, error: custError } = await db.rpc("upsert_customer", {
      p_name: input.customerName,
      p_email: input.customerEmail,
      p_phone: input.customerPhone,
      p_institution: input.institution ?? null,
    });
    if (custError) throw new Error(custError.message);

    // 2. Insert order — trigger sets order_no
    const { data: order, error: orderError } = await db
      .from("orders")
      .insert({
        customer_id: customerId,
        customer_name: input.customerName,
        customer_email: input.customerEmail,
        customer_phone: input.customerPhone,
        service: input.service,
        topic: input.topic ?? null,
        requirements: input.requirements ?? null,
        price: input.price,
        status: "pending",
        payment_status: "paid",
      })
      .select("id, order_no")
      .single();
    if (orderError) throw new Error(orderError.message);

    // 3. Create payment record
    await db.from("payments").insert({
      order_id: order.id,
      order_no: order.order_no,
      customer_name: input.customerName,
      customer_email: input.customerEmail,
      amount: input.price,
      method: "Simulation",
      status: "paid",
    });

    // 4. Update customer aggregates
    const { count: orderCount } = await db
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("customer_id", customerId);

    await db
      .from("customers")
      .update({ total_orders: orderCount ?? 1, total_spent: input.price })
      .eq("id", customerId);

    return { success: true, orderNo: order.order_no, orderId: order.id };
  } catch (err) {
    console.error("[createOrder]", err);
    return { success: false, error: String(err) };
  }
}

// ───────────────────────────────────────────────
// ADMIN — reads
// ───────────────────────────────────────────────
export async function getOrders(filters: { status?: string; q?: string } = {}) {
  const db = createAdminClient();
  let query = db.from("orders").select("*").order("created_at", { ascending: false });
  if (filters.status && filters.status !== "all") query = query.eq("status", filters.status);
  if (filters.q) {
    query = query.or(
      `customer_name.ilike.%${filters.q}%,customer_email.ilike.%${filters.q}%,order_no.ilike.%${filters.q}%,service.ilike.%${filters.q}%`
    );
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getOrderById(id: string) {
  const db = createAdminClient();
  const { data, error } = await db.from("orders").select("*").eq("id", id).single();
  if (error) throw new Error(error.message);
  return data;
}

export async function getDashboardStats() {
  const db = createAdminClient();
  const [
    { count: totalOrders },
    { count: pendingOrders },
    { count: completedOrders },
    { count: totalCustomers },
    { data: paidPayments },
    { data: pendingPaymentsData },
    { data: recentOrders },
  ] = await Promise.all([
    db.from("orders").select("*", { count: "exact", head: true }),
    db.from("orders").select("*", { count: "exact", head: true }).in("status", ["pending", "in_progress", "revision"]),
    db.from("orders").select("*", { count: "exact", head: true }).in("status", ["completed", "delivered"]),
    db.from("customers").select("*", { count: "exact", head: true }),
    db.from("payments").select("amount").eq("status", "paid"),
    db.from("payments").select("amount").in("status", ["pending", "partial"]),
    db.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  return {
    totalOrders: totalOrders ?? 0,
    pendingOrders: pendingOrders ?? 0,
    completedOrders: completedOrders ?? 0,
    totalCustomers: totalCustomers ?? 0,
    totalEarnings: (paidPayments ?? []).reduce((s: number, p: { amount: number }) => s + Number(p.amount), 0),
    pendingPaymentsTotal: (pendingPaymentsData ?? []).reduce((s: number, p: { amount: number }) => s + Number(p.amount), 0),
    recentOrders: recentOrders ?? [],
  };
}

export async function getMonthlyEarnings() {
  const db = createAdminClient();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const { data } = await db
    .from("payments")
    .select("amount, paid_on")
    .eq("status", "paid")
    .gte("paid_on", sixMonthsAgo.toISOString());

  const monthMap: Record<string, number> = {};
  (data ?? []).forEach((p: { amount: number; paid_on: string }) => {
    const month = new Date(p.paid_on).toLocaleString("en-IN", { month: "short" });
    monthMap[month] = (monthMap[month] ?? 0) + Number(p.amount);
  });
  return Object.entries(monthMap).map(([month, earnings]) => ({ month, earnings }));
}

// ───────────────────────────────────────────────
// ADMIN — writes
// ───────────────────────────────────────────────
export async function updateOrderStatus(id: string, status: string) {
  const db = createAdminClient();
  const { error } = await db.from("orders").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

export async function updateOrderNotes(id: string, notes: string) {
  const db = createAdminClient();
  const { error } = await db.from("orders").update({ notes }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/orders/${id}`);
}

export async function uploadDeliveryFile(
  orderId: string,
  formData: FormData
): Promise<{ url: string | null; error: string | null }> {
  const db = createAdminClient();
  const file = formData.get("file") as File;
  if (!file) return { url: null, error: "No file provided" };

  const ext = file.name.split(".").pop();
  const safeName = `${orderId}_${Date.now()}.${ext}`;

  const { data, error } = await db.storage.from("deliveries").upload(safeName, file, { upsert: true });
  if (error) return { url: null, error: error.message };

  const { data: urlData } = db.storage.from("deliveries").getPublicUrl(data.path);

  await db
    .from("orders")
    .update({ delivered_file: urlData.publicUrl, status: "delivered" })
    .eq("id", orderId);

  revalidatePath(`/admin/orders/${orderId}`);
  return { url: urlData.publicUrl, error: null };
}
