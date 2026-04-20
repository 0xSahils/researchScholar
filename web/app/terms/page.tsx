import type { Metadata } from "next";

import { PolicyLayout } from "@/components/legal/PolicyLayout";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "Terms governing use of ResearchScholars.online, engagement scope, payment milestones, and limitation of liability.",
  alternates: { canonical: "/terms" },
};

const sections = [
  {
    title: "Scope of services",
    points: [
      "Services include structured writing support, editorial guidance, and publication assistance as explicitly agreed in writing.",
      "Client-provided inputs must be accurate, complete, and lawful to use.",
      "Outputs are delivered according to agreed milestones, timelines, and revision windows.",
    ],
  },
  {
    title: "Payments and revisions",
    points: [
      "Pricing and payment milestones are confirmed before work starts.",
      "Revision support applies within the scope and deadline defined in your order.",
      "Major scope expansion or new requirements may require a revised quote.",
    ],
  },
  {
    title: "Client responsibilities",
    points: [
      "You remain responsible for final submission decisions and institutional compliance.",
      "You must review deliverables promptly and provide consolidated feedback.",
      "Delays in response may shift timelines and delivery commitments.",
    ],
  },
  {
    title: "Limitations and liability",
    points: [
      "No service can guarantee journal acceptance, grade outcomes, or third-party decisions.",
      "Liability is limited to amounts paid for the specific service in dispute, where permitted by law.",
      "Disputes should first be escalated to support for internal resolution.",
    ],
  },
] as const;

export default function TermsPage() {
  return (
    <PolicyLayout
      eyebrow="Terms of service"
      title="Service terms for all engagements"
      intro="These terms govern your use of ResearchScholars.online and any project delivered through our support channels."
      sections={sections}
      effectiveDate="20 April 2026"
    />
  );
}
