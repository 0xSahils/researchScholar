import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  const lastModified = new Date();

  const routes = [
    "",
    "/about",
    "/services",
    "/scopus-publication",
    "/research-support",
    "/order",
    "/track-order",
    "/contact",
    "/privacy",
    "/terms",
    "/plagiarism-policy",
  ];

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
