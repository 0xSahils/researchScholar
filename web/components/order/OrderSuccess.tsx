"use client";

import Link from "next/link";
import { CheckCircle, Download, ArrowRight, Printer } from "@phosphor-icons/react";
import type { OrderServiceType } from "./OrderComposition";
import { motion } from "framer-motion";

export function OrderSuccess({
  service,
  orderNo,
}: {
  service: OrderServiceType;
  orderNo: string;
}) {
  const date = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handlePrintInvoice = () => {
    const invoiceHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice — ${orderNo}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; background: #fff; padding: 40px; color: #111; }
    .header { border-bottom: 3px solid #1B5E20; padding-bottom: 24px; margin-bottom: 24px; }
    .brand { font-size: 22px; font-weight: 700; color: #1B5E20; }
    .brand-sub { font-size: 12px; color: #555; margin-top: 2px; }
    h2 { font-size: 14px; color: #555; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
    .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px; }
    .label { color: #666; }
    .value { font-weight: 600; }
    .total { font-size: 20px; font-weight: 700; color: #1B5E20; }
    .footer { margin-top: 32px; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 20px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">ResearchScholars.online</div>
    <div class="brand-sub">PhD-led Academic Support · orders@researchscholars.online</div>
  </div>
  <h2>Payment Receipt</h2>
  <div class="row"><span class="label">Order No.</span><span class="value" style="font-family:monospace">${orderNo}</span></div>
  <div class="row"><span class="label">Date</span><span class="value">${date}</span></div>
  <div class="row"><span class="label">Service</span><span class="value">${service.title}</span></div>
  <div class="row"><span class="label">Amount Paid</span><span class="value total">${service.price}</span></div>
  <div class="footer">
    This is a system-generated receipt. For any queries, email orders@researchscholars.online or WhatsApp us.<br />
    Track your order at: https://researchscholars.online/track-order
  </div>
</body>
</html>`;

    const w = window.open("", "_blank", "width=800,height=600");
    if (!w) return alert("Please allow popups to print your invoice.");
    w.document.write(invoiceHtml);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 500);
  };

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
          <p className="text-white/80 font-medium">
            Your request has been saved. Check your email for confirmation.
          </p>
        </div>

        <div className="p-8 md:p-10 text-left">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-accent mb-6">
            Receipt Details
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-surface-line/60">
              <span className="text-ink-muted text-sm">Order ID</span>
              <span className="font-semibold text-ink font-mono">{orderNo}</span>
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

          {/* Track order link */}
          <Link
            href={`/track-order?order=${encodeURIComponent(orderNo)}`}
            className="mt-6 flex items-center justify-center gap-2 rounded-btn bg-brand-light/40 border border-brand-primary/20 px-5 py-3 text-sm font-semibold text-brand-primary hover:bg-brand-light transition"
          >
            Track Order Status
            <ArrowRight className="h-4 w-4" weight="bold" />
          </Link>
        </div>

        <div className="bg-surface-subtle p-6 md:p-8 flex flex-col sm:flex-row gap-4 border-t border-surface-line/60">
          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-2 rounded-btn border border-surface-line bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-brand-primary hover:text-brand-primary"
          >
            Return to Home
          </Link>
          <button
            onClick={handlePrintInvoice}
            className="flex flex-1 items-center justify-center gap-2 rounded-btn bg-brand-primary px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-brand-deep"
          >
            <Printer className="h-4 w-4" weight="bold" />
            Print / Save Invoice
          </button>
        </div>
      </motion.div>
    </section>
  );
}
