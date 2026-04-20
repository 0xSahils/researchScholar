import type { Metadata } from "next";

import { FutureRoutePlaceholder } from "@/components/marketing/FutureRoutePlaceholder";

export const metadata: Metadata = {
  title: "Research support and the academic writing gap",
  description:
    "Understand systemic barriers Indian researchers face and how structured PhD-led support reduces friction without compromising authorship integrity.",
  alternates: { canonical: "/research-support" },
};

export default function ResearchSupportPage() {
  return (
    <FutureRoutePlaceholder
      title="Research support narrative page"
      description="This page will host the typographic statistics, expandable barrier cards, and methodology timeline described in the ResearchScholars project brief."
    />
  );
}
