import type { Metadata } from "next";

import { FutureRoutePlaceholder } from "@/components/marketing/FutureRoutePlaceholder";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How ResearchScholars.online collects, uses, retains, and protects personal data submitted through forms or messaging channels.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <FutureRoutePlaceholder
      title="Privacy policy draft"
      description="Legal counsel should replace this placeholder with jurisdiction-specific language covering WhatsApp transcripts, file retention, subprocessors, and deletion rights."
    />
  );
}
