"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createManualOrder } from "@/lib/actions/admin";

export function ManualOrderForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    service: "Thesis",
    topic: "",
    requirements: "",
    price: 0,
    advance_amount: 0,
    source: "WhatsApp",
    work_status: "pending",
    payment_status: "unpaid",
    assigned_expert: "",
    internal_notes: "",
    send_confirmation: true,
  });

  const balance = Math.max(0, form.price - form.advance_amount);
  const hasAdvance = form.advance_amount > 0;

  const set = (key: string, value: string | number | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => {
          await createManualOrder({
            ...form,
            advance_amount: form.advance_amount,
            balance_amount: balance,
          });
          router.push("/admin/orders");
          router.refresh();
        });
      }}
    >
      {/* ── Customer Info ── */}
      <div>
        <p className="mb-3 text-[10px] font-mono uppercase tracking-widest text-white/30">Customer</p>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ["customer_name", "Name *", "text", true],
            ["customer_email", "Email *", "email", true],
            ["customer_phone", "WhatsApp / Phone *", "tel", true],
          ].map(([key, label, type, req]) => (
            <div key={key as string} className={key === "customer_name" ? "md:col-span-2" : ""}>
              <label className="mb-1 block text-xs uppercase tracking-wide text-white/50">{label as string}</label>
              <input
                type={type as string}
                required={Boolean(req)}
                value={String(form[key as keyof typeof form] ?? "")}
                onChange={(e) => set(key as string, e.target.value)}
                className="w-full rounded-xl border border-white/[0.1] bg-white/[0.02] px-3 py-2 text-sm text-white placeholder:text-white/20"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Service & Source ── */}
      <div>
        <p className="mb-3 text-[10px] font-mono uppercase tracking-widest text-white/30">Service</p>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-white/50">Service *</label>
            <select
              value={form.service}
              onChange={(e) => set("service", e.target.value)}
              className="w-full rounded-xl border border-white/[0.1] bg-[#0d1410] px-3 py-2 text-sm text-white"
            >
              {["Thesis", "Dissertation", "Research Paper", "Synopsis", "Term Papers / Assignments", "Scopus Publication", "Other"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-white/50">Source</label>
            <select
              value={form.source}
              onChange={(e) => set("source", e.target.value)}
              className="w-full rounded-xl border border-white/[0.1] bg-[#0d1410] px-3 py-2 text-sm text-white"
            >
              {["WhatsApp", "Email", "Phone Call", "Instagram", "Website", "Referral", "Other"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs uppercase tracking-wide text-white/50">Topic</label>
            <input
              value={form.topic}
              onChange={(e) => set("topic", e.target.value)}
              placeholder="e.g. Machine Learning in Healthcare"
              className="w-full rounded-xl border border-white/[0.1] bg-white/[0.02] px-3 py-2 text-sm text-white placeholder:text-white/20"
            />
          </div>
        </div>
      </div>

      {/* ── Quoted Pricing ── */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
        <p className="mb-4 text-[10px] font-mono uppercase tracking-widest text-white/30">Quoted Pricing</p>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-white/50">Quoted Total Price (₹) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/40">₹</span>
              <input
                type="number"
                required
                min={0}
                value={form.price || ""}
                onChange={(e) => set("price", Number(e.target.value))}
                placeholder="0"
                className="w-full rounded-xl border border-white/[0.1] bg-white/[0.02] pl-7 pr-3 py-2 text-sm text-white"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-white/50">Advance Received (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/40">₹</span>
              <input
                type="number"
                min={0}
                value={form.advance_amount || ""}
                onChange={(e) => set("advance_amount", Number(e.target.value))}
                placeholder="0 — leave blank if none"
                className="w-full rounded-xl border border-white/[0.1] bg-white/[0.02] pl-7 pr-3 py-2 text-sm text-white placeholder:text-white/20"
              />
            </div>
          </div>
        </div>

        {/* Live breakdown */}
        {form.price > 0 && (
          <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.05]">
            <div className="flex justify-between px-4 py-2.5 text-sm">
              <span className="text-white/50">Quoted total</span>
              <span className="font-semibold text-white">₹{form.price.toLocaleString("en-IN")}</span>
            </div>
            {hasAdvance && (
              <div className="flex justify-between px-4 py-2.5 text-sm">
                <span className="text-white/50">Advance received</span>
                <span className="font-semibold text-green-400">− ₹{form.advance_amount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between px-4 py-2.5 text-sm">
              <span className="text-white/60 font-semibold">{hasAdvance ? "Balance due" : "Full amount due"}</span>
              <span className={`font-bold text-base ${balance > 0 ? "text-amber-300" : "text-green-400"}`}>
                ₹{balance.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Status & Assignment ── */}
      <div>
        <p className="mb-3 text-[10px] font-mono uppercase tracking-widest text-white/30">Order Status</p>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-white/50">Initial Work Status</label>
            <select value={form.work_status} onChange={(e) => set("work_status", e.target.value)} className="w-full rounded-xl border border-white/[0.1] bg-[#0d1410] px-3 py-2 text-sm text-white">
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="under_review">Under Review</option>
              <option value="completed">Completed</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-white/50">Payment Status</label>
            <select value={form.payment_status} onChange={(e) => set("payment_status", e.target.value)} className="w-full rounded-xl border border-white/[0.1] bg-[#0d1410] px-3 py-2 text-sm text-white">
              <option value="unpaid">Unpaid</option>
              <option value="advance_paid">Advance Paid</option>
              <option value="fully_paid">Fully Paid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs uppercase tracking-wide text-white/50">Assigned Expert</label>
            <input
              value={form.assigned_expert}
              onChange={(e) => set("assigned_expert", e.target.value)}
              placeholder="PhD scholar name (optional)"
              className="w-full rounded-xl border border-white/[0.1] bg-white/[0.02] px-3 py-2 text-sm text-white placeholder:text-white/20"
            />
          </div>
        </div>
      </div>

      {/* ── Notes ── */}
      <div>
        <label className="mb-1 block text-xs uppercase tracking-wide text-white/50">Internal Notes</label>
        <textarea
          rows={3}
          value={form.internal_notes}
          onChange={(e) => set("internal_notes", e.target.value)}
          placeholder="Requirements, university format, deadline, guide name..."
          className="w-full rounded-xl border border-white/[0.1] bg-white/[0.02] px-3 py-2 text-sm text-white resize-none placeholder:text-white/20"
        />
      </div>

      {/* ── Options ── */}
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3">
        <input
          type="checkbox"
          checked={form.send_confirmation}
          onChange={(e) => set("send_confirmation", e.target.checked)}
          className="h-4 w-4 accent-brand-primary"
        />
        <div>
          <p className="text-sm font-medium text-white">Send confirmation email to customer</p>
          <p className="text-xs text-white/40">Sends an order confirmation email with pricing breakdown to {form.customer_email || "the customer's email"}.</p>
        </div>
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-deep disabled:opacity-60"
      >
        {isPending ? "Creating order…" : "Create Order"}
      </button>
    </form>
  );
}
