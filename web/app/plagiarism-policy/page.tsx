import type { Metadata } from "next";

import { PolicyLayout } from "@/components/legal/PolicyLayout";

export const metadata: Metadata = {
  title: "Plagiarism and originality policy",
  description:
    "ResearchScholars originality workflows covering Turnitin and iThenticate checks, acceptable similarity bands, and revision responsibilities.",
  alternates: { canonical: "/plagiarism-policy" },
};

const sections = [
  {
    title: "Originality standards",
    points: [
      "All drafts are prepared from scratch based on the provided brief and references.",
      "Copy-paste reuse from prior projects is prohibited in delivery workflows.",
      "Citation and paraphrasing quality checks are built into review stages.",
    ],
  },
  {
    title: "Similarity checks",
    points: [
      "Similarity review may use Turnitin, iThenticate, or equivalent tools.",
      "Similarity percentages are interpreted contextually and not as a standalone quality signal.",
      "Where similarity risk exceeds target tolerance, revision is performed before final handover.",
    ],
  },
  {
    title: "Client cooperation",
    points: [
      "Clients should share all source material to avoid unintentional overlap with prior submissions.",
      "Any externally inserted content after delivery is outside our quality control.",
      "If institutions use different similarity settings, additional revision support can be requested.",
    ],
  },
  {
    title: "Ethical boundaries",
    points: [
      "Support is provided for academic structuring and writing quality, while authorship remains with the client.",
      "We do not support fraudulent, deceptive, or policy-violating submission practices.",
      "Cases raising integrity concerns may be declined at intake or paused during delivery.",
    ],
  },
] as const;

export default function PlagiarismPolicyPage() {
  return (
    <PolicyLayout
      eyebrow="Originality policy"
      title="Plagiarism and similarity governance"
      intro="This policy defines how originality checks are applied and how similarity issues are resolved during project delivery."
      sections={sections}
      effectiveDate="20 April 2026"
    />
  );
}
