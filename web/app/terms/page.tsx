import type { Metadata } from "next";

import { FutureRoutePlaceholder } from "@/components/marketing/FutureRoutePlaceholder";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "Terms governing use of ResearchScholars.online, engagement scope, payment milestones, and limitation of liability.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <FutureRoutePlaceholder
      title="Terms of service draft"
      description="Insert final commercial terms, dispute resolution clauses, and academic integrity guardrails before launch."
    />
  );
}
