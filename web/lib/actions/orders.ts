"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

import { sendDeliveryEmail, sendOrderConfirmationEmail, sendAdminNewOrderAlert } from "@/lib/actions/notifications";
import { toDbPaymentStatus, workStatusToDbOrderStatus } from "@/lib/orders/db-maps";

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
  paymentStatus?: string;
  workStatus?: string;
  verification?: { emailVerified: boolean; phoneVerified: boolean };
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
    const work = input.workStatus ?? "pending";
    const pay = toDbPaymentStatus(input.paymentStatus);
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
        status: workStatusToDbOrderStatus(work),
        work_status: work,
        payment_status: pay,
        total_amount: input.price,
        balance_amount: input.price,
        verification: input.verification ?? { emailVerified: false, phoneVerified: false },
      })
      .select("id, order_no")
      .single();
    if (orderError) throw new Error(orderError.message);

    // 3. Update customer aggregates
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

export async function markOrderPaid(orderId: string, payment: { amount: number; razorpayPaymentId?: string; razorpayOrderId?: string; method?: string }) {
  const db = createAdminClient();
  const { data: order } = await db
    .from("orders")
    .select("id, order_no, customer_name, customer_email, customer_phone, service, price, total_amount")
    .eq("id", orderId)
    .single();
  await db.from("orders").update({ payment_status: "paid", balance_amount: 0 }).eq("id", orderId);
  await db.from("payment_transactions").insert({
    order_id: orderId,
    amount: payment.amount,
    type: "full",
    method: payment.method ?? "Razorpay",
    razorpay_payment_id: payment.razorpayPaymentId ?? null,
    razorpay_order_id: payment.razorpayOrderId ?? null,
    status: "captured",
  });
  await db.from("payments").insert({
    order_id: orderId,
    order_no: order?.order_no ?? "",
    customer_name: order?.customer_name ?? "",
    customer_email: order?.customer_email ?? "",
    amount: payment.amount,
    method: "Card",
    status: "paid",
  });
  if (order) {
    await sendOrderConfirmationEmail({
      orderNo: order.order_no,
      orderId: order.id,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone ?? undefined,
      service: order.service,
      price: Number(order.total_amount ?? order.price),
    });
    await sendAdminNewOrderAlert({
      orderNo: order.order_no,
      orderId: order.id,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone ?? undefined,
      service: order.service,
      price: Number(order.total_amount ?? order.price),
    });
  }
}

export async function completeOrderAfterPayment(
  orderId: string,
  payment: { amount: number; razorpayPaymentId?: string; razorpayOrderId?: string; method?: string }
) {
  await markOrderPaid(orderId, payment);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}

// ───────────────────────────────────────────────
// ADMIN — reads
// ───────────────────────────────────────────────
export async function getOrders(filters: {
  status?: string;
  payment?: string;
  q?: string;
  limit?: number;
  offset?: number;
} = {}) {
  const db = createAdminClient();
  const limit = filters.limit ?? 20;
  const offset = filters.offset ?? 0;
  let query = db.from("orders").select("*", { count: "exact" }).order("created_at", { ascending: false });
  if (filters.status && filters.status !== "all") query = query.eq("work_status", filters.status);
  if (filters.payment && filters.payment !== "all") query = query.eq("payment_status", filters.payment);
  if (filters.q) {
    query = query.or(
      `customer_name.ilike.%${filters.q}%,customer_email.ilike.%${filters.q}%,order_no.ilike.%${filters.q}%,service.ilike.%${filters.q}%`
    );
  }
  query = query.range(offset, offset + limit - 1);
  const { data, error, count } = await query;
  if (error) throw new Error(error.message);
  return { orders: data ?? [], total: count ?? 0 };
}

export async function getOrderById(id: string) {
  const db = createAdminClient();
  const { data, error } = await db.from("orders").select("*").eq("id", id).single();
  if (error) throw new Error(error.message);
  return data;
}

export async function getDashboardStats() {
  const db = createAdminClient();
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const in48h = new Date();
  in48h.setHours(in48h.getHours() + 48);

  const [
    { count: totalOrders },
    { count: ordersThisMonth },
    { count: pendingOrders },
    { count: completedOrders },
    { count: totalCustomers },
    { data: paidPayments },
    { data: unpaidOrders },
    { data: recentOrders },
    { data: allOrdersForCharts },
    { data: paymentsThisMonth },
    { data: deadlineOrders },
  ] = await Promise.all([
    db.from("orders").select("*", { count: "exact", head: true }),
    db.from("orders").select("*", { count: "exact", head: true }).gte("created_at", startOfMonth.toISOString()),
    db.from("orders").select("*", { count: "exact", head: true }).in("work_status", ["pending", "assigned", "in_progress", "under_review"]),
    db.from("orders").select("*", { count: "exact", head: true }).in("work_status", ["completed", "delivered"]),
    db.from("customers").select("*", { count: "exact", head: true }),
    db.from("payment_transactions").select("amount, created_at").eq("status", "captured"),
    db.from("orders").select("id, balance_amount, payment_status").or("payment_status.eq.pending,payment_status.eq.partial"),
    db.from("orders").select("*").order("created_at", { ascending: false }).limit(10),
    db.from("orders").select("work_status").limit(500),
    db.from("payment_transactions").select("amount").eq("status", "captured").gte("created_at", startOfMonth.toISOString()),
    db
      .from("orders")
      .select("id, order_no, deadline, work_status")
      .not("deadline", "is", null)
      .lte("deadline", in48h.toISOString().slice(0, 10))
      .not("work_status", "eq", "completed")
      .not("work_status", "eq", "delivered"),
  ]);

  const revenueThisMonth = (paymentsThisMonth ?? []).reduce((s: number, p: { amount: number }) => s + Number(p.amount), 0);
  const unpaidOrPartial = unpaidOrders?.length ?? 0;
  const workStatusCounts: Record<string, number> = {};
  (allOrdersForCharts ?? []).forEach((row: { work_status: string | null }) => {
    const k = row.work_status ?? "pending";
    workStatusCounts[k] = (workStatusCounts[k] ?? 0) + 1;
  });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const { data: recentPaid } = await db
    .from("payment_transactions")
    .select("amount, created_at")
    .eq("status", "captured")
    .gte("created_at", thirtyDaysAgo.toISOString());
  const dayTotals: Record<string, number> = {};
  (recentPaid ?? []).forEach((p: { amount: number; created_at: string }) => {
    const d = new Date(p.created_at).toISOString().slice(0, 10);
    dayTotals[d] = (dayTotals[d] ?? 0) + Number(p.amount);
  });
  const revenueLast30Days = Object.entries(dayTotals)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, amount]) => ({ day, amount }));

  return {
    totalOrders: totalOrders ?? 0,
    ordersThisMonth: ordersThisMonth ?? 0,
    pendingOrders: pendingOrders ?? 0,
    completedOrders: completedOrders ?? 0,
    totalCustomers: totalCustomers ?? 0,
    totalEarnings: (paidPayments ?? []).reduce((s: number, p: { amount: number }) => s + Number(p.amount), 0),
    revenueThisMonth,
    unpaidOrPartial,
    pendingPaymentsTotal: (unpaidOrders ?? []).reduce((s: number, p: { balance_amount: number | null }) => s + Number(p.balance_amount ?? 0), 0),
    recentOrders: recentOrders ?? [],
    workStatusCounts,
    revenueLast30Days,
    deadlineAlerts: deadlineOrders ?? [],
  };
}

export async function getMonthlyEarnings() {
  const db = createAdminClient();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const { data } = await db
    .from("payment_transactions")
    .select("amount, created_at")
    .eq("status", "captured")
    .gte("created_at", sixMonthsAgo.toISOString());

  const monthMap: Record<string, number> = {};
  (data ?? []).forEach((p: { amount: number; created_at: string }) => {
    const month = new Date(p.created_at).toLocaleString("en-IN", { month: "short" });
    monthMap[month] = (monthMap[month] ?? 0) + Number(p.amount);
  });
  return Object.entries(monthMap).map(([month, earnings]) => ({ month, earnings }));
}

// ───────────────────────────────────────────────
// ADMIN — writes
// ───────────────────────────────────────────────
export async function updateOrderStatus(id: string, workStatus: string) {
  const db = createAdminClient();
  const { error } = await db
    .from("orders")
    .update({ work_status: workStatus, status: workStatusToDbOrderStatus(workStatus) })
    .eq("id", id);
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

export async function updateOrderInternalNotes(id: string, internal_notes: string) {
  const db = createAdminClient();
  const { error } = await db.from("orders").update({ internal_notes }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/orders/${id}`);
}

export async function updateAssignedExpert(id: string, assigned_expert: string) {
  const db = createAdminClient();
  const { error } = await db.from("orders").update({ assigned_expert }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/orders/${id}`);
}

const MAX_DELIVERY_BYTES = 50 * 1024 * 1024;
const ALLOWED_DELIVERY_EXT = new Set(["pdf", "docx"]);

async function uploadDeliveryBlob(orderId: string, file: File): Promise<{ url: string | null; error: string | null }> {
  const db = createAdminClient();
  if (!file) return { url: null, error: "No file provided" };
  const ext = (file.name.split(".").pop() ?? "").toLowerCase();
  if (!ALLOWED_DELIVERY_EXT.has(ext)) return { url: null, error: "Only PDF and DOCX files are allowed." };
  if (file.size > MAX_DELIVERY_BYTES) return { url: null, error: "File must be 50MB or smaller." };
  const safeName = `${orderId}_${Date.now()}.${ext}`;
  const { data, error } = await db.storage.from("deliveries").upload(safeName, file, { upsert: true });
  if (error) return { url: null, error: error.message };
  const { data: urlData } = db.storage.from("deliveries").getPublicUrl(data.path);
  return { url: urlData.publicUrl, error: null };
}

export async function uploadDeliveryFile(
  orderId: string,
  formData: FormData
): Promise<{ url: string | null; error: string | null }> {
  const db = createAdminClient();
  const file = formData.get("file") as File;
  const uploaded = await uploadDeliveryBlob(orderId, file);
  if (!uploaded.url) return uploaded;

  await db
    .from("orders")
    .update({
      delivered_file: uploaded.url,
      status: "delivered",
      work_status: "delivered",
    })
    .eq("id", orderId);

  revalidatePath(`/admin/orders/${orderId}`);
  return uploaded;
}

export async function getPaymentTransactions(orderId: string) {
  const db = createAdminClient();
  const { data, error } = await db
    .from("payment_transactions")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function addManualPayment(input: {
  orderId: string;
  amount: number;
  method: string;
  referenceNumber?: string;
  type: "advance" | "balance" | "full";
  notes?: string;
}) {
  const db = createAdminClient();
  await db.from("payment_transactions").insert({
    order_id: input.orderId,
    amount: input.amount,
    type: input.type,
    method: input.method,
    reference_number: input.referenceNumber ?? null,
    status: "captured",
    notes: input.notes ?? null,
  });
  const { data: order } = await db.from("orders").select("total_amount, advance_amount, balance_amount, payment_status").eq("id", input.orderId).single();
  const total = Number(order?.total_amount ?? 0);
  const { data: txs } = await db.from("payment_transactions").select("amount").eq("order_id", input.orderId).eq("status", "captured");
  const paid = (txs ?? []).reduce((s: number, t: { amount: number }) => s + Number(t.amount), 0);
  let paymentStatus = order?.payment_status ?? "pending";
  if (total > 0 && paid >= total) paymentStatus = "paid";
  else if (paid > 0) paymentStatus = "partial";
  await db
    .from("orders")
    .update({
      payment_status: paymentStatus,
      balance_amount: Math.max(0, total - paid),
    })
    .eq("id", input.orderId);
  revalidatePath(`/admin/orders/${input.orderId}`);
}

export async function updateOrderPaymentStatus(orderId: string, paymentStatus: string) {
  const db = createAdminClient();
  const pay = toDbPaymentStatus(paymentStatus);
  const { error } = await db.from("orders").update({ payment_status: pay }).eq("id", orderId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function saveOrderPricing(
  orderId: string,
  payload: { total_amount: number; gst_rate?: number; gst_amount?: number; advance_amount?: number; balance_amount?: number }
) {
  const db = createAdminClient();
  const { error } = await db.from("orders").update(payload).eq("id", orderId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function sendDeliveryDocumentOneClick(
  orderId: string,
  formData: FormData,
  versionLabel: string
): Promise<{ success: boolean; error?: string }> {
  const file = formData.get("file") as File;
  const upload = await uploadDeliveryBlob(orderId, file);
  if (!upload.url) return { success: false, error: upload.error ?? "Upload failed" };

  const db = createAdminClient();
  const { data: order } = await db.from("orders").select("*").eq("id", orderId).single();
  if (!order) return { success: false, error: "Order not found" };

  const prev = Array.isArray(order.delivery_files) ? order.delivery_files : [];
  const entry = {
    url: upload.url,
    version: versionLabel || "v1",
    sent_at: new Date().toISOString(),
    filename: (formData.get("file") as File)?.name ?? "document",
  };
  await db
    .from("orders")
    .update({
      delivered_file: upload.url,
      delivery_files: [...prev, entry],
      work_status: "delivered",
      status: "delivered",
    })
    .eq("id", orderId);

  await sendDeliveryEmail(
    {
      orderNo: order.order_no,
      orderId: order.id,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      service: order.service,
      price: Number(order.price),
    },
    upload.url
  );

  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}
