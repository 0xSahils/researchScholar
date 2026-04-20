"use client";

import Link from "next/link";
import { CheckCircle, Download } from "@phosphor-icons/react";
import type { OrderServiceType } from "./OrderComposition";
import { motion } from "framer-motion";

export function OrderSuccess({ service }: { service: OrderServiceType }) {
  // Generate a dummy timestamp and order ID
  const orderId = `RS-${Math.floor(Math.random() * 90000) + 10000}`;
  const date = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <section className="flex flex-1 flex-col items-center justify-center py-20 px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto w-full max-w-lg overflow-hidden rounded-[2rem] border border-surface-line bg-white shadow-card text-center"
      >
        <div className="bg-brand-primary p-10 flex flex-col items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 shadow-inner mb-6">
            <CheckCircle className="h-10 w-10 text-white" weight="fill" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-white mb-2">Payment Successful</h1>
          <p className="text-white/80 font-medium">Your request has been received by our scholar allocation desk.</p>
        </div>

        <div className="p-8 md:p-10 text-left">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-accent mb-6">Receipt Details</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-surface-line/60">
              <span className="text-ink-muted text-sm">Order ID</span>
              <span className="font-semibold text-ink font-mono">{orderId}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-surface-line/60">
              <span className="text-ink-muted text-sm">Date</span>
              <span className="font-medium text-ink">{date}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-surface-line/60">
              <span className="text-ink-muted text-sm">Package</span>
              <span className="font-medium text-ink">{service.title}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-ink font-semibold">Total Paid</span>
              <span className="font-heading text-2xl font-bold text-brand-primary">{service.price}</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-subtle p-6 md:p-8 flex flex-col sm:flex-row gap-4 border-t border-surface-line/60">
          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-2 rounded-btn border border-surface-line bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-brand-primary hover:text-brand-primary"
          >
            Return to Home
          </Link>
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-btn bg-brand-primary px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-brand-deep"
          >
            <Download className="h-4 w-4" weight="bold" />
            Download Invoice
          </button>
        </div>
      </motion.div>
    </section>
  );
}
