import type { Metadata } from "next";

import { FutureRoutePlaceholder } from "@/components/marketing/FutureRoutePlaceholder";

export const metadata: Metadata = {
  title: "Plagiarism and originality policy",
  description:
    "ResearchScholars originality workflows covering Turnitin and iThenticate checks, acceptable similarity bands, and revision responsibilities.",
  alternates: { canonical: "/plagiarism-policy" },
};

export default function PlagiarismPolicyPage() {
  return (
    <FutureRoutePlaceholder
      title="Plagiarism policy draft"
      description="Document similarity thresholds, certificate issuance, and how clients should cite collaborative support within institutional rules."
    />
  );
}
