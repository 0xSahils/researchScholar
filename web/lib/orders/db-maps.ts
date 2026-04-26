/** Maps app-level work / payment labels to existing Postgres enums on `orders`. */

export type DbPaymentStatus = "paid" | "pending" | "partial" | "refunded";

export function toDbPaymentStatus(input?: string | null): DbPaymentStatus {
  const v = (input ?? "pending").toLowerCase();
  if (v === "unpaid" || v === "pending") return "pending";
  if (v === "advance_paid" || v === "partial") return "partial";
  if (v === "fully_paid" || v === "paid") return "paid";
  if (v === "refunded") return "refunded";
  return "pending";
}

export type DbOrderStatus = "pending" | "in_progress" | "revision" | "delivered" | "completed" | "cancelled";

export function workStatusToDbOrderStatus(work?: string | null): DbOrderStatus {
  const w = (work ?? "pending").toLowerCase();
  if (w === "delivered") return "delivered";
  if (w === "completed") return "completed";
  if (w === "cancelled") return "cancelled";
  if (w === "revision_requested" || w === "revision") return "revision";
  if (w === "assigned" || w === "under_review" || w === "in_progress") return "in_progress";
  return "pending";
}

export function displayPaymentStatus(db: string | null | undefined): string {
  const v = db ?? "pending";
  if (v === "pending") return "Unpaid";
  if (v === "partial") return "Advance paid";
  if (v === "paid") return "Fully paid";
  if (v === "refunded") return "Refunded";
  return v;
}
