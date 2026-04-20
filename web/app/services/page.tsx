import type { Metadata } from "next";
import { ServicesComposition } from "@/components/services/ServicesComposition";

export const metadata: Metadata = {
  title: "Academic services overview",
  description:
    "Explore thesis writing, dissertations, research papers, assignments, synopsis support, and Scopus publication assistance delivered by verified PhD scholars.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return <ServicesComposition />;
}
