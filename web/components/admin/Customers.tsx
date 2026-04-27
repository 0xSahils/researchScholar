"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlass, Users, Envelope, Phone, Buildings, ArrowRight, X, CurrencyInr, ListBullets, Trash
} from "@phosphor-icons/react";
import { getCustomerOrders } from "@/lib/actions/customers";
import { deleteCustomer } from "@/lib/actions/admin";
import { useRouter } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Customers({ customers }: { customers: any[] }) {
  const [search, setSearch] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selected, setSelected] = useState<any | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.institution?.toLowerCase().includes(q)
    );
  });

  const handleSelectCustomer = async (customer: typeof customers[0]) => {
    setSelected(customer);
    setLoadingOrders(true);
    try {
      const orders = await getCustomerOrders(customer.email);
      setCustomerOrders(orders);
    } catch {
      setCustomerOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (confirm(`Are you sure you want to completely delete customer ${selected.name}? This will remove them from the table.`)) {
      setIsDeleting(true);
      try {
        await deleteCustomer(selected.id);
        setSelected(null);
        router.refresh(); // Or rely on revalidatePath
      } catch (err) {
        console.error("Failed to delete", err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const totalSpentAll = customers.reduce((s, c) => s + Number(c.total_spent ?? 0), 0);
  const avgValue = customers.filter((c) => Number(c.total_spent) > 0).length > 0
    ? Math.round(totalSpentAll / customers.filter((c) => Number(c.total_spent) > 0).length)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-mono uppercase tracking-widest text-white/30 mb-1">Management</p>
        <h1 className="text-2xl font-heading font-bold text-white">Customers</h1>
        <p className="text-sm text-white/40 mt-1">{customers.length} registered clients</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Clients", value: customers.length, icon: Users, color: "text-violet-400", bg: "bg-violet-400/10" },
          { label: "Avg. Order Value", value: `₹${avgValue.toLocaleString("en-IN")}`, icon: CurrencyInr, color: "text-brand-accent", bg: "bg-brand-accent/10" },
          { label: "Total Revenue", value: `₹${totalSpentAll.toLocaleString("en-IN")}`, icon: ListBullets, color: "text-blue-400", bg: "bg-blue-400/10" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 flex items-center gap-3">
            <div className={`h-9 w-9 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`h-4 w-4 ${s.color}`} weight="bold" />
            </div>
            <div>
              <p className="text-[10px] text-white/30">{s.label}</p>
              <p className="text-lg font-heading font-bold text-white">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, institution..."
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-brand-accent/50 transition" />
      </div>

      {/* Customer grid */}
      {filtered.length === 0 ? (
        <p className="text-white/30 text-sm text-center py-20">No customers found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((customer, i) => (
            <motion.button key={customer.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.35 }}
              onClick={() => handleSelectCustomer(customer)}
              className="text-left rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 hover:bg-white/[0.04] hover:border-white/[0.1] transition group">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {customer.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) ?? "?"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white/80 group-hover:text-white transition truncate">{customer.name}</p>
                  {customer.institution && <p className="text-xs text-white/30 truncate">{customer.institution}</p>}
                </div>
                <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-brand-accent group-hover:translate-x-0.5 transition-all ml-auto flex-shrink-0" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <Envelope className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{customer.email}</span>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{customer.phone}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.06] grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider">Orders</p>
                  <p className="text-sm font-semibold text-white/70 mt-0.5">{customer.total_orders}</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider">Spent</p>
                  <p className="text-sm font-semibold text-white/70 mt-0.5">
                    {Number(customer.total_spent) > 0 ? `₹${Number(customer.total_spent).toLocaleString("en-IN")}` : "—"}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Order history drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setSelected(null)} />
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0d1410] border-l border-white/[0.08] z-50 flex flex-col overflow-y-auto">
              <div className="flex items-center gap-4 p-6 border-b border-white/[0.06]">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white font-bold flex-shrink-0">
                  {selected.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-heading font-bold text-white truncate">{selected.name}</h2>
                  {selected.institution && <p className="text-xs text-white/40 mt-0.5 truncate">{selected.institution}</p>}
                </div>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition"
                  title="Delete Customer"
                >
                  <Trash className="h-4 w-4" />
                </button>
                <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-white/5 transition text-white/40">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 border-b border-white/[0.06] space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Envelope className="h-4 w-4 text-white/30 flex-shrink-0" />
                  <span className="text-white/60 break-all">{selected.email}</span>
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-white/30 flex-shrink-0" />
                    <span className="text-white/60">{selected.phone}</span>
                  </div>
                )}
                {selected.institution && (
                  <div className="flex items-center gap-3 text-sm">
                    <Buildings className="h-4 w-4 text-white/30 flex-shrink-0" />
                    <span className="text-white/60">{selected.institution}</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 p-6 border-b border-white/[0.06]">
                <div className="rounded-xl bg-white/[0.03] p-4">
                  <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider mb-1">Orders</p>
                  <p className="text-xl font-bold text-white">{selected.total_orders}</p>
                </div>
                <div className="rounded-xl bg-white/[0.03] p-4">
                  <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider mb-1">Total Spent</p>
                  <p className="text-xl font-bold text-white">
                    {Number(selected.total_spent) > 0 ? `₹${Number(selected.total_spent).toLocaleString("en-IN")}` : "₹0"}
                  </p>
                </div>
              </div>
              <div className="p-6 flex-1">
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-4">Order History</p>
                {loadingOrders ? (
                  <p className="text-white/30 text-sm text-center py-8">Loading...</p>
                ) : customerOrders.length === 0 ? (
                  <p className="text-white/20 text-sm text-center py-8">No orders found.</p>
                ) : (
                  <div className="space-y-3">
                    {customerOrders.map((order) => (
                      <div key={order.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                        <div className="flex justify-between mb-2">
                          <p className="text-xs font-mono text-white/30">{order.order_no}</p>
                          <span className="text-xs font-mono text-white/50">₹{Number(order.price).toLocaleString("en-IN")}</span>
                        </div>
                        <p className="text-sm font-medium text-white/70">{order.service}</p>
                        {order.topic && <p className="text-xs text-white/30 mt-1 line-clamp-2">{order.topic}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
