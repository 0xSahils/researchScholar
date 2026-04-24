"use server";

import { createAdminClient } from "@/lib/supabase/server";

export async function getOrderByNumber(orderNo: string) {
  const db = createAdminClient();
  const { data, error } = await db
    .from("orders")
    .select("order_no, customer_name, service, status, created_at, deadline, delivered_file")
    .eq("order_no", orderNo.toUpperCase().trim())
    .single();

  if (error) return null;
  return data;
}
