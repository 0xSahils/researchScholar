"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  UploadSimple,
  PencilSimple,
  FileText,
  Envelope,
  CalendarBlank,
  CurrencyInr,
  WhatsappLogo,
  Spinner,
} from "@phosphor-icons/react";
import Link from "next/link";
import {
  updateOrderStatus,
  updateOrderNotes,
  uploadDeliveryFile,
} from "@/lib/actions/orders";
import {
  sendDeliveryEmail,
  sendWhatsAppDelivery,
} from "@/lib/actions/notifications";

type OrderStatus = "pending" | "in_progress" | "revision" | "delivered" | "completed" | "cancelled";

const statusMeta: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  in_progress: { label: "In Progress", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
  revision: { label: "Revision", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20" },
  delivered: { label: "Delivered", color: "text-teal-400", bg: "bg-teal-400/10 border-teal-400/20" },
  completed: { label: "Completed", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
  cancelled: { label: "Cancelled", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" },
};

const statusFlow: OrderStatus[] = ["pending", "in_progress", "revision", "delivered", "completed"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function OrderDetail({ order }: { order: any }) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [notes, setNotes] = useState<string>(order.notes ?? "");
  const [deliveredFile, setDeliveredFile] = useState<string | null>(order.delivered_file ?? null);
  const [saved, setSaved] = useState(false);
  const [notifMsg, setNotifMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const sm = statusMeta[status];

  const deadline = order.deadline
    ? new Date(order.deadline).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })
    : "Not set";
  const createdAt = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

  const handleStatusChange = (s: OrderStatus) => {
    setStatus(s);
    startTransition(async () => {
      await updateOrderStatus(order.id, s);
    });
  };

  const handleSaveNotes = () => {
    startTransition(async () => {
      await updateOrderNotes(order.id, notes);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    startTransition(async () => {
      const result = await uploadDeliveryFile(order.id, fd);
      if (result.url) setDeliveredFile(result.url);
      else alert("Upload failed: " + result.error);
    });
  };

  const handleSendEmail = () => {
    if (!deliveredFile) return alert("Upload a delivery file first.");
    startTransition(async () => {
      const result = await sendDeliveryEmail(
        {
          orderNo: order.order_no,
          orderId: order.id,
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          customerPhone: order.customer_phone,
          service: order.service,
          price: Number(order.price),
        },
        deliveredFile
      );
      setNotifMsg(result.success ? "✅ Email sent to customer!" : `❌ ${result.error}`);
      setTimeout(() => setNotifMsg(null), 4000);
    });
  };

  const handleSendWhatsApp = () => {
    if (!order.customer_phone) return alert("No phone number for this customer.");
    if (!deliveredFile) return alert("Upload a delivery file first.");
    startTransition(async () => {
      const result = await sendWhatsAppDelivery(
        order.customer_phone,
        {
          orderNo: order.order_no,
          orderId: order.id,
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          service: order.service,
          price: Number(order.price),
        },
        deliveredFile
      );
      setNotifMsg(result.success ? "✅ WhatsApp sent!" : `❌ ${result.error}`);
      setTimeout(() => setNotifMsg(null), 4000);
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back */}
      <div>
        <Link href="/admin/orders" className="group inline-flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition mb-4">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          All orders
        </Link>
        <div className="flex flex-wrap items-start gap-4 justify-between">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-widest text-white/30 mb-1">Order · {order.order_no}</p>
            <h1 className="text-2xl font-heading font-bold text-white leading-tight">{order.customer_name}</h1>
            <p className="text-sm text-white/40 mt-1">{order.service}</p>
          </div>
          <span className={`inline-flex items-center text-sm font-medium px-3 py-1.5 rounded-xl border ${sm.bg} ${sm.color}`}>
            {sm.label}
          </span>
        </div>
      </div>

      {notifMsg && (
        <div className="rounded-xl bg-white/[0.05] border border-white/[0.1] px-4 py-3 text-sm text-white/80">
          {notifMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Details + Requirements */}
        <div className="lg:col-span-2 space-y-5">
          {/* Meta */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 grid grid-cols-2 gap-4">
            {[
              { icon: Envelope, label: "Email", value: order.customer_email },
              { icon: CurrencyInr, label: "Amount", value: `₹${Number(order.price).toLocaleString("en-IN")} · ${order.payment_status}` },
              { icon: CalendarBlank, label: "Deadline", value: deadline },
              { icon: Clock, label: "Created", value: createdAt },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4 text-white/40" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider">{label}</p>
                  <p className="text-sm text-white/70 mt-0.5 break-all">{value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Topic */}
          {order.topic && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06, duration: 0.4 }}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-2">Topic</p>
              <p className="text-sm text-white/80 leading-relaxed">{order.topic}</p>
            </motion.div>
          )}

          {/* Requirements */}
          {order.requirements && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.4 }}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-2">Requirements</p>
              <p className="text-sm text-white/60 leading-relaxed whitespace-pre-line">{order.requirements}</p>
            </motion.div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="space-y-5">
          {/* Status toggle */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.4 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-4">Update Status</p>
            <div className="space-y-2">
              {statusFlow.map((s) => {
                const meta = statusMeta[s];
                return (
                  <button key={s} onClick={() => handleStatusChange(s)} disabled={isPending}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                      status === s ? `${meta.bg} ${meta.color} border-current/20` : "border-white/[0.04] text-white/40 hover:text-white/60 hover:bg-white/[0.03]"
                    }`}>
                    <CheckCircle className={`h-4 w-4 ${status === s ? "opacity-100" : "opacity-30"}`} weight={status === s ? "fill" : "regular"} />
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Notes */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.4 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-3">Internal Notes</p>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
              placeholder="Scholar assigned, revision feedback..."
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white/70 placeholder:text-white/20 outline-none focus:border-brand-accent/40 transition resize-none" />
            <button onClick={handleSaveNotes} disabled={isPending}
              className={`mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                saved ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                  : "bg-brand-primary hover:bg-brand-deep text-white"}`}>
              {isPending ? <Spinner className="h-4 w-4 animate-spin" /> : saved ? <><CheckCircle className="h-4 w-4" weight="bold" />Saved!</> : <><PencilSimple className="h-4 w-4" weight="bold" />Save Notes</>}
            </button>
          </motion.div>

          {/* File Upload + Send */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.30, duration: 0.4 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3">
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/30">Delivery File</p>
            {deliveredFile ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-primary/10 border border-brand-primary/20">
                <FileText className="h-4 w-4 text-brand-accent flex-shrink-0" />
                <p className="text-xs text-brand-accent font-mono truncate">File uploaded ✓</p>
              </div>
            ) : (
              <label className="flex flex-col items-center gap-2 p-4 border border-dashed border-white/[0.1] rounded-xl cursor-pointer hover:border-brand-accent/30 hover:bg-brand-accent/5 transition">
                {isPending ? <Spinner className="h-5 w-5 text-white/30 animate-spin" /> : <UploadSimple className="h-5 w-5 text-white/30" />}
                <span className="text-xs text-white/30">{isPending ? "Uploading..." : "Click to upload final file"}</span>
                <input type="file" className="hidden" onChange={handleFileUpload} disabled={isPending} />
              </label>
            )}

            {/* Send buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button onClick={handleSendEmail} disabled={isPending || !deliveredFile}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition disabled:opacity-40 disabled:cursor-not-allowed">
                <Envelope className="h-4 w-4" weight="bold" />
                Send Email
              </button>
              <button onClick={handleSendWhatsApp} disabled={isPending || !deliveredFile || !order.customer_phone}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition disabled:opacity-40 disabled:cursor-not-allowed">
                <WhatsappLogo className="h-4 w-4" weight="bold" />
                WhatsApp
              </button>
            </div>
            {!order.customer_phone && (
              <p className="text-[10px] text-white/25 text-center">No phone on file — WhatsApp unavailable</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
