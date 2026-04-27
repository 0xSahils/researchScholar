import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

import { BlogContentRenderer } from "@/components/blog/BlogContentRenderer";
import { BlogReadingProgress } from "@/components/blog/BlogReadingProgress";
import { BlogTableOfContents } from "@/components/blog/BlogTableOfContents";
import { getAllPublishedSlugs, getBlogBySlug, getPublishedBlogs, incrementBlogView } from "@/lib/actions/blogs";
import { siteConfig } from "@/lib/site-config";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const slugs = await getAllPublishedSlugs();
    return slugs.map((item) => ({ slug: item.slug }));
  } catch {
    // Supabase unreachable during CI/build — pages still work via ISR on first request
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const post = await getBlogBySlug(params.slug);
    return {
      title: post.meta_title ?? post.title,
      description: post.meta_description ?? post.excerpt ?? "",
      alternates: { canonical: `/blog/${post.slug}` },
      openGraph: {
        title: post.meta_title ?? post.title,
        description: post.meta_description ?? post.excerpt ?? "",
        images: [{ url: post.og_image_url ?? post.cover_image_url ?? "", width: 1200, height: 630, alt: post.title }],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: post.meta_title ?? post.title,
        description: post.meta_description ?? post.excerpt ?? "",
        images: [post.og_image_url ?? post.cover_image_url ?? ""],
      },
    };
  } catch {
    return { title: "Blog Post" };
  }
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  let post;
  try {
    post = await getBlogBySlug(params.slug);
  } catch {
    notFound();
  }

  incrementBlogView(params.slug).catch(() => undefined);
  const relatedResult = await getPublishedBlogs(1, post.category ?? "all");
  const related = relatedResult.blogs.filter((item) => item.id !== post.id).slice(0, 3);

  const canonical = `${siteConfig.siteUrl.replace(/\/$/, "")}/blog/${post.slug}`;
  const cover = post.og_image_url ?? post.cover_image_url ?? `${siteConfig.siteUrl}/og-default.png`;
  const published = post.published_at ?? post.created_at;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.meta_description ?? post.excerpt ?? undefined,
    image: cover,
    datePublished: published,
    dateModified: post.updated_at,
    author: {
      "@type": "Person",
      name: post.author_name ?? "ResearchScholars Editorial",
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.legalName,
      url: siteConfig.siteUrl,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
  };

  return (
    <main>
      <BlogReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative h-[420px]">
        <Image src={post.cover_image_url ?? "https://picsum.photos/seed/blog-hero/1600/900"} alt={post.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-content flex-col justify-end px-6 pb-10 text-white lg:px-8">
          <span className="mb-3 w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">{post.category ?? "General"}</span>
          <h1 className="max-w-4xl font-heading text-4xl font-bold md:text-[52px]">{post.title}</h1>
          <p className="mt-2 text-sm text-white/80">{post.author_name ?? "ResearchScholars Editorial"} · {post.reading_time_minutes} min read</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-content gap-8 px-6 py-12 lg:grid-cols-[1fr_280px] lg:px-8">
        <article>
          <BlogContentRenderer blocks={post.content ?? []} />
          <div className="mt-8 rounded-card border border-surface-line bg-white p-5">
            <p className="text-sm font-semibold text-ink">{post.author_name ?? "ResearchScholars Editorial"}</p>
            <p className="text-sm text-brand-primary">{post.author_designation ?? "PhD Research Team"}</p>
            <Link href="/blog" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand-primary">
              View all posts <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </article>
        <aside className="space-y-4">
          <BlogTableOfContents blocks={post.content} />
          <div className="rounded-card border border-surface-line bg-white p-4">
            <h3 className="font-semibold text-ink">Related posts</h3>
            <div className="mt-3 space-y-2">
              {related.map((item) => (
                <Link key={item.id} href={`/blog/${item.slug}`} className="block text-sm text-brand-primary hover:underline">{item.title}</Link>
              ))}
            </div>
          </div>
          <div className="rounded-card bg-brand-deep p-4 text-white">
            <h3 className="font-semibold">Need Help With Your Research?</h3>
            <Link href="/order" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand-light">
              Place Your Order <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
