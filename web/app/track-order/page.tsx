import type { Metadata } from "next";

import { FutureRoutePlaceholder } from "@/components/marketing/FutureRoutePlaceholder";

export const metadata: Metadata = {
  title: "Track your order status",
  description:
    "Check milestone progress for your ResearchScholars engagement from payment confirmation through expert assignment, drafting, review, and delivery.",
  alternates: { canonical: "/track-order" },
};

export default function TrackOrderPage() {
  return (
    <FutureRoutePlaceholder
      title="Order tracker"
      description="The horizontal stepper will connect to your admin and customer success stack in phase two. WhatsApp remains the fastest escalation path today."
    />
  );
}
