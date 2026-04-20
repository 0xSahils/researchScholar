import type { Metadata } from "next";

import { PolicyLayout } from "@/components/legal/PolicyLayout";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How ResearchScholars.online collects, uses, retains, and protects personal data submitted through forms or messaging channels.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    title: "What we collect",
    points: [
      "Contact details you provide in forms, email, and messaging channels.",
      "Project-related files, guidelines, and revision notes required to deliver services.",
      "Basic device and usage analytics used to maintain site performance and security.",
    ],
  },
  {
    title: "How we use your information",
    points: [
      "To scope requests, assign subject-matched scholars, and deliver agreed outputs.",
      "To send operational updates including revisions, milestones, and support replies.",
      "To improve service quality, response time, and fraud prevention controls.",
    ],
  },
  {
    title: "Data retention and security",
    points: [
      "Project assets are retained only for operational and compliance windows.",
      "Access is restricted to required team members with role-based controls.",
      "Archived records are deleted or anonymised once no longer necessary.",
    ],
  },
  {
    title: "Your rights",
    points: [
      "You can request correction or deletion of personal data, subject to legal obligations.",
      "You can ask for a copy of your data associated with active engagements.",
      "You can withdraw marketing communications at any time.",
    ],
  },
] as const;

export default function PrivacyPage() {
  return (
    <PolicyLayout
      eyebrow="Privacy policy"
      title="How we handle and protect your information"
      intro="This policy explains how ResearchScholars.online collects, uses, stores, and protects data shared during service inquiries and active projects."
      sections={sections}
      effectiveDate="20 April 2026"
    />
  );
}
