"use client";

import { useState, useTransition } from "react";
import { upsertPricingByServiceName } from "@/lib/actions/admin";
import { pricingData } from "@/lib/data/site-content";


// Parse "₹1,500" → 1500
function parsePriceStr(priceStr: string): number {
  return Number(priceStr.replace(/[^\d]/g, ""));
}

// Build initial editable rows from static pricingData, overriding with DB values if present
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildInitialRows(dbRows: any[]) {
  const dbMap = new Map(dbRows.map((r) => [String(r.service_name), r]));
  void dbMap;
  return pricingData.map((plan) => {
    // Try to match by service_name (case-insensitive, first word)
    const dbMatch = dbRows.find((r) =>
      String(r.service_name).toLowerCase().includes(plan.title.toLowerCase().split(" ")[0])
    );
    const staticPrice = parsePriceStr(plan.price);
    return {
      service_name: plan.title,
      base_price: dbMatch ? Number(dbMatch.base_price) : staticPrice,
      min_price: dbMatch ? Number(dbMatch.min_price ?? staticPrice) : staticPrice,
      db_id: dbMatch ? String(dbMatch.id) : null,
    };
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PricingManager({ rows }: { rows: any[] }) {
  const [editRows, setEditRows] = useState(() => buildInitialRows(rows));
  const [isPending, startTransition] = useTransition();
  const [savedRow, setSavedRow] = useState<string | null>(null);


  const handleSaveRow = (index: number) => {
    const row = editRows[index];
    startTransition(async () => {
      await upsertPricingByServiceName(row.service_name, row.base_price, row.min_price);
      setSavedRow(row.service_name);
      setTimeout(() => setSavedRow(null), 2000);
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold text-white">Pricing &amp; GST</h1>
        <p className="mt-1 text-sm text-white/50">
          Update service base prices here. Changes are immediately reflected on the public website — Services page and Order page.
        </p>
      </div>

      {/* Service Price Rows */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
        <div className="border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white/80">Service Prices</h2>
            <p className="mt-0.5 text-xs text-white/40">
              Base Price = fixed price shown on the website and charged at checkout. Save each row individually.
            </p>
          </div>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {editRows.map((row, index) => (
            <div
              key={row.service_name}
              className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:gap-6"
            >
              {/* Service Name */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{row.service_name}</p>
                <p className="text-[11px] text-white/30 mt-0.5">
                  {row.db_id ? "Saved in database" : "Not yet in database — click Save to create it"}
                </p>
              </div>

              {/* Price Inputs */}
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-widest text-white/30">
                    Base Price (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-white/40">₹</span>
                    <input
                      type="number"
                      value={row.base_price}
                      onChange={(e) => {
                        const next = [...editRows];
                        next[index] = { ...next[index], base_price: Number(e.target.value) };
                        setEditRows(next);
                      }}
                      className="w-32 rounded-lg border border-white/[0.12] bg-white/[0.04] pl-6 pr-3 py-2 text-sm text-white focus:border-brand-accent focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleSaveRow(index)}
                  className={`h-9 rounded-lg px-4 text-xs font-semibold transition-all ${
                    savedRow === row.service_name
                      ? "bg-green-700/30 text-green-400 border border-green-700/40"
                      : "bg-brand-primary/20 text-brand-accent border border-brand-primary/30 hover:bg-brand-primary/40"
                  }`}
                >
                  {savedRow === row.service_name ? "Saved ✓" : "Save"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Policy Note */}
      <div className="rounded-2xl border border-yellow-700/30 bg-yellow-900/10 p-5">
        <p className="text-sm font-semibold text-yellow-400">ℹ️ Payment Policy</p>
        <p className="mt-1 text-xs text-yellow-200/60 leading-relaxed">
          All website orders require <strong>full payment</strong> at checkout via Razorpay. No partial advance or deposit on the website.
          Manual/offline orders can have custom payment arrangements from the Orders admin panel.
        </p>
        <a href="/admin/settings" className="mt-3 inline-block text-xs text-brand-accent underline">
          Update GST rate in Site Settings →
        </a>
      </div>
    </div>
  );
}
