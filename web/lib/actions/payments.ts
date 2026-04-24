"use server";

import { createAdminClient } from "@/lib/supabase/server";

export async function getPayments(filter?: string) {
  const db = createAdminClient();

  let query = db
    .from("payments")
    .select("*")
    .order("paid_on", { ascending: false });

  if (filter && filter !== "all") {
    query = query.eq("status", filter);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}
