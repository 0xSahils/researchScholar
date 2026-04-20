import type { Metadata } from "next";

import { AboutComposition } from "@/components/about/AboutComposition";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About our PhD scholar bench and research desk",
  description: `Learn how ${siteConfig.legalName} pairs verified doctoral scholars with structured academic writing, indexed journal workflows, and governed originality checks for students and faculty in India.`,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    url: "/about",
    title: `About | ${siteConfig.legalName}`,
    description: `Mission, values, and scholar credentials behind ${siteConfig.legalName}.`,
  },
};

export default function AboutPage() {
  return <AboutComposition />;
}
