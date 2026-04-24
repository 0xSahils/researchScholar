"use client";

import { ArrowRight, CheckCircle, Clock, Spinner, WhatsappLogo } from "@phosphor-icons/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { whatsappHref } from "@/lib/site-config";
import { getOrderByNumber } from "@/lib/actions/track";

const statusSteps: { key: string; label: string }[] = [
  { key: "pending", label: "Order placed" },
  { key: "payment_confirmed", label: "Payment confirmed" },
  { key: "in_progress", label: "Work in progress" },
  { key: "revision", label: "Under revision" },
  { key: "delivered", label: "Delivered" },
  { key: "completed", label: "Completed" },
];

function getProgressIndex(status: string): number {
  const map: Record<string, number> = {
    pending: 2,     // payment always confirmed before order is saved
    in_progress: 3,
    revision: 4,
    delivered: 5,
    completed: 6,
    cancelled: 0,
  };
  return map[status] ?? 2;
}

function getEta(status: string): string {
  const map: Record<string, string> = {
    pending: "Awaiting expert assignment",
    in_progress: "Work in progress — estimated 24–72 hrs",
    revision: "Revision in progress",
    delivered: "File delivered — please review",
    completed: "Order complete",
    cancelled: "Order cancelled",
  };
  return map[status] ?? "Under review";
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

  // Auto-fetch if prefilled from success page
  useEffect(() => {
    if (prefilled) {
      lookup(prefilled);
    }
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

  const progress = result ? getProgressIndex(result.status) : 2;

  return (
    <main className="bg-gradient-to-b from-surface-cream via-surface-mist/60 to-surface-cream">
      <section className="mx-auto max-w-content px-6 py-20 lg:px-8 lg:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">Track your order</p>
        <h1 className="mt-3 max-w-3xl font-heading text-4xl font-bold text-ink md:text-5xl">
          Real-time progress view for every active research engagement.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-ink-muted">
          Enter your order number (e.g. RS-00001) to see current milestone status directly from our system.
        </p>

        {/* Search form */}
        <form onSubmit={handleSubmit}
          className="mt-10 grid gap-4 rounded-[1.5rem] border border-surface-line bg-white/80 p-6 shadow-card md:grid-cols-[1fr_auto]">
          <div className="relative">
            {isPending
              ? <Spinner className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-primary animate-spin" />
              : <ArrowRight className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" />
            }
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order No. (e.g. RS-00001)"
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
          <div className="mt-6 rounded-card border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
            Order <strong className="font-mono">{orderId}</strong> was not found. Check your order number and try again.
          </div>
        )}

        {/* Result */}
        <div className={`mt-12 rounded-[1.5rem] border border-surface-line bg-white p-6 shadow-card md:p-8 transition ${!submitted ? "opacity-50 pointer-events-none" : ""}`}>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-primary">
                {result ? `Order ${result.order_no}` : "Order progress"}
              </p>
              {result && (
                <p className="text-xs text-ink-muted mt-1">{result.service} · {result.customer_name}</p>
              )}
            </div>
            <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-deep">
              {result ? getEta(result.status) : "Enter your order number"}
            </span>
          </div>

          {/* Delivered file link */}
          {result?.delivered_file && (
            <a href={result.delivered_file} target="_blank" rel="noopener noreferrer"
              className="mb-6 flex items-center gap-3 rounded-card border border-brand-accent/30 bg-brand-light/40 px-5 py-3 text-sm font-semibold text-brand-primary hover:bg-brand-light transition">
              <CheckCircle className="h-5 w-5" weight="fill" />
              Download your delivered file →
            </a>
          )}

          {/* Progress steps */}
          <ol className="grid gap-4 md:grid-cols-3">
            {statusSteps.map((step, index) => {
              const stepNumber = index + 1;
              const done = stepNumber < progress;
              const active = stepNumber === progress;
              return (
                <li key={step.key}
                  className={`rounded-card border p-4 transition ${
                    done ? "border-brand-accent/40 bg-brand-light/40"
                      : active ? "border-brand-primary bg-brand-primary text-white"
                      : "border-surface-line bg-surface-cream"
                  }`}>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      done ? "bg-brand-primary text-white" : active ? "bg-white/20 text-white" : "bg-white text-ink"
                    }`}>
                      {done ? <CheckCircle className="h-4 w-4" weight="fill" /> : stepNumber}
                    </span>
                    <p className={`text-sm font-semibold ${active ? "text-white" : "text-ink"}`}>{step.label}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href={whatsappHref("Hello, I need help tracking my order.")}
            className="inline-flex items-center gap-2 rounded-btn bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1dbf5a]">
            <WhatsappLogo className="h-5 w-5" weight="fill" />
            WhatsApp for help
          </Link>
          <Link href="/order" className="inline-flex items-center rounded-btn border border-brand-primary/25 px-5 py-2.5 text-sm font-semibold text-brand-primary transition hover:border-brand-primary">
            Place a new order
          </Link>
        </div>
      </section>
    </main>
  );
}
