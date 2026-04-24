"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { MagnifyingGlass, Funnel, ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const statusMeta: Record<string, { label: string; color: string; dot: string }> = {
  pending: { label: "Pending", color: "text-amber-400 bg-amber-400/10", dot: "bg-amber-400" },
  in_progress: { label: "In Progress", color: "text-blue-400 bg-blue-400/10", dot: "bg-blue-400" },
  revision: { label: "Revision", color: "text-orange-400 bg-orange-400/10", dot: "bg-orange-400" },
  delivered: { label: "Delivered", color: "text-teal-400 bg-teal-400/10", dot: "bg-teal-400" },
  completed: { label: "Completed", color: "text-emerald-400 bg-emerald-400/10", dot: "bg-emerald-400" },
  cancelled: { label: "Cancelled", color: "text-red-400 bg-red-400/10", dot: "bg-red-400" },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AllOrders({ orders, total }: { orders: any[]; total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentQ = searchParams.get("q") ?? "";
  const currentStatus = searchParams.get("status") ?? "all";

  const [search, setSearch] = useState(currentQ);

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams("q", search);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-mono uppercase tracking-widest text-white/30 mb-1">Management</p>
        <h1 className="text-2xl font-heading font-bold text-white">All Orders</h1>
        <p className="text-sm text-white/40 mt-1">{total} order{total !== 1 ? "s" : ""} found</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="relative flex-1">
          <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, order no, service..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-brand-accent/50 transition" />
        </form>
        <div className="relative">
          <Funnel className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <select value={currentStatus} onChange={(e) => updateParams("status", e.target.value)}
            className="appearance-none bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-8 py-2.5 text-sm text-white/70 outline-none focus:border-brand-accent/50 transition cursor-pointer">
            <option value="all">All statuses</option>
            {Object.entries(statusMeta).map(([s, m]) => (
              <option key={s} value={s}>{m.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          {["Customer", "Phone", "Service", "Deadline", "Status", ""].map((h) => (
            <p key={h} className="text-[10px] font-mono uppercase tracking-widest text-white/25">{h}</p>
          ))}
        </div>

        {orders.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-white/30 text-sm">No orders match your filters.</p>
          </div>
        ) : (
          orders.map((order, i) => {
            const sm = statusMeta[order.status] ?? { label: order.status, color: "text-white/40 bg-white/5", dot: "bg-white/20" };
            const deadline = order.deadline
              ? new Date(order.deadline).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
              : "—";
            const isOverdue = order.deadline && new Date(order.deadline) < new Date() && !["completed", "delivered"].includes(order.status);
            return (
              <div key={order.id} className={`grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-4 items-center border-b border-white/[0.04] hover:bg-white/[0.03] transition group ${i === orders.length - 1 ? "border-b-0" : ""}`}>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white/80 group-hover:text-white transition truncate">{order.customer_name}</p>
                  <p className="text-xs text-white/30 font-mono truncate">{order.order_no}</p>
                </div>
                <p className="text-sm font-mono text-white/50 truncate">{order.customer_phone ?? "—"}</p>
                <p className="text-sm text-white/50 truncate">{order.service}</p>
                <p className={`text-sm font-mono ${isOverdue ? "text-red-400" : "text-white/50"}`}>
                  {deadline}
                  {isOverdue && <span className="ml-1 text-[10px]">OVERDUE</span>}
                </p>
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full w-fit ${sm.color}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${sm.dot}`} />
                  {sm.label}
                </span>
                <Link href={`/admin/orders/${order.id}`} className="group/btn flex items-center gap-1 text-xs text-white/30 hover:text-emerald-400 transition">
                  View <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            );
          })
        )}
      </motion.div>
    </div>
  );
}
