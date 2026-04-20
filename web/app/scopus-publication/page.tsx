import type { Metadata } from "next";

import { FutureRoutePlaceholder } from "@/components/marketing/FutureRoutePlaceholder";

export const metadata: Metadata = {
  title: "Scopus journal publication support",
  description:
    "Educational overview of Scopus indexing, rejection avoidance, and how PhD scholars support manuscript preparation through acceptance.",
  alternates: { canonical: "/scopus-publication" },
};

export default function ScopusPublicationPage() {
  return (
    <FutureRoutePlaceholder
      title="Scopus publication deep-dive page"
      description="The editorial long-form experience (bar charts, vertical timelines, FAQs) will mirror the v3 specification. For urgent publication support, start with a WhatsApp brief so we can sanity-check journal fit."
    />
  );
}
