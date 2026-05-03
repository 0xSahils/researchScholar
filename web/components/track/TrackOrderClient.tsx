"use client";

import { ArrowRight, CheckCircle, Clock, Envelope, Printer, Spinner, WhatsappLogo } from "@phosphor-icons/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { siteConfig, whatsappHref } from "@/lib/site-config";
import { getOrderByNumber } from "@/lib/actions/track";
import { fmtINR } from "@/lib/gst";

const statusSteps: { key: string; label: string; sub: string }[] = [
  { key: "placed", label: "Order Placed", sub: "Received in our system" },
  { key: "payment", label: "Payment Confirmed", sub: "Full payment recorded" },
  { key: "progress", label: "Work in Progress", sub: "Expert is working on it" },
  { key: "review", label: "Under Review", sub: "Quality check in progress" },
  { key: "delivered", label: "Delivered", sub: "File sent to you" },
  { key: "completed", label: "Completed", sub: "Order closed" },
];

function getProgressIndex(workStatus: string): number {
  const map: Record<string, number> = {
    pending: 2,
    assigned: 2,
    in_progress: 3,
    under_review: 4,
    revision_requested: 4,
    delivered: 5,
    completed: 6,
    cancelled: 0,
  };
  return map[workStatus] ?? 2;
}

function getEtaText(workStatus: string, paymentStatus: string): string {
  const payLabel = paymentStatus === "paid" ? "Fully Paid" : paymentStatus === "partial" ? "Advance Paid" : "Payment Pending";
  const statusMap: Record<string, string> = {
    pending: "Awaiting expert assignment",
    assigned: "Expert assigned — starting work soon",
    in_progress: "Work in progress — est. 24–72 hrs",
    under_review: "Quality review in progress",
    revision_requested: "Revision requested",
    delivered: "File delivered — please review",
    completed: "Order complete",
    cancelled: "Order cancelled",
  };
  return `${statusMap[workStatus] ?? "In progress"} · ${payLabel}`;
}

function getPaymentBadge(paymentStatus: string): { label: string; cls: string } {
  const map: Record<string, { label: string; cls: string }> = {
    paid: { label: "Fully Paid", cls: "bg-green-50 text-green-700 border-green-200" },
    partial: { label: "Advance Paid — Balance Due", cls: "bg-amber-50 text-amber-700 border-amber-200" },
    pending: { label: "Payment Pending", cls: "bg-red-50 text-red-700 border-red-200" },
    refunded: { label: "Refunded", cls: "bg-slate-50 text-slate-700 border-slate-200" },
  };
  return map[paymentStatus] ?? { label: paymentStatus, cls: "bg-surface-cream text-ink-muted border-surface-line" };
}

export function TrackOrderClient() {
  const searchParams = useSearchParams();
  const prefilled = searchParams.get("order") ?? "";

  const [orderId, setOrderId] = useState(prefilled);
  const [isPending, startTransition] = useTransition();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (prefilled) lookup(prefilled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lookup = (id: string) => {
    if (!id.trim()) return;
    setSubmitted(true);
    setNotFound(false);
    setResult(null);
    startTransition(async () => {
      const data = await getOrderByNumber(id.trim());
      if (data) setResult(data);
      else setNotFound(true);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookup(orderId);
  };

  const workStatus = result?.work_status ?? "pending";
  const progress = result ? getProgressIndex(workStatus) : 0;
  const payBadge = result ? getPaymentBadge(result.payment_status ?? "pending") : null;

  // Get most recent delivered file
  const latestFile = (() => {
    if (!result) return null;
    const files = Array.isArray(result.delivery_files) ? result.delivery_files : [];
    if (files.length > 0) return files[files.length - 1];
    return null;
  })();

  const deadline = result?.deadline
    ? new Date(result.deadline).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : null;

  // Financial breakdown
  const totalAmount = result?.total_amount ? Number(result.total_amount) : null;
  const advanceAmount = result?.advance_amount ? Number(result.advance_amount) : null;
  const balanceAmount = result?.balance_amount != null ? Number(result.balance_amount) : null;
  const hasFinancials = totalAmount != null && totalAmount > 0;

  return (
    <>
      {/* Print styles — dangerouslySetInnerHTML prevents SSR/client > encoding mismatch */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body > *:not(#track-print-area) { display: none !important; }
          #track-print-area { display: block !important; }
          .no-print { display: none !important; }
          nav, footer, header { display: none !important; }
        }
      ` }} />

      <main className="bg-gradient-to-b from-surface-cream via-surface-mist/60 to-surface-cream">
        <section className="mx-auto max-w-content px-6 py-20 lg:px-8 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent no-print">Track your order</p>
          <h1 className="mt-3 max-w-3xl font-heading text-4xl font-bold text-ink md:text-5xl no-print">
            Real-time progress view for every active research engagement.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-ink-muted no-print">
            Enter your order number (e.g. RS-2026-001) to see current milestone status directly from our system.
          </p>

          {/* Search form */}
          <form onSubmit={handleSubmit}
            className="no-print mt-10 grid gap-4 rounded-[1.5rem] border border-surface-line bg-white/80 p-6 shadow-card md:grid-cols-[1fr_auto]">
            <div className="relative">
              {isPending
                ? <Spinner className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-primary animate-spin" />
                : <ArrowRight className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" />
              }
              <input
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter Order No. (e.g. RS-2026-001)"
                className="w-full rounded-btn border border-surface-line bg-white px-11 py-3 text-sm outline-none ring-brand-primary transition focus:ring-2 font-mono"
              />
            </div>
            <button type="submit" disabled={isPending}
              className="inline-flex items-center justify-center gap-2 rounded-btn bg-brand-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-deep disabled:opacity-60">
              {isPending ? "Searching..." : <>Track now <ArrowRight className="h-4 w-4" weight="bold" /></>}
            </button>
          </form>

          {/* Not found */}
          {notFound && submitted && (
            <div className="no-print mt-6 rounded-card border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
              Order <strong className="font-mono">{orderId}</strong> was not found. Please check your order number and try again, or{" "}
              <Link href={whatsappHref("Hi, I cannot find my order number. Can you help?")} className="underline font-semibold">contact us on WhatsApp</Link>.
            </div>
          )}

          {/* Result card */}
          {submitted && result && (
            <div id="track-print-area" className="mt-10 space-y-6">
              {/* Header */}
              <div className="rounded-[1.5rem] border border-surface-line bg-white p-6 shadow-card md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-brand-accent">Order · {result.order_no}</p>
                    <h2 className="mt-1 font-heading text-2xl font-bold text-ink">{result.customer_name}</h2>
                    <p className="mt-1 text-sm text-ink-muted">{result.service}{result.topic ? ` · ${result.topic}` : ""}</p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {deadline && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-surface-line px-3 py-1 text-xs text-ink-muted">
                        <Clock className="h-3 w-3" />
                        Deadline: {deadline}
                      </span>
                    )}
                    {payBadge && (
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${payBadge.cls}`}>
                        {payBadge.label}
                      </span>
                    )}
                    {/* Print Receipt button */}
                    <button
                      onClick={() => window.print()}
                      className="no-print inline-flex items-center gap-1.5 rounded-full border border-surface-line px-3 py-1 text-xs text-ink-muted hover:border-brand-primary hover:text-brand-primary transition"
                    >
                      <Printer className="h-3 w-3" />
                      Print Receipt
                    </button>
                  </div>
                </div>

                {/* ETA pill */}
                <div className="mb-6 rounded-xl border border-brand-primary/20 bg-brand-light/40 px-4 py-3 text-sm font-medium text-brand-deep">
                  {getEtaText(workStatus, result.payment_status ?? "pending")}
                </div>

                {/* Progress steps */}
                <ol className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
                  {statusSteps.map((step, index) => {
                    const stepNumber = index + 1;
                    const done = stepNumber < progress;
                    const active = stepNumber === progress;
                    return (
                      <li key={step.key}
                        className={`rounded-card border p-3 transition ${
                          done ? "border-brand-accent/40 bg-brand-light/40"
                            : active ? "border-brand-primary bg-brand-primary text-white"
                            : "border-surface-line bg-surface-cream opacity-50"
                        }`}>
                        <div className="flex items-start gap-2">
                          <span className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold mt-0.5 ${
                            done ? "bg-brand-primary text-white" : active ? "bg-white/20 text-white" : "bg-white text-ink"
                          }`}>
                            {done ? <CheckCircle className="h-3.5 w-3.5" weight="fill" /> : stepNumber}
                          </span>
                          <div>
                            <p className={`text-xs font-semibold leading-tight ${active ? "text-white" : "text-ink"}`}>{step.label}</p>
                            <p className={`text-[10px] mt-0.5 ${active ? "text-white/70" : "text-ink-muted"}`}>{step.sub}</p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* Payment Breakdown */}
              {hasFinancials && (
                <div className="rounded-[1.5rem] border border-surface-line bg-white p-6 shadow-card md:p-8">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand-accent">Payment Breakdown</p>
                  <div className="divide-y divide-surface-line/60 rounded-xl border border-surface-line overflow-hidden">
                    <div className="flex justify-between px-5 py-3 text-sm">
                      <span className="text-ink-muted">Quoted Total</span>
                      <span className="font-semibold text-ink">{fmtINR(totalAmount!)}</span>
                    </div>
                    {advanceAmount != null && advanceAmount > 0 && (
                      <div className="flex justify-between px-5 py-3 text-sm">
                        <span className="text-ink-muted">Advance Paid</span>
                        <span className="font-semibold text-green-600">− {fmtINR(advanceAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between px-5 py-3 text-sm bg-surface-subtle">
                      <span className="font-semibold text-ink">{advanceAmount && advanceAmount > 0 ? "Balance Due" : "Total Due"}</span>
                      <span className={`font-bold text-base ${balanceAmount && balanceAmount > 0 ? "text-amber-600" : "text-green-600"}`}>
                        {balanceAmount != null ? fmtINR(balanceAmount) : fmtINR(totalAmount!)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Delivered file download */}
              {latestFile && (
                <div className="rounded-[1.5rem] border border-brand-accent/30 bg-brand-light/40 p-6 shadow-card">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-accent">Your file is ready</p>
                  <a href={latestFile.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-btn bg-brand-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-deep w-fit">
                    <CheckCircle className="h-5 w-5" weight="fill" />
                    Download {latestFile.version ?? "your file"} →
                  </a>
                  {latestFile.sent_at && (
                    <p className="mt-2 text-xs text-ink-muted">Sent on {new Date(latestFile.sent_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
                  )}
                  <p className="mt-3 text-xs text-ink-muted">Need revisions? Reply to your confirmation email or contact us on WhatsApp.</p>
                </div>
              )}

              {/* Payment pending reminder */}
              {result.payment_status === "pending" && (
                <div className="no-print rounded-[1.5rem] border border-amber-200 bg-amber-50 p-6">
                  <p className="text-sm font-semibold text-amber-700">Payment Pending</p>
                  <p className="mt-1 text-xs text-amber-600">We have received your order but payment has not yet been confirmed. Please contact us to complete your payment.</p>
                  <Link href={whatsappHref(`Hi, I need to complete payment for order ${result.order_no}`)}
                    className="mt-3 inline-flex items-center gap-2 rounded-btn bg-[#25D366] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1dbf5a] transition">
                    <WhatsappLogo className="h-4 w-4" weight="fill" />
                    Contact us on WhatsApp
                  </Link>
                </div>
              )}

              {result.payment_status === "partial" && (
                <div className="no-print rounded-[1.5rem] border border-amber-200 bg-amber-50 p-6">
                  <p className="text-sm font-semibold text-amber-700">Balance Due</p>
                  <p className="mt-1 text-xs text-amber-600">You have paid an advance. Please clear the balance before delivery to avoid delays.</p>
                  <Link href={whatsappHref(`Hi, I need to clear the balance for order ${result.order_no}`)}
                    className="mt-3 inline-flex items-center gap-2 rounded-btn bg-[#25D366] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1dbf5a] transition">
                    <WhatsappLogo className="h-4 w-4" weight="fill" />
                    Contact us on WhatsApp
                  </Link>
                </div>
              )}
            </div>
          )}

          <div className="no-print mt-8 flex flex-wrap items-center gap-4">
            <Link href={whatsappHref("Hello, I need help tracking my order.")}
              className="inline-flex items-center gap-2 rounded-btn bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1dbf5a]">
              <WhatsappLogo className="h-5 w-5" weight="fill" />
              Contact directly
            </Link>
            <Link href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center gap-2 rounded-btn border border-surface-line bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-brand-primary hover:text-brand-primary">
              <Envelope className="h-4 w-4" />
              Email support
            </Link>
            <Link href="/order" className="inline-flex items-center rounded-btn border border-brand-primary/25 px-5 py-2.5 text-sm font-semibold text-brand-primary transition hover:border-brand-primary">
              Place a new order
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
