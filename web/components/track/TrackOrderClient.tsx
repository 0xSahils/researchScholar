"use client";

import { ArrowRight, CheckCircle, MagnifyingGlass, WhatsappLogo } from "@phosphor-icons/react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { whatsappHref } from "@/lib/site-config";

const statuses = [
  "Order placed",
  "Payment confirmed",
  "Expert assigned",
  "Work in progress",
  "Quality review",
  "Delivered",
] as const;

export function TrackOrderClient() {
  const [orderId, setOrderId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const progress = useMemo(() => {
    if (!submitted || !orderId.trim()) return 2;
    const digits = Number(orderId.replace(/\D/g, "").slice(-1) || "4");
    return Math.min(statuses.length, Math.max(1, (digits % statuses.length) + 1));
  }, [orderId, submitted]);

  const eta = useMemo(() => {
    if (progress <= 2) return "Under 2 hours";
    if (progress <= 4) return "24-48 hours";
    if (progress <= 5) return "Within 12 hours";
    return "Delivered";
  }, [progress]);

  return (
    <main className="bg-gradient-to-b from-surface-cream via-surface-mist/60 to-surface-cream">
      <section className="mx-auto max-w-content px-6 py-20 lg:px-8 lg:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">Track your order</p>
        <h1 className="mt-3 max-w-3xl font-heading text-4xl font-bold text-ink md:text-5xl">
          Real-time progress view for every active research engagement.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-ink-muted">
          Enter your order ID to see the current milestone. This tracker mirrors the phase-two admin
          model while keeping WhatsApp escalation available for urgent checks.
        </p>

        <form
          className="mt-10 grid gap-4 rounded-[1.5rem] border border-surface-line bg-white/80 p-6 shadow-card md:grid-cols-[1fr_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
        >
          <label className="sr-only" htmlFor="order-id">
            Order ID
          </label>
          <div className="relative">
            <MagnifyingGlass
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted"
              aria-hidden
            />
            <input
              id="order-id"
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
              placeholder="Enter Order ID (example: RS-59284)"
              className="w-full rounded-btn border border-surface-line bg-white px-11 py-3 text-sm outline-none ring-brand-primary transition focus:ring-2"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-btn bg-brand-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-deep"
          >
            Track now
            <ArrowRight className="h-4 w-4" weight="bold" aria-hidden />
          </button>
        </form>

        <div className="mt-12 rounded-[1.5rem] border border-surface-line bg-white p-6 shadow-card md:p-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-primary">
              {submitted ? `Order ${orderId || "RS-00000"}` : "Order progress"}
            </p>
            <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-deep">
              Estimated remaining: {eta}
            </span>
          </div>

          <ol className="grid gap-4 md:grid-cols-3">
            {statuses.map((status, index) => {
              const stepNumber = index + 1;
              const done = stepNumber < progress;
              const active = stepNumber === progress;

              return (
                <li
                  key={status}
                  className={`rounded-card border p-4 transition ${
                    done
                      ? "border-brand-accent/40 bg-brand-light/40"
                      : active
                        ? "border-brand-primary bg-brand-primary text-white"
                        : "border-surface-line bg-surface-cream"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                        done ? "bg-brand-primary text-white" : active ? "bg-white/20 text-white" : "bg-white text-ink"
                      }`}
                    >
                      {done ? <CheckCircle className="h-4 w-4" weight="fill" aria-hidden /> : stepNumber}
                    </span>
                    <p className={`text-sm font-semibold ${active ? "text-white" : "text-ink"}`}>{status}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={whatsappHref("Hello, I need help tracking my order ID.")}
            className="inline-flex items-center gap-2 rounded-btn bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1dbf5a]"
          >
            <WhatsappLogo className="h-5 w-5" weight="fill" aria-hidden />
            WhatsApp your order ID
          </Link>
          <Link
            href="/order"
            className="inline-flex items-center rounded-btn border border-brand-primary/25 px-5 py-2.5 text-sm font-semibold text-brand-primary transition hover:border-brand-primary"
          >
            Place a new order
          </Link>
        </div>
      </section>
    </main>
  );
}
