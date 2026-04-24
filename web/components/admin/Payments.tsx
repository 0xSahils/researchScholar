"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CurrencyInr, Clock, CheckCircle } from "@phosphor-icons/react";

const paymentStatusMeta: Record<string, { label: string; color: string; dot: string }> = {
  paid: { label: "Paid", color: "text-emerald-400 bg-emerald-400/10", dot: "bg-emerald-400" },
  pending: { label: "Pending", color: "text-amber-400 bg-amber-400/10", dot: "bg-amber-400" },
  partial: { label: "Partial", color: "text-orange-400 bg-orange-400/10", dot: "bg-orange-400" },
  refunded: { label: "Refunded", color: "text-red-400 bg-red-400/10", dot: "bg-red-400" },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Payments({ payments }: { payments: any[] }) {
  const [filter, setFilter] = useState<string>("all");

  const totalCollected = payments.filter((p) => p.status === "paid").reduce((s: number, p) => s + Number(p.amount), 0);
  const totalPending = payments.filter((p) => ["pending","partial"].includes(p.status)).reduce((s: number, p) => s + Number(p.amount), 0);

  const filtered = filter === "all" ? payments : payments.filter((p) => p.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-mono uppercase tracking-widest text-white/30 mb-1">Finance</p>
        <h1 className="text-2xl font-heading font-bold text-white">Payments</h1>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Collected", value: `₹${totalCollected.toLocaleString("en-IN")}`, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { label: "Pending / Partial", value: `₹${totalPending.toLocaleString("en-IN")}`, icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
          { label: "Total Transactions", value: payments.length, icon: CurrencyInr, color: "text-brand-accent", bg: "bg-brand-accent/10" },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.4 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 flex items-center gap-4">
            <div className={`h-10 w-10 rounded-xl ${card.bg} flex items-center justify-center flex-shrink-0`}>
              <card.icon className={`h-5 w-5 ${card.color}`} weight="bold" />
            </div>
            <div>
              <p className="text-[11px] text-white/40">{card.label}</p>
              <p className="text-xl font-heading font-bold text-white">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {["all", "paid", "pending", "partial", "refunded"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filter === f ? "bg-brand-primary/20 text-brand-accent border border-brand-primary/30" : "bg-white/[0.03] text-white/40 border border-white/[0.06] hover:text-white/70"}`}>
            {f === "all" ? "All" : paymentStatusMeta[f]?.label ?? f}
          </button>
        ))}
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.4 }}
        className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          {["Customer", "Order No.", "Method", "Amount", "Status"].map((h) => (
            <p key={h} className="text-[10px] font-mono uppercase tracking-widest text-white/25">{h}</p>
          ))}
        </div>
        {filtered.length === 0 ? (
          <p className="text-white/30 text-sm text-center py-16">No payment records yet.</p>
        ) : filtered.map((pay, i) => {
          const sm = paymentStatusMeta[pay.status] ?? { label: pay.status, color: "text-white/40 bg-white/5", dot: "bg-white/20" };
          const paidOn = new Date(pay.paid_on).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
          return (
            <div key={pay.id} className={`grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-4 items-center border-b border-white/[0.04] hover:bg-white/[0.025] transition ${i === filtered.length - 1 ? "border-b-0" : ""}`}>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white/80 truncate">{pay.customer_name}</p>
                <p className="text-[10px] font-mono text-white/25 mt-0.5">{paidOn}</p>
              </div>
              <p className="text-sm font-mono text-white/50 truncate">{pay.order_no}</p>
              <p className="text-sm text-white/50">{pay.method}</p>
              <p className="text-sm font-mono font-semibold text-white/80">₹{Number(pay.amount).toLocaleString("en-IN")}</p>
              <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full w-fit ${sm.color}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${sm.dot}`} />
                {sm.label}
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
