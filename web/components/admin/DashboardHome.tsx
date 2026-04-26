"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, Package, TrendUp, Warning } from "@phosphor-icons/react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const WORK_COLORS: Record<string, string> = {
  pending: "#94a3b8",
  assigned: "#60a5fa",
  in_progress: "#fbbf24",
  under_review: "#c084fc",
  completed: "#2dd4bf",
  delivered: "#34d399",
  revision_requested: "#fb923c",
  cancelled: "#f87171",
  revision: "#fb923c",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface DashboardStats {
  ordersThisMonth: number;
  pendingOrders: number;
  unpaidOrPartial: number;
  revenueThisMonth: number;
  workStatusCounts: Record<string, number>;
  recentOrders: any[];
}

interface Props {
  stats: DashboardStats;
  revenueLast30Days: { day: string; amount: number }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deadlineAlerts: any[];
}

const payChip = (p: string) => {
  if (p === "paid") return "text-emerald-300 bg-emerald-500/15";
  if (p === "partial") return "text-amber-300 bg-amber-500/15";
  if (p === "refunded") return "text-slate-300 bg-slate-500/15";
  return "text-red-300 bg-red-500/15";
};

export function DashboardHome({ stats, revenueLast30Days, deadlineAlerts }: Props) {
  const donutData = Object.entries(stats.workStatusCounts).map(([name, value]) => ({ name, value }));
  const kpis = [
    { label: "Orders this month", value: stats.ordersThisMonth, icon: Package, color: "text-blue-300", bg: "bg-blue-500/10" },
    { label: "Pending work", value: stats.pendingOrders, icon: Clock, color: "text-amber-300", bg: "bg-amber-500/10" },
    { label: "Unpaid / partial", value: stats.unpaidOrPartial, icon: Warning, color: "text-red-300", bg: "bg-red-500/10" },
    { label: "Revenue this month (₹)", value: stats.revenueThisMonth.toLocaleString("en-IN"), icon: TrendUp, color: "text-emerald-300", bg: "bg-emerald-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-white/30">Overview</p>
        <h1 className="font-heading text-2xl font-bold text-white">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.35 }}
            className="flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5"
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${kpi.bg}`}>
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} weight="bold" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-white/40">{kpi.label}</p>
              <p className="mt-0.5 font-heading text-2xl font-bold text-white">{kpi.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {deadlineAlerts.length > 0 ? (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          <p className="font-semibold">Deadline within 48 hours</p>
          <ul className="mt-2 space-y-1">
            {deadlineAlerts.map((o: { id: string; order_no: string }) => (
              <li key={o.id}>
                <Link href={`/admin/orders/${o.id}`} className="font-mono underline hover:text-white">
                  {o.order_no}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5"
        >
          <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-white/30">Work status</p>
          <h2 className="mb-4 text-base font-semibold text-white">Orders by status</h2>
          <div className="h-64 w-full">
            {donutData.length === 0 ? (
              <p className="py-16 text-center text-sm text-white/25">No order data</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutData} dataKey="value" nameKey="name" innerRadius={56} outerRadius={88} paddingAngle={2}>
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={WORK_COLORS[entry.name] ?? "#64748b"} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#111", border: "1px solid #333", borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5"
        >
          <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-white/30">Revenue</p>
          <h2 className="mb-4 text-base font-semibold text-white">Last 30 days</h2>
          <div className="h-64 w-full">
            {revenueLast30Days.length === 0 ? (
              <p className="py-16 text-center text-sm text-white/25">No payments yet</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueLast30Days} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2D8C4E" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#2D8C4E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff14" />
                  <XAxis dataKey="day" tick={{ fill: "#ffffff66", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#ffffff66", fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: "#111", border: "1px solid #333", borderRadius: 8 }} />
                  <Area type="monotone" dataKey="amount" stroke="#2D8C4E" fill="url(#revFill)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-white/30">Latest</p>
            <h2 className="text-base font-semibold text-white">Recent orders</h2>
          </div>
          <Link href="/admin/orders" className="group flex items-center gap-1 text-xs text-brand-accent hover:text-brand-light">
            View all <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <p className="py-12 text-center text-sm text-white/20">No orders yet</p>
        ) : (
          <div className="space-y-px">
            {stats.recentOrders.map((order: { id: string; customer_name: string; service: string; order_no: string; work_status?: string; status?: string; payment_status?: string; price: number }) => {
              const ws = order.work_status ?? order.status ?? "pending";
              const ps = order.payment_status ?? "pending";
              return (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex flex-wrap items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-white/[0.04]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white/80">{order.customer_name}</p>
                    <p className="truncate text-xs text-white/30">
                      {order.service} · {order.order_no}
                    </p>
                  </div>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/50">{ws}</span>
                  <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${payChip(ps)}`}>{ps}</span>
                  <div className="text-right">
                    <p className="font-mono text-xs text-white/40">₹{Number(order.price).toLocaleString("en-IN")}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
