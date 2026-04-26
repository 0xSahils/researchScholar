import Link from "next/link";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { pricingData } from "@/lib/data/site-content";
import { getPublicPricing, getPublicSettings } from "@/lib/actions/admin";
import { applyGst, fmtINR } from "@/lib/gst";

export async function ServicesPricing() {
  const [dbPrices, publicSettings] = await Promise.all([
    getPublicPricing().catch(() => []),
    getPublicSettings().catch(() => ({ gst_rate: 0, google_analytics_id: null })),
  ]);

  const gstRate = publicSettings.gst_rate ?? 0;

  // Merge DB prices with static plan data and apply GST
  const plans = pricingData.map((plan) => {
    const dbPrice = dbPrices.find(
      (r) => r.service_name.toLowerCase().includes(plan.title.toLowerCase().split(" ")[0].toLowerCase())
    );
    const basePrice = dbPrice ? dbPrice.base_price : Number(plan.price.replace(/[^0-9]/g, ""));
    const { base, gstAmount, total } = applyGst(basePrice, gstRate);
    return { ...plan, basePrice: base, gstAmount, totalPrice: total };
  });

  return (
    <section className="bg-surface-cream py-20 lg:py-28" aria-labelledby="pricing-heading">
      <div className="mx-auto max-w-content px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">Fixed Rates</p>
          <h2 id="pricing-heading" className="mt-3 font-heading text-3xl font-bold text-ink md:text-5xl">
            Transparent pricing. Zero hidden surprises.
          </h2>
          <p className="mt-4 text-sm text-ink-muted">
            Full payment is collected at checkout. No deposits or partial payments.
            {gstRate > 0 && ` All prices include ${gstRate}% GST.`}
          </p>
        </div>

        <div className="w-full overflow-hidden rounded-[2rem] border border-surface-line/80 bg-white shadow-card">
          <div className="grid grid-cols-[1fr_auto_1fr_auto] gap-0 border-b border-surface-line bg-surface-subtle p-6 font-heading font-bold text-ink max-md:hidden">
            <div>Scope of Work</div>
            <div className="px-6 text-right">Inclusions</div>
            <div className="w-px" />
            <div className="px-6 text-right">Fixed Rate</div>
          </div>

          <div className="flex flex-col divide-y divide-surface-line/60">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="group relative flex flex-col md:grid md:grid-cols-[1fr_auto_1fr_auto] items-center gap-4 p-6 transition duration-300 hover:bg-brand-light/10"
              >
                {/* Mobile shadow link overlay */}
                <Link href={`/order?plan=${plan.id}`} className="absolute inset-0 z-10 md:hidden" aria-label={`Order ${plan.title}`} />

                <div className="w-full md:w-auto">
                  <div className="flex items-center gap-3">
                    <h3 className="font-heading text-xl font-bold text-ink">{plan.title}</h3>
                    {plan.popular && (
                      <span className="rounded-full bg-brand-accent/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-deep">
                        Popular
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-full md:w-auto mt-4 md:mt-0 px-0 md:px-6">
                  <ul className="flex flex-col gap-2">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-sm text-ink-muted">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" weight="bold" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="w-px hidden md:block" />

                <div className="flex w-full items-center justify-between md:w-auto md:justify-end gap-6 mt-6 md:mt-0 px-0 md:px-6">
                  <div>
                    <p className="font-heading text-2xl font-bold text-ink">{fmtINR(plan.totalPrice)}</p>
                    {gstRate > 0 && (
                      <p className="text-[11px] text-ink-muted mt-0.5">
                        {fmtINR(plan.basePrice)} + {fmtINR(plan.gstAmount)} GST
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/order?plan=${plan.id}`}
                    className="relative z-20 hidden md:inline-flex items-center gap-2 rounded-btn bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-card transition group-hover:bg-brand-deep group-hover:-translate-y-px group-hover:shadow-cardHover"
                  >
                    Place Order
                    <ArrowRight className="h-4 w-4" weight="bold" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
