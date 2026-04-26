import type { MetadataRoute } from "next";

import { getAllPublishedSlugs } from "@/lib/actions/blogs";
import { siteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const staticRoutes = routes.map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: (path === "" ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: path === "" ? 1 : path === "/services" || path === "/scopus-publication" ? 0.9 : 0.7,
  }));

  const blogSlugs = await getAllPublishedSlugs();
  const blogRoutes = blogSlugs.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
