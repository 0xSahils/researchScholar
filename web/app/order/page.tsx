import type { Metadata } from "next";
import { OrderComposition } from "@/components/order/OrderComposition";
import { getPublicPricing, getPublicSettings } from "@/lib/actions/admin";
import { pricingData } from "@/lib/data/site-content";
import { applyGst } from "@/lib/gst";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Place Your Order",
  description:
    "Lock in your PhD scholar today for thesis help, dissertations, research papers, synopsis formatting, and Scopus publication.",
  alternates: { canonical: "/order" },
};

export default async function OrderPage({
  searchParams,
}: {
  searchParams: { plan?: string };
}) {
  const [dbPrices, publicSettings] = await Promise.all([
    getPublicPricing().catch(() => []),
    getPublicSettings().catch(() => ({ gst_rate: 0, google_analytics_id: null })),
  ]);

  const gstRate = publicSettings.gst_rate ?? 0;

  // Build merged pricing where DB base_price overrides static price, then apply GST
  const mergedPricing = pricingData.map((plan) => {
    const dbMatch = dbPrices.find(
      (r) => r.service_name.toLowerCase().includes(plan.title.toLowerCase().split(" ")[0].toLowerCase())
    );
    const basePrice = dbMatch ? dbMatch.base_price : Number(plan.price.replace(/[^0-9]/g, ""));
    const { total } = applyGst(basePrice, gstRate);
    return {
      ...plan,
      basePrice,
      price: `₹${total.toLocaleString("en-IN")}`,
    };
  });

  return <OrderComposition defaultPlanId={searchParams.plan} pricingData={mergedPricing} gstRate={gstRate} />;
}
