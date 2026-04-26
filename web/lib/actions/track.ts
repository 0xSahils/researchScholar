"use server";

import { createAdminClient } from "@/lib/supabase/server";

export async function getOrderByNumber(orderNo: string) {
  const db = createAdminClient();
  const { data, error } = await db
    .from("orders")
    // IMPORTANT: never select internal_notes, assigned_expert, notes — those are admin-only
    .select("order_no, customer_name, service, topic, work_status, payment_status, created_at, deadline, delivery_files")
    .eq("order_no", orderNo.toUpperCase().trim())
    .single();

  if (error) return null;
  return data;
}
