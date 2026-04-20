import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.legalName} | PhD-led academic writing and Scopus support`,
    template: `%s | ${siteConfig.legalName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.legalName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: siteConfig.legalName,
    title: siteConfig.legalName,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.legalName,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "education",
};
