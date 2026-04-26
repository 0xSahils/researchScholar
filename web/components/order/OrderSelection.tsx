"use client";

import type { OrderServiceType } from "./OrderComposition";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import clsx from "clsx";
import { applyGst, fmtINR } from "@/lib/gst";

type PricingPlan = {
  id: string;
  title: string;
  price: string;
  basePrice: number;
  features: readonly string[];
  popular: boolean;
};

export function OrderSelection({
  onSelect,
  pricingData,
  gstRate,
}: {
  onSelect: (service: OrderServiceType) => void;
  pricingData: readonly PricingPlan[];
  gstRate: number;
}) {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-12 lg:px-8 lg:py-20">
      <div className="mb-10 lg:mb-16">
        <h1 className="font-heading text-3xl font-bold text-ink md:text-5xl">Select Your Package</h1>
        <p className="mt-4 text-base text-ink-muted md:text-lg">
          Pick your requested academic support package. Full payment is required at checkout — no partial payments or deposits.
        </p>
        {gstRate > 0 && (
          <p className="mt-2 text-sm text-ink-muted/70">
            All prices include {gstRate}% GST.
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pricingData.map((plan) => {
          const { base, gstAmount, total } = applyGst(plan.basePrice, gstRate);
          return (
            <button
              key={plan.id}
              onClick={() => onSelect({ id: plan.id, title: plan.title, price: fmtINR(total), basePrice: plan.basePrice })}
              className={clsx(
                "group relative flex flex-col items-start justify-between rounded-card border bg-white p-6 md:p-8 text-left transition duration-500 ease-premium hover:-translate-y-1 hover:shadow-cardHover focus:outline-none",
                plan.popular ? "border-brand-primary" : "border-surface-line/80"
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-6 inline-block rounded-full bg-brand-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                  Most Chosen
                </span>
              )}

              <div className="mb-8 w-full">
                <h3 className="font-heading text-xl font-bold text-ink">{plan.title}</h3>
                <div className="mt-4">
                  <p className="font-heading text-3xl font-bold text-brand-primary">{fmtINR(total)}</p>
                  {gstRate > 0 && (
                    <p className="mt-1 text-xs text-ink-muted">
                      {fmtINR(base)} + {fmtINR(gstAmount)} GST ({gstRate}%)
                    </p>
                  )}
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm text-ink-muted">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent/80" weight="fill" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto flex w-full items-center justify-between border-t border-surface-line/50 pt-6">
                <span className="text-sm font-semibold text-brand-primary group-hover:text-brand-deep">Proceed to Checkout</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-light/40 text-brand-primary transition group-hover:bg-brand-primary group-hover:text-white">
                  <ArrowRight className="h-4 w-4" weight="bold" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
