"use server";

import { createAdminClient } from "@/lib/supabase/server";

export async function getCustomers(search?: string) {
  const db = createAdminClient();

  let query = db
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,institution.ilike.%${search}%`
    );
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getCustomerOrders(customerEmail: string) {
  const db = createAdminClient();
  const { data, error } = await db
    .from("orders")
    .select("*")
    .eq("customer_email", customerEmail)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}
