"use client";

import { useState } from "react";
import { ArrowLeft, CreditCard, LockKey, Spinner } from "@phosphor-icons/react";
import type { OrderServiceType } from "./OrderComposition";
import { motion } from "framer-motion";

export function PaymentSimulation({ 
  service, 
  onSuccess, 
  onBack 
}: { 
  service: OrderServiceType;
  onSuccess: () => void;
  onBack: () => void;
}) {
  const [processing, setProcessing] = useState(false);

  const simulateCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    // Simulate network transaction latency
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
    }, 2500);
  };

  return (
    <section className="relative flex flex-1 items-center justify-center py-12 px-6">
      <div className="absolute inset-0 bg-brand-deep/5 backdrop-blur-3xl z-0 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-4xl overflow-hidden rounded-[2rem] border border-surface-line bg-white shadow-diffusion flex flex-col md:flex-row"
      >
        {/* Left pane: Cart Summary */}
        <div className="bg-surface-subtle p-8 md:w-5/12 lg:w-4/12 border-b md:border-b-0 md:border-r border-surface-line/60">
          <button 
            onClick={onBack}
            className="group mb-8 flex w-fit items-center gap-2 text-sm font-medium text-ink-muted transition hover:text-brand-primary"
            disabled={processing}
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
            Back to packages
          </button>
          
          <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-accent mb-2">Order Summary</h2>
          <h3 className="font-heading text-2xl font-bold text-ink mb-6">{service.title} Package</h3>
          
          <div className="mt-auto pt-8 border-t border-surface-line">
            <div className="flex items-end justify-between">
              <span className="text-sm font-medium text-ink-muted">Total Due</span>
              <span className="font-heading text-3xl font-bold text-ink">{service.price}</span>
            </div>
          </div>
        </div>

        {/* Right pane: Checkout Form */}
        <div className="p-8 md:w-7/12 lg:w-8/12">
          <form onSubmit={simulateCheckout} className="space-y-6">
            <h2 className="font-heading text-xl font-bold text-ink mb-6">Payment Details</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-2 block text-xs font-semibold text-ink-muted">First Name</label>
                <input required disabled={processing} type="text" className="w-full rounded-lg border border-surface-line/80 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand-primary focus:ring-1 focus:ring-brand-primary" placeholder="Rahul" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-2 block text-xs font-semibold text-ink-muted">Last Name</label>
                <input required disabled={processing} type="text" className="w-full rounded-lg border border-surface-line/80 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand-primary focus:ring-1 focus:ring-brand-primary" placeholder="Sharma" />
              </div>
              <div className="col-span-2">
                <label className="mb-2 block text-xs font-semibold text-ink-muted">Email Address</label>
                <input required disabled={processing} type="email" className="w-full rounded-lg border border-surface-line/80 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand-primary focus:ring-1 focus:ring-brand-primary" placeholder="rahul@university.ac.in" />
              </div>
            </div>

            <hr className="border-surface-line/60 my-6" />

            <div className="relative">
              <label className="mb-2 block text-xs font-semibold text-ink-muted">Card Information</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-line" />
                <input required disabled={processing} type="text" placeholder="Card number" maxLength={19} className="w-full rounded-t-lg border border-surface-line/80 bg-white px-10 py-3 text-sm outline-none transition focus:border-brand-primary focus:ring-1 focus:ring-brand-primary placeholder:text-surface-line z-10" />
              </div>
              <div className="flex -mx-px">
                <input required disabled={processing} type="text" placeholder="MM / YY" maxLength={5} className="w-1/2 rounded-bl-lg border-x border-b border-surface-line/80 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-primary focus:ring-1 focus:ring-brand-primary placeholder:text-surface-line" />
                <input required disabled={processing} type="text" placeholder="CVC" maxLength={3} className="w-1/2 rounded-br-lg border-r border-b border-surface-line/80 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-primary focus:ring-1 focus:ring-brand-primary placeholder:text-surface-line" />
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-btn bg-brand-primary px-6 py-4 text-base font-semibold text-white shadow-card transition hover:bg-brand-deep disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {processing ? (
                <>
                  <Spinner className="h-5 w-5 animate-spin" />
                  Processing payment...
                </>
              ) : (
                <>
                  <LockKey className="h-5 w-5" weight="bold" />
                  Pay {service.price} Securely
                </>
              )}
            </button>
            <p className="mt-4 text-center text-xs text-ink-muted flex justify-center items-center gap-1">
               Functional Frontend Gateway Simulation. Backend bypassed.
            </p>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
