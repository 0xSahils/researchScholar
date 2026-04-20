import type { Metadata } from "next";

import { FutureRoutePlaceholder } from "@/components/marketing/FutureRoutePlaceholder";

export const metadata: Metadata = {
  title: "Contact ResearchScholars",
  description:
    "Reach the ResearchScholars desk via WhatsApp, email, or the contact form for quotes, timelines, and collaboration questions.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <FutureRoutePlaceholder
      title="Contact centre"
      description="Multi-card layout with WhatsApp-first routing, structured contact form, and FAQ accordion will be implemented alongside backend handlers."
    />
  );
}
