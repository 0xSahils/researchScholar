import type { Metadata } from "next";

import { TrackOrderClient } from "@/components/track/TrackOrderClient";

export const metadata: Metadata = {
  title: "Track your order status",
  description:
    "Check milestone progress for your ResearchScholars engagement from payment confirmation through expert assignment, drafting, review, and delivery.",
  alternates: { canonical: "/track-order" },
};

export default function TrackOrderPage() {
  return <TrackOrderClient />;
}
