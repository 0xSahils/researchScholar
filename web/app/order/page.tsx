import type { Metadata } from "next";
import { OrderComposition } from "@/components/order/OrderComposition";

export const metadata: Metadata = {
  title: "Place Your Order",
  description:
    "Lock in your PhD scholar today for thesis help, dissertations, research papers, synopsis formatting, and Scopus publication.",
  alternates: { canonical: "/order" },
};

export default function OrderPage({
  searchParams,
}: {
  searchParams: { plan?: string };
}) {
  return <OrderComposition defaultPlanId={searchParams.plan} />;
}
