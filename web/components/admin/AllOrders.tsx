"use client";

import { useMemo, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { DownloadSimple, MagnifyingGlass, Funnel, ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { displayPaymentStatus } from "@/lib/orders/db-maps";

const workMeta: Record<string, { label: string; color: string; dot: string }> = {
  pending: { label: "Pending", color: "text-slate-300 bg-slate-500/15", dot: "bg-slate-400" },
  assigned: { label: "Assigned", color: "text-blue-300 bg-blue-500/15", dot: "bg-blue-400" },
  in_progress: { label: "In progress", color: "text-amber-300 bg-amber-500/15", dot: "bg-amber-400" },
  under_review: { label: "Under review", color: "text-purple-300 bg-purple-500/15", dot: "bg-purple-400" },
  completed: { label: "Completed", color: "text-teal-300 bg-teal-500/15", dot: "bg-teal-400" },
  delivered: { label: "Delivered", color: "text-emerald-300 bg-emerald-500/15", dot: "bg-emerald-400" },
  revision_requested: { label: "Revision", color: "text-orange-300 bg-orange-500/15", dot: "bg-orange-400" },
  cancelled: { label: "Cancelled", color: "text-red-300 bg-red-500/15", dot: "bg-red-400" },
  revision: { label: "Revision", color: "text-orange-300 bg-orange-500/15", dot: "bg-orange-400" },
};

const payMeta: Record<string, { label: string; color: string; dot: string }> = {
  pending: { label: "Unpaid", color: "text-red-300 bg-red-500/15", dot: "bg-red-400" },
  partial: { label: "Advance", color: "text-amber-300 bg-amber-500/15", dot: "bg-amber-400" },
  paid: { label: "Paid", color: "text-emerald-300 bg-emerald-500/15", dot: "bg-emerald-400" },
  refunded: { label: "Refunded", color: "text-slate-300 bg-slate-500/15", dot: "bg-slate-400" },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AllOrders({ orders, total }: { orders: any[]; total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentQ = searchParams.get("q") ?? "";
  const currentStatus = searchParams.get("status") ?? "all";
  const currentPayment = searchParams.get("payment") ?? "all";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const [search, setSearch] = useState(currentQ);

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "all") params.set(key, value);
      else params.delete(key);
    });
    params.set("page", "1");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  };

  const goPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: search });
  };

  const csvBlob = useMemo(() => {
    const headers = ["order_no", "customer_name", "customer_email", "service", "deadline", "work_status", "payment_status", "price"];
    const rows = orders.map((o) =>
      headers.map((h) => JSON.stringify(String(o[h] ?? ""))).join(",")
    );
    return new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
  }, [orders]);

  const downloadCsv = () => {
    const url = URL.createObjectURL(csvBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-page-${page}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-white/30">Management</p>
          <h1 className="font-heading text-2xl font-bold text-white">All Orders</h1>
          <p className="mt-1 text-sm text-white/40">
            {total} order{total !== 1 ? "s" : ""} · page {page} of {totalPages}
          </p>
        </div>
        <button
          type="button"
          onClick={downloadCsv}
          className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/5"
        >
          <DownloadSimple className="h-4 w-4" />
          Export CSV (this page)
        </button>
      </div>

      <div className="flex flex-col flex-wrap gap-3 sm:flex-row">
        <form onSubmit={handleSearch} className="relative min-w-[200px] flex-1">
          <MagnifyingGlass className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, order no, service…"
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/25 outline-none focus:border-brand-accent/50"
          />
        </form>
        <div className="relative min-w-[160px]">
          <Funnel className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <select
            value={currentStatus}
            onChange={(e) => updateParams({ status: e.target.value })}
            className="w-full cursor-pointer appearance-none rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-8 text-sm text-white/70 outline-none focus:border-brand-accent/50"
          >
            <option value="all">All work statuses</option>
            {Object.keys(workMeta).map((s) => (
              <option key={s} value={s}>
                {workMeta[s]?.label ?? s}
              </option>
            ))}
          </select>
        </div>
        <div className="relative min-w-[160px]">
          <Funnel className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <select
            value={currentPayment}
            onChange={(e) => updateParams({ payment: e.target.value })}
            className="w-full cursor-pointer appearance-none rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-8 text-sm text-white/70 outline-none focus:border-brand-accent/50"
          >
            <option value="all">All payments</option>
            <option value="pending">Unpaid</option>
            <option value="partial">Advance paid</option>
            <option value="paid">Fully paid</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]"
      >
        <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.7fr)_auto] gap-2 border-b border-white/[0.06] bg-white/[0.02] px-4 py-3 sm:gap-4 sm:px-5">
          {["Customer", "Service", "Deadline", "Work", "Pay", "₹", ""].map((h) => (
            <p key={h} className="text-[9px] font-mono uppercase tracking-widest text-white/25 sm:text-[10px]">
              {h}
            </p>
          ))}
        </div>

        {orders.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-white/30">No orders match your filters.</p>
          </div>
        ) : (
          orders.map((order, i) => {
            const ws = order.work_status ?? order.status;
            const ps = order.payment_status ?? "pending";
            const wm = workMeta[ws] ?? { label: ws, color: "text-white/40 bg-white/5", dot: "bg-white/30" };
            const pm = payMeta[ps] ?? { label: displayPaymentStatus(ps), color: "text-white/40 bg-white/5", dot: "bg-white/30" };
            const deadline = order.deadline
              ? new Date(order.deadline).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
              : "—";
            const isOverdue =
              order.deadline && new Date(order.deadline) < new Date() && !["completed", "delivered"].includes(String(ws));
            return (
              <div
                key={order.id}
                className={`grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.7fr)_auto] items-center gap-2 border-b border-white/[0.04] px-4 py-3 transition hover:bg-white/[0.03] sm:gap-4 sm:px-5 ${
                  i === orders.length - 1 ? "border-b-0" : ""
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white/80">{order.customer_name}</p>
                  <p className="truncate font-mono text-[10px] text-white/35">{order.order_no}</p>
                  <p className="truncate text-[10px] text-white/40">{order.customer_email}</p>
                </div>
                <p className="truncate text-xs text-white/50 sm:text-sm">{order.service}</p>
                <p className={`font-mono text-xs sm:text-sm ${isOverdue ? "text-red-400" : "text-white/50"}`}>
                  {deadline}
                  {isOverdue ? <span className="ml-1 text-[9px]">LATE</span> : null}
                </p>
                <span className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium sm:text-[11px] ${wm.color}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${wm.dot}`} />
                  {wm.label}
                </span>
                <span className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium sm:text-[11px] ${pm.color}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${pm.dot}`} />
                  {pm.label}
                </span>
                <p className="font-mono text-xs text-white/70 sm:text-sm">₹{Number(order.price).toLocaleString("en-IN")}</p>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="group/btn flex items-center gap-1 whitespace-nowrap text-xs text-white/30 hover:text-emerald-400"
                >
                  View <ArrowRight className="h-3.5 w-3.5 transition group-hover/btn:translate-x-0.5" />
                </Link>
              </div>
            );
          })
        )}
      </motion.div>

      {totalPages > 1 ? (
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => goPage(p)}
              className={`h-9 min-w-[2.25rem] rounded-full px-2 text-sm ${
                p === page ? "bg-brand-primary text-white" : "border border-white/[0.1] text-white/60 hover:bg-white/5"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
