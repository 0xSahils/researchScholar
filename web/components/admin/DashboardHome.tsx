"use client";

import { motion } from "framer-motion";
import {
  ChartBar,
  Clock,
  CheckCircle,
  CurrencyInr,
  Warning,
  Users,
  ArrowRight,
} from "@phosphor-icons/react";
import Link from "next/link";

const statusDotMap: Record<string, string> = {
  pending: "bg-amber-400",
  in_progress: "bg-blue-400",
  revision: "bg-orange-400",
  delivered: "bg-teal-400",
  completed: "bg-emerald-400",
  cancelled: "bg-red-400",
};
const statusLabelMap: Record<string, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  revision: "Revision",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
};
const statusColorMap: Record<string, string> = {
  pending: "text-amber-400 bg-amber-400/10",
  in_progress: "text-blue-400 bg-blue-400/10",
  revision: "text-orange-400 bg-orange-400/10",
  delivered: "text-teal-400 bg-teal-400/10",
  completed: "text-emerald-400 bg-emerald-400/10",
  cancelled: "text-red-400 bg-red-400/10",
};

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalEarnings: number;
  pendingPaymentsTotal: number;
  totalCustomers: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props { stats: DashboardStats; recentOrders: any[]; chartData: { month: string; earnings: number }[] }

export function DashboardHome({ stats, recentOrders, chartData }: Props) {
  const kpis = [
    { label: "Total Orders", value: stats.totalOrders, icon: ChartBar, trend: null, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Active / Pending", value: stats.pendingOrders, icon: Clock, trend: null, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Completed", value: stats.completedOrders, icon: CheckCircle, trend: null, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Total Earnings", value: `₹${stats.totalEarnings.toLocaleString("en-IN")}`, icon: CurrencyInr, trend: null, color: "text-brand-accent", bg: "bg-brand-accent/10" },
    { label: "Pending Payments", value: `₹${stats.pendingPaymentsTotal.toLocaleString("en-IN")}`, icon: Warning, trend: null, color: "text-orange-400", bg: "bg-orange-400/10" },
    { label: "Customers", value: stats.totalCustomers, icon: Users, trend: null, color: "text-violet-400", bg: "bg-violet-400/10" },
  ];

  const maxEarnings = Math.max(...chartData.map((d) => d.earnings), 1);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] font-mono uppercase tracking-widest text-white/30 mb-1">Overview</p>
        <h1 className="text-2xl font-heading font-bold text-white">Dashboard</h1>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.4 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 flex flex-col gap-3">
            <div className={`h-9 w-9 rounded-xl ${kpi.bg} flex items-center justify-center`}>
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} weight="bold" />
            </div>
            <div>
              <p className="text-[11px] text-white/40 font-medium">{kpi.label}</p>
              <p className="text-2xl font-heading font-bold text-white mt-0.5">{kpi.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Bar chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }}
          className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
          <p className="text-[11px] font-mono uppercase tracking-widest text-white/30 mb-1">Monthly</p>
          <h2 className="text-base font-semibold text-white mb-6">Earnings Trend</h2>
          {chartData.length === 0 ? (
            <p className="text-sm text-white/20 text-center py-12">No payment data yet</p>
          ) : (
            <div className="flex items-end gap-2 h-32">
              {chartData.map((d, i) => {
                const heightPct = (d.earnings / maxEarnings) * 100;
                return (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="relative w-full flex flex-col justify-end" style={{ height: "100px" }}>
                      <motion.div
                        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                        transition={{ delay: 0.4 + i * 0.06, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                        style={{ height: `${heightPct}%`, transformOrigin: "bottom" }}
                        className="w-full rounded-t-lg bg-gradient-to-t from-brand-primary to-brand-accent"
                      />
                    </div>
                    <span className="text-[9px] font-mono text-white/30">{d.month}</span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Recent orders */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.5 }}
          className="lg:col-span-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-widest text-white/30 mb-1">Latest</p>
              <h2 className="text-base font-semibold text-white">Recent Orders</h2>
            </div>
            <Link href="/admin/orders" className="group flex items-center gap-1 text-xs text-brand-accent hover:text-brand-light transition">
              View all <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-white/20 text-center py-12">No orders yet</p>
          ) : (
            <div className="space-y-px">
              {recentOrders.map((order) => (
                <Link key={order.id} href={`/admin/orders/${order.id}`}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/[0.04] transition group">
                  <div className={`h-2 w-2 rounded-full flex-shrink-0 ${statusDotMap[order.status] ?? "bg-white/20"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/80 truncate group-hover:text-white transition">{order.customer_name}</p>
                    <p className="text-xs text-white/30 truncate">{order.service} · {order.order_no}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${statusColorMap[order.status] ?? "text-white/40 bg-white/5"}`}>
                      {statusLabelMap[order.status] ?? order.status}
                    </span>
                    <p className="text-xs text-white/30 mt-1 font-mono">
                      ₹{Number(order.price).toLocaleString("en-IN")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
