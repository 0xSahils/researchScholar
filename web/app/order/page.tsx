import type { Metadata } from "next";
import { OrderComposition } from "@/components/order/OrderComposition";
import { getPublicPricing } from "@/lib/actions/admin";
import { pricingData } from "@/lib/data/site-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Place Your Order",
  description:
    "Lock in your PhD scholar today for thesis help, dissertations, research papers, synopsis formatting, and Scopus publication.",
  alternates: { canonical: "/order" },
};

function formatPrice(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default async function OrderPage({
  searchParams,
}: {
  searchParams: { plan?: string };
}) {
  // Fetch live prices from DB, fall back to static
  const dbPrices = await getPublicPricing().catch(() => []);

  // Build merged pricing where DB price overrides static price
  const mergedPricing = pricingData.map((plan) => {
    const dbMatch = dbPrices.find(
      (r) => r.service_name.toLowerCase().includes(plan.title.toLowerCase().split(" ")[0].toLowerCase())
    );
    return {
      ...plan,
      price: dbMatch ? formatPrice(dbMatch.base_price) : plan.price,
    };
  });

  return <OrderComposition defaultPlanId={searchParams.plan} pricingData={mergedPricing} />;
}
