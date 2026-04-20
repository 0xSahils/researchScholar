import type { Metadata } from "next";

import { HomeComposition } from "@/components/home/HomeComposition";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "PhD-led thesis, dissertation, and Scopus publication support",
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "/",
    title: `${siteConfig.legalName} | Academic writing and publication desk`,
    description: siteConfig.description,
  },
};

export default function HomePage() {
  return <HomeComposition />;
}
