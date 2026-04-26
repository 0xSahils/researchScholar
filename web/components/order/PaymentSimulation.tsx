"use client";

import { useState, useTransition } from "react";
import { ArrowLeft, LockKey, Spinner, Phone, ShieldCheck, CheckCircle } from "@phosphor-icons/react";
import type { OrderServiceType } from "./OrderComposition";
import { motion, AnimatePresence } from "framer-motion";
import { createOrder, markOrderPaid } from "@/lib/actions/orders";
import { applyGst, fmtINR } from "@/lib/gst";

// ─── Razorpay types ───────────────────────────────────
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

// ─── Component ────────────────────────────────────────
export function PaymentSimulation({
  service,
  gstRate,
  onSuccess,
  onBack,
}: {
  service: OrderServiceType;
  gstRate: number;
  onSuccess: (orderNo: string) => void;
  onBack: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailForOtp, setEmailForOtp] = useState("");
  const [phoneForOtp, setPhoneForOtp] = useState("");

  const { base, gstAmount, total } = applyGst(service.basePrice, gstRate);

  const handlePayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);
    const firstName = fd.get("firstName") as string;
    const lastName  = fd.get("lastName")  as string;
    const email     = fd.get("email")     as string;
    const phone     = fd.get("phone")     as string;
    const topic     = fd.get("topic")     as string;
    const requirements = fd.get("requirements") as string;
    const fullName  = `${firstName} ${lastName}`.trim();

    startTransition(async () => {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError("Failed to load Razorpay. Check your internet connection.");
        return;
      }

      const orderResult = await createOrder({
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        service: service.title,
        price: total,
        topic: topic || undefined,
        requirements: requirements || undefined,
        paymentStatus: "unpaid",
        workStatus: "pending",
        verification: { emailVerified, phoneVerified },
      });

      if (!orderResult.success || !orderResult.orderId || !orderResult.orderNo) {
        setError(orderResult.error ?? "Could not create your order. Please try again.");
        return;
      }

      const savedOrderId = orderResult.orderId;
      const savedOrderNo = orderResult.orderNo;

      const rzpRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          currency: "INR",
          receipt: savedOrderNo,
          notes: { order_id: savedOrderId },
        }),
      });

      if (!rzpRes.ok) {
        setError("Could not initiate payment. Please try again.");
        return;
      }

      const rzpOrder = await rzpRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: "ResearchScholars",
        description: service.title,
        order_id: rzpOrder.id,
        prefill: { name: fullName, email, contact: phone },
        theme: { color: "#1B5E20" },
        modal: {
          ondismiss: () => {
            setError("Payment was cancelled.");
          },
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          setProcessing(true);

          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();

          if (!verifyData.success) {
            setProcessing(false);
            setError("Payment verification failed. Contact support with payment ID: " + response.razorpay_payment_id);
            return;
          }

          await markOrderPaid(savedOrderId, {
            amount: total,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            method: "Razorpay",
          });

          onSuccess(savedOrderNo);
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (res: { error: { description: string } }) => {
        setError(`Payment failed: ${res.error.description}`);
      });
      rzp.open();
    });
  };

  return (
    <>
      {/* Processing overlay */}
      <AnimatePresence>
        {processing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              className="flex flex-col items-center gap-6 text-center px-6"
            >
              <div className="relative h-20 w-20">
                <div className="absolute inset-0 rounded-full border-4 border-brand-light" />
                <div className="absolute inset-0 rounded-full border-4 border-t-brand-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-brand-primary" weight="fill" />
                </div>
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-ink">Confirming your order…</h2>
                <p className="mt-2 text-sm text-ink-muted">Payment received. Saving your order details.</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-ink-muted">
                <Spinner className="h-4 w-4 animate-spin" />
                This takes just a moment
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main card */}
      <section className="relative flex flex-1 items-center justify-center py-12 px-6">
      <div className="absolute inset-0 bg-brand-deep/5 backdrop-blur-3xl z-0 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-4xl overflow-hidden rounded-[2rem] border border-surface-line bg-white shadow-diffusion flex flex-col md:flex-row"
      >
        {/* Left pane — Cart Summary */}
        <div className="bg-surface-subtle p-8 md:w-5/12 lg:w-4/12 border-b md:border-b-0 md:border-r border-surface-line/60">
          <button
            onClick={onBack}
            className="group mb-8 flex w-fit items-center gap-2 text-sm font-medium text-ink-muted transition hover:text-brand-primary"
            disabled={isPending}
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
            Back to packages
          </button>

          <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-accent mb-2">
            Order Summary
          </h2>
          <h3 className="font-heading text-2xl font-bold text-ink mb-6">
            {service.title} Package
          </h3>

          {/* GST Breakdown */}
          <div className="space-y-2 border-t border-surface-line pt-6">
            <div className="flex justify-between text-sm text-ink-muted">
              <span>Base price</span>
              <span>{fmtINR(base)}</span>
            </div>
            {gstRate > 0 && (
              <div className="flex justify-between text-sm text-ink-muted">
                <span>GST ({gstRate}%)</span>
                <span>{fmtINR(gstAmount)}</span>
              </div>
            )}
            <div className="flex items-end justify-between border-t border-surface-line pt-2">
              <span className="text-sm font-medium text-ink-muted">Total Due</span>
              <span className="font-heading text-3xl font-bold text-ink">{fmtINR(total)}</span>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-8 space-y-2">
            {["Secure Razorpay checkout", "Instant confirmation email", "100% confidential"].map((t) => (
              <div key={t} className="flex items-center gap-2 text-xs text-ink-muted">
                <ShieldCheck className="h-4 w-4 text-brand-accent flex-shrink-0" weight="fill" />
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Right pane — Form */}
        <div className="p-8 md:w-7/12 lg:w-8/12">
          <form onSubmit={handlePayment} className="space-y-5">
            <h2 className="font-heading text-xl font-bold text-ink mb-4">Your Details</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-muted">First Name *</label>
                <input name="firstName" required disabled={isPending} type="text"
                  className="w-full rounded-lg border border-surface-line/80 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  placeholder="Rahul" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-muted">Last Name *</label>
                <input name="lastName" required disabled={isPending} type="text"
                  className="w-full rounded-lg border border-surface-line/80 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  placeholder="Sharma" />
              </div>
              <div className="col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-ink-muted">Email Address *</label>
                <input name="email" required disabled={isPending} type="email"
                  className="w-full rounded-lg border border-surface-line/80 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  placeholder="rahul@university.ac.in" />
              </div>
              <div className="col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-ink-muted">WhatsApp / Phone *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted/40" />
                  <input name="phone" required disabled={isPending} type="tel"
                    className="w-full rounded-lg border border-surface-line/80 bg-white pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                    placeholder="+91 98765 43210" />
                </div>
              </div>
              <div className="col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-ink-muted">Topic / Subject</label>
                <input name="topic" disabled={isPending} type="text"
                  className="w-full rounded-lg border border-surface-line/80 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  placeholder="e.g. Machine Learning in Healthcare" />
              </div>
              <div className="col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-ink-muted">Requirements / Notes</label>
                <textarea name="requirements" disabled={isPending} rows={2}
                  className="w-full rounded-lg border border-surface-line/80 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand-primary focus:ring-1 focus:ring-brand-primary resize-none"
                  placeholder="University, word count, deadline, guide name..." />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={async () => {
                  const emailEl = document.querySelector<HTMLInputElement>('input[name="email"]');
                  if (!emailEl?.value) return;
                  setEmailForOtp(emailEl.value);
                  await fetch("/api/verification/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "email", value: emailEl.value }) });
                }}
                className="rounded-btn border border-surface-line px-4 py-2 text-xs font-semibold text-ink"
              >
                Send Email OTP
              </button>
              <button
                type="button"
                onClick={async () => {
                  const phoneEl = document.querySelector<HTMLInputElement>('input[name="phone"]');
                  if (!phoneEl?.value) return;
                  setPhoneForOtp(phoneEl.value);
                  await fetch("/api/verification/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "phone", value: phoneEl.value }) });
                }}
                className="rounded-btn border border-surface-line px-4 py-2 text-xs font-semibold text-ink"
              >
                Send Phone OTP
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="flex gap-2">
                <input value={emailOtp} onChange={(event) => setEmailOtp(event.target.value)} placeholder="Email OTP" className="w-full rounded-lg border border-surface-line/80 bg-white px-3 py-2 text-sm" />
                <button type="button" className="rounded-btn border border-surface-line px-3 py-2 text-xs" onClick={async () => {
                  const res = await fetch("/api/verification/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "email", value: emailForOtp, code: emailOtp }) });
                  const json = await res.json();
                  setEmailVerified(Boolean(json.success));
                }}>Verify</button>
              </div>
              <div className="flex gap-2">
                <input value={phoneOtp} onChange={(event) => setPhoneOtp(event.target.value)} placeholder="Phone OTP" className="w-full rounded-lg border border-surface-line/80 bg-white px-3 py-2 text-sm" />
                <button type="button" className="rounded-btn border border-surface-line px-3 py-2 text-xs" onClick={async () => {
                  const res = await fetch("/api/verification/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "phone", value: phoneForOtp, code: phoneOtp }) });
                  const json = await res.json();
                  setPhoneVerified(Boolean(json.success));
                }}>Verify</button>
              </div>
            </div>

            <p className="text-xs text-ink-muted">
              Email verification: {emailVerified ? "✓ verified" : "pending"} · Phone verification: {phoneVerified ? "✓ verified" : "pending"}
            </p>

            <button
              type="submit"
              disabled={isPending || !emailVerified || !phoneVerified}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-btn bg-brand-primary px-6 py-4 text-base font-semibold text-white shadow-card transition hover:bg-brand-deep disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Spinner className="h-5 w-5 animate-spin" />
                  Opening Razorpay...
                </>
              ) : (
                <>
                  <LockKey className="h-5 w-5" weight="bold" />
                  Pay {fmtINR(total)} via Razorpay
                </>
              )}
            </button>
            <p className="text-center text-xs text-ink-muted">
              Secured by Razorpay · UPI · Cards · Net Banking
            </p>
          </form>
        </div>
      </motion.div>
    </section>
    </>
  );
}
