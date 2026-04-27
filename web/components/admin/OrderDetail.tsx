"use client";

import { useRef, useState, useTransition } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarBlank,
  CheckCircle,
  ClipboardText,
  CurrencyInr,
  Envelope,
  FileText,
  PencilSimple,
  Spinner,
  UploadSimple,
  WhatsappLogo,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  addManualPayment,
  getPaymentTransactions,
  saveOrderPricing,
  sendDeliveryDocumentOneClick,
  updateAssignedExpert,
  updateOrderInternalNotes,
  updateOrderPaymentStatus,
  updateOrderStatus,
  uploadDeliveryFile,
} from "@/lib/actions/orders";
import { sendOrderConfirmationAsAdmin, deleteOrder } from "@/lib/actions/admin";
import { sendDeliveryEmail, sendWhatsAppDelivery } from "@/lib/actions/notifications";
import { displayPaymentStatus, toDbPaymentStatus } from "@/lib/orders/db-maps";

type OrderStatus =
  | "pending"
  | "assigned"
  | "in_progress"
  | "under_review"
  | "completed"
  | "delivered"
  | "revision_requested"
  | "cancelled";

const statusMeta: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "text-slate-300", bg: "bg-slate-500/10 border-slate-500/20" },
  assigned: { label: "Assigned", color: "text-blue-300", bg: "bg-blue-500/10 border-blue-500/20" },
  in_progress: { label: "In Progress", color: "text-amber-300", bg: "bg-amber-500/10 border-amber-500/20" },
  under_review: { label: "Under Review", color: "text-purple-300", bg: "bg-purple-500/10 border-purple-500/20" },
  completed: { label: "Completed", color: "text-teal-300", bg: "bg-teal-500/10 border-teal-500/20" },
  delivered: { label: "Delivered", color: "text-emerald-300", bg: "bg-emerald-500/10 border-emerald-500/20" },
  revision_requested: { label: "Revision", color: "text-orange-300", bg: "bg-orange-500/10 border-orange-500/20" },
  cancelled: { label: "Cancelled", color: "text-red-300", bg: "bg-red-500/10 border-red-500/20" },
};

const statusFlow: OrderStatus[] = [
  "pending",
  "assigned",
  "in_progress",
  "under_review",
  "completed",
  "delivered",
  "revision_requested",
];

const paymentUiOptions = [
  { value: "pending", label: "Unpaid" },
  { value: "partial", label: "Advance paid" },
  { value: "paid", label: "Fully paid" },
  { value: "refunded", label: "Refunded" },
];

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
      <div>
        <p className="text-[10px] font-mono uppercase tracking-wider text-white/30">{label}</p>
        <p className="text-sm text-white/80 break-all">{value || "—"}</p>
      </div>
      <button
        type="button"
        onClick={() => {
          if (!value) return;
          void navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="shrink-0 rounded-lg p-2 text-white/40 hover:bg-white/5 hover:text-white"
        aria-label={`Copy ${label}`}
      >
        <ClipboardText className="h-4 w-4" />
      </button>
      {copied ? <span className="text-[10px] text-emerald-400">Copied</span> : null}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function OrderDetail({ order, transactions: initialTx }: { order: any; transactions?: any[] }) {
  const [status, setStatus] = useState<OrderStatus>(order.work_status ?? order.status);
  const [internalNotes, setInternalNotes] = useState<string>(order.internal_notes ?? order.notes ?? "");
  const [expert, setExpert] = useState<string>(order.assigned_expert ?? "");
  const [paymentUi, setPaymentUi] = useState(order.payment_status ?? "pending");
  const [deliveredFile, setDeliveredFile] = useState<string | null>(order.delivered_file ?? null);
  const [versionLabel, setVersionLabel] = useState("v1");
  const [gstRate, setGstRate] = useState(String(order.gst_rate ?? 18));
  const [totalAmount, setTotalAmount] = useState(String(order.total_amount ?? order.price ?? 0));
  const [advanceAmount, setAdvanceAmount] = useState(String(order.advance_amount ?? ""));
  const [tx, setTx] = useState(initialTx ?? []);
  const [notifMsg, setNotifMsg] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  // Inline manual payment form state
  const [showPayForm, setShowPayForm] = useState(false);
  const [payFormAmount, setPayFormAmount] = useState("");
  const [payFormMethod, setPayFormMethod] = useState("UPI");
  const defaultPayType = order.payment_status === "partial" ? "balance" : "advance";
  const [payFormType, setPayFormType] = useState<"advance" | "balance" | "full">(defaultPayType);
  const [payFormRef, setPayFormRef] = useState("");
  const [payFormNotes, setPayFormNotes] = useState("");

  const sm = statusMeta[status] ?? statusMeta.pending;

  const deadline = order.deadline
    ? new Date(order.deadline).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })
    : "Not set";
  const overdue = order.deadline && new Date(order.deadline) < new Date() && !["completed", "delivered"].includes(status);

  const reloadTx = () => {
    startTransition(async () => {
      const rows = await getPaymentTransactions(order.id);
      setTx(rows);
    });
  };

  const handleStatusChange = (s: OrderStatus) => {
    setStatus(s);
    startTransition(async () => {
      await updateOrderStatus(order.id, s);
    });
  };

  const handleSaveInternal = () => {
    startTransition(async () => {
      await updateOrderInternalNotes(order.id, internalNotes);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  const handleExpertBlur = () => {
    startTransition(async () => {
      await updateAssignedExpert(order.id, expert);
    });
  };

  const handlePaymentSelect = (v: string) => {
    setPaymentUi(v);
    startTransition(async () => {
      await updateOrderPaymentStatus(order.id, v);
    });
  };

  const paymentSelectValue = paymentUiOptions.some((o) => o.value === paymentUi) ? paymentUi : "pending";

  const handleSavePricing = () => {
    const total = Number(totalAmount);
    const gst = Number(gstRate);
    const gstAmt = total * (gst / 100) || 0;
    const adv = advanceAmount ? Number(advanceAmount) : Math.round(total * 0.5);
    startTransition(async () => {
      await saveOrderPricing(order.id, {
        total_amount: total,
        gst_rate: gst,
        gst_amount: gstAmt,
        advance_amount: adv,
        balance_amount: Math.max(0, total - adv),
      });
      setNotifMsg("Pricing saved.");
      setTimeout(() => setNotifMsg(null), 3000);
    });
  };

  const handleQuickUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    startTransition(async () => {
      const result = await uploadDeliveryFile(order.id, fd);
      if (result.url) setDeliveredFile(result.url);
      else setNotifMsg(result.error ?? "Upload failed");
    });
  };

  const handleSendOneClick = () => {
    const input = fileRef.current?.files?.[0];
    if (!input) return setNotifMsg("Choose a PDF or DOCX file first.");
    const fd = new FormData();
    fd.append("file", input);
    startTransition(async () => {
      const res = await sendDeliveryDocumentOneClick(order.id, fd, versionLabel);
      setNotifMsg(res.success ? "Document sent and logged." : res.error ?? "Failed");
      if (res.success) {
        setDeliveredFile(null);
        reloadTx();
      }
      setTimeout(() => setNotifMsg(null), 5000);
    });
  };

  const handleManualPayment = () => {
    const amount = Number(payFormAmount);
    if (!amount || Number.isNaN(amount)) {
      setNotifMsg("Enter a valid amount.");
      return;
    }
    startTransition(async () => {
      await addManualPayment({
        orderId: order.id,
        amount,
        method: payFormMethod,
        type: payFormType,
        referenceNumber: payFormRef || undefined,
        notes: payFormNotes || undefined,
      });
      reloadTx();
      setShowPayForm(false);
      setPayFormAmount("");
      setPayFormRef("");
      setPayFormNotes("");
      setNotifMsg("Payment recorded.");
      setTimeout(() => setNotifMsg(null), 3000);
    });
  };

  const deliveryFiles = Array.isArray(order.delivery_files) ? order.delivery_files : [];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/admin/orders"
            className="group inline-flex items-center gap-2 text-xs text-white/30 transition hover:text-white/60"
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
            All orders
          </Link>
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => {
              if (confirm(`Are you absolutely sure you want to delete order ${order.order_no}? This action cannot be undone.`)) {
                setIsDeleting(true);
                startTransition(async () => {
                  await deleteOrder(order.id);
                  router.push("/admin/orders");
                });
              }
            }}
            className="text-xs text-red-500/80 hover:text-red-400 font-medium transition"
          >
            {isDeleting ? "Deleting..." : "Delete Order"}
          </button>
        </div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-white/30">Order · {order.order_no}</p>
            <h1 className="font-heading text-2xl font-bold leading-tight text-white">{order.customer_name}</h1>
            <p className="mt-1 text-sm text-white/40">{order.service}</p>
          </div>
          <span className={`inline-flex items-center rounded-xl border px-3 py-1.5 text-sm font-medium ${sm.bg} ${sm.color}`}>
            {sm.label}
          </span>
        </div>
      </div>

      {notifMsg ? (
        <div className="rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-3 text-sm text-white/80">{notifMsg}</div>
      ) : null}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Work */}
        <div className="space-y-5">
          <div className="border-t-4 border-brand-primary pt-2">
            <h2 className="font-mono text-xs uppercase tracking-widest text-white/50">Work status</h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
          >
            <p className="mb-2 text-[10px] font-mono uppercase tracking-widest text-white/30">Customer</p>
            <CopyRow label="Email" value={order.customer_email} />
            <CopyRow label="Phone" value={order.customer_phone ?? ""} />
          </motion.div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="mb-2 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/30">
              <CalendarBlank className="h-3.5 w-3.5" />
              Deadline
            </p>
            <p className={`text-sm font-medium ${overdue ? "text-red-400" : "text-white/80"}`}>
              {deadline}
              {overdue ? " · Overdue" : ""}
            </p>
          </div>

          {order.topic ? (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="mb-2 text-[10px] font-mono uppercase tracking-widest text-white/30">Topic</p>
              <p className="text-sm text-white/80">{order.topic}</p>
            </div>
          ) : null}

          {order.requirements ? (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="mb-2 text-[10px] font-mono uppercase tracking-widest text-white/30">Instructions</p>
              <p className="whitespace-pre-line text-sm text-white/60">{order.requirements}</p>
            </div>
          ) : null}

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <label className="mb-2 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/30">
              <PencilSimple className="h-3.5 w-3.5" />
              Assigned expert
            </label>
            <input
              value={expert}
              onChange={(e) => setExpert(e.target.value)}
              onBlur={handleExpertBlur}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white/80 outline-none focus:border-brand-accent/40"
              placeholder="PhD lead name"
            />
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="mb-3 text-[10px] font-mono uppercase tracking-widest text-white/30">Work status</p>
            <div className="space-y-2">
              {statusFlow.map((s) => {
                const meta = statusMeta[s];
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleStatusChange(s)}
                    disabled={isPending}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                      status === s
                        ? `${meta.bg} ${meta.color} border-current/20`
                        : "border-white/[0.04] text-white/40 hover:bg-white/[0.03] hover:text-white/60"
                    }`}
                  >
                    <CheckCircle className={`h-4 w-4 ${status === s ? "opacity-100" : "opacity-30"}`} weight={status === s ? "fill" : "regular"} />
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="mb-2 text-[10px] font-mono uppercase tracking-widest text-white/30">Internal notes</p>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              onBlur={handleSaveInternal}
              rows={4}
              className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white/70 outline-none focus:border-brand-accent/40"
            />
            {saved ? <p className="mt-1 text-xs text-emerald-400">Saved</p> : null}
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/30">Delivery documents</p>
            {deliveryFiles.length ? (
              <ul className="space-y-2 text-xs text-white/60">
                {deliveryFiles.map((f: { url: string; version?: string; sent_at?: string }, i: number) => (
                  <li key={i} className="flex items-center gap-2">
                    <FileText className="h-4 w-4 shrink-0 text-brand-accent" />
                    <a href={f.url} className="truncate text-brand-accent underline" target="_blank" rel="noreferrer">
                      {f.version ?? "file"} · {f.sent_at?.slice(0, 10) ?? ""}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-white/30">No sent documents yet.</p>
            )}
            <input ref={fileRef} type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="text-xs text-white/50" />
            <input
              value={versionLabel}
              onChange={(e) => setVersionLabel(e.target.value)}
              placeholder="Version label"
              className="w-full rounded-lg border border-white/[0.08] bg-transparent px-2 py-1.5 text-sm"
            />
            <button
              type="button"
              onClick={handleSendOneClick}
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {isPending ? <Spinner className="h-4 w-4 animate-spin" /> : <UploadSimple className="h-4 w-4" />}
              Send document to customer
            </button>
            <label className="flex cursor-pointer flex-col items-center gap-1 rounded-xl border border-dashed border-white/10 p-3 text-xs text-white/40 hover:border-brand-accent/30">
              Quick upload only
              <input type="file" accept=".pdf,.docx" className="hidden" onChange={handleQuickUpload} disabled={isPending} />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  if (!deliveredFile) return;
                  startTransition(async () => {
                    await sendDeliveryEmail(
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
                    setNotifMsg("Email sent.");
                    setTimeout(() => setNotifMsg(null), 3000);
                  });
                }}
                disabled={!deliveredFile}
                className="flex items-center justify-center gap-1 rounded-xl border border-blue-500/30 py-2 text-xs text-blue-300 disabled:opacity-40"
              >
                <Envelope className="h-4 w-4" weight="bold" />
                Email only
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!order.customer_phone || !deliveredFile) return;
                  startTransition(async () => {
                    await sendWhatsAppDelivery(order.customer_phone, {
                      orderNo: order.order_no,
                      orderId: order.id,
                      customerName: order.customer_name,
                      customerEmail: order.customer_email,
                      service: order.service,
                      price: Number(order.price),
                    }, deliveredFile);
                    setNotifMsg("WhatsApp sent.");
                    setTimeout(() => setNotifMsg(null), 3000);
                  });
                }}
                disabled={!deliveredFile || !order.customer_phone}
                className="flex items-center justify-center gap-1 rounded-xl border border-green-500/30 py-2 text-xs text-green-300 disabled:opacity-40"
              >
                <WhatsappLogo className="h-4 w-4" weight="bold" />
                WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="space-y-5">
          <div className="border-t-4 border-brand-gold pt-2">
            <h2 className="font-mono text-xs uppercase tracking-widest text-white/50">Payment status</h2>
            <p className="mt-1 text-sm text-white/60">
              Current: <span className="font-semibold text-white">{displayPaymentStatus(paymentUi)}</span>
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/30">Pricing</p>
            <div className="grid gap-2">
              <label className="text-xs text-white/50">
                Total (₹)
                <input
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/[0.08] bg-transparent px-2 py-1.5 text-sm text-white"
                />
              </label>
              <label className="text-xs text-white/50">
                GST %
                <input
                  value={gstRate}
                  onChange={(e) => setGstRate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/[0.08] bg-transparent px-2 py-1.5 text-sm text-white"
                />
              </label>
              {paymentSelectValue !== "paid" && (
                <label className="text-xs text-white/50">
                  Advance (₹) optional
                  <input
                    value={advanceAmount}
                    onChange={(e) => setAdvanceAmount(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/[0.08] bg-transparent px-2 py-1.5 text-sm text-white"
                    placeholder="default 50% of total"
                  />
                </label>
              )}
            </div>
            <button
              type="button"
              onClick={handleSavePricing}
              disabled={isPending}
              className="w-full rounded-xl bg-white/10 py-2 text-sm font-semibold text-white hover:bg-white/15"
            >
              Save pricing
            </button>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <label className="mb-2 block text-[10px] font-mono uppercase tracking-widest text-white/30">Payment status</label>
            <select
              value={paymentSelectValue}
              onChange={(e) => handlePaymentSelect(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-[#0d1410] px-3 py-2 text-sm text-white"
            >
              {paymentUiOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* ── Add Manual Payment (inline form) ── */}
          {paymentSelectValue !== "paid" && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              <button
                type="button"
                onClick={() => setShowPayForm((v) => !v)}
                className="flex w-full items-center justify-between px-4 py-3 text-sm text-white/80 hover:bg-white/5 transition"
              >
                <span className="font-semibold">+ Record manual payment</span>
                <span className="text-white/30 text-xs">{showPayForm ? "▲ Close" : "▼ Open"}</span>
              </button>
              {showPayForm && (
                <div className="border-t border-white/[0.06] px-4 py-4 space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[10px] uppercase tracking-widest text-white/30">Amount (₹) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-white/40">₹</span>
                      <input
                        type="number"
                        value={payFormAmount}
                        onChange={(e) => setPayFormAmount(e.target.value)}
                        placeholder="0"
                        className="w-full rounded-lg border border-white/[0.1] bg-white/[0.02] pl-6 pr-3 py-2 text-sm text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] uppercase tracking-widest text-white/30">Payment Method</label>
                    <select value={payFormMethod} onChange={(e) => setPayFormMethod(e.target.value)}
                      className="w-full rounded-lg border border-white/[0.1] bg-[#0d1410] px-3 py-2 text-sm text-white">
                      {["UPI", "Cash", "Bank Transfer", "NEFT/RTGS", "Net Banking", "Card", "Cheque", "Other"].map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] uppercase tracking-widest text-white/30">Payment Type</label>
                    <select value={payFormType} onChange={(e) => setPayFormType(e.target.value as "advance" | "balance" | "full")}
                      className="w-full rounded-lg border border-white/[0.1] bg-[#0d1410] px-3 py-2 text-sm text-white">
                      {paymentSelectValue !== "partial" && <option value="advance">Advance</option>}
                      <option value="balance">Balance</option>
                      <option value="full">Full Payment</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] uppercase tracking-widest text-white/30">Reference / UTR No.</label>
                    <input
                      value={payFormRef}
                      onChange={(e) => setPayFormRef(e.target.value)}
                      placeholder="Optional"
                      className="w-full rounded-lg border border-white/[0.1] bg-white/[0.02] px-3 py-2 text-sm text-white placeholder:text-white/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-widest text-white/30">Admin Note (internal only)</label>
                  <input
                    value={payFormNotes}
                    onChange={(e) => setPayFormNotes(e.target.value)}
                    placeholder="e.g. Received via family UPI"
                    className="w-full rounded-lg border border-white/[0.1] bg-white/[0.02] px-3 py-2 text-sm text-white placeholder:text-white/20"
                  />
                </div>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={handleManualPayment}
                  className="w-full rounded-xl bg-brand-primary py-2.5 text-sm font-semibold text-white hover:bg-brand-deep disabled:opacity-60 transition"
                >
                  {isPending ? "Saving…" : "Record Payment"}
                </button>
              </div>
              )}
            </div>
          )}

          {/* ── Send Confirmation Email ── */}
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                const result = await sendOrderConfirmationAsAdmin(order.id);
                setNotifMsg(result.success ? "✅ Confirmation email sent to customer." : `❌ Failed: ${result.error}`);
                setTimeout(() => setNotifMsg(null), 4000);
              })
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-500/30 bg-blue-900/10 py-2.5 text-sm font-semibold text-blue-300 hover:bg-blue-900/20 disabled:opacity-50 transition"
          >
            <Envelope className="h-4 w-4" weight="bold" />
            Send Order Confirmation Email
          </button>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/30">Transactions</p>
              <button type="button" onClick={reloadTx} className="text-[10px] text-brand-accent">
                Refresh
              </button>
            </div>
            {tx.length === 0 ? (
              <p className="text-xs text-white/30">No transactions.</p>
            ) : (
              <ul className="max-h-48 space-y-2 overflow-y-auto text-xs">
                {tx.map((t: { id: string; amount: number; method: string; type: string; created_at: string; status: string }) => (
                  <li key={t.id} className="flex justify-between gap-2 border-b border-white/[0.04] pb-2 text-white/70">
                    <span>
                      ₹{Number(t.amount).toLocaleString("en-IN")} · {t.type}
                    </span>
                    <span className="text-white/40">{new Date(t.created_at).toLocaleDateString("en-IN")}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] p-3 text-sm text-white/60">
            <CurrencyInr className="h-5 w-5 text-brand-accent" />
            Order value (legacy column): ₹{Number(order.price).toLocaleString("en-IN")}
          </div>
        </div>
      </div>
    </div>
  );
}
