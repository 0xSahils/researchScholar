import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { FeaturedCarousel } from "@/components/blog/FeaturedCarousel";
import { ContactDirectOrderLink } from "@/components/marketing/ContactDirectOrderLink";

import { getBlogCategories, getPopularBlogs, getPublishedBlogs } from "@/lib/actions/blogs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Academic Research Insights — ResearchScholars Blog",
  description: "PhD scholar perspectives on thesis writing, Scopus publication, methodology, and assignment strategy.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string; category?: string };
}) {
  const page = Number(searchParams.page ?? "1");
  const category = searchParams.category ?? "all";
  const [{ blogs, total }, categories, popular] = await Promise.all([
    getPublishedBlogs(page, category),
    getBlogCategories(),
    getPopularBlogs(5),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / 9));
  const featuredBlogs = blogs.slice(0, 3);

  return (
    <main className="mx-auto max-w-content px-6 py-14 lg:px-8">
      <section className="rounded-[1.5rem] bg-brand-deep p-8 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-light">Academic Insights</p>
        <h1 className="mt-2 font-heading text-4xl font-bold md:text-5xl">PhD Scholar Perspectives</h1>
        <p className="mt-3 max-w-2xl text-sm text-white/80">Evidence-backed practical guidance written for serious researchers and postgraduate scholars.</p>
      </section>

      <FeaturedCarousel features={featuredBlogs} />

      <div className="mt-8 flex flex-wrap gap-2">
        <Link href="/blog" className={`rounded-full px-4 py-1.5 text-xs font-semibold ${category === "all" ? "bg-brand-primary text-white" : "border border-surface-line bg-white text-ink"}`}>All</Link>
        {categories.map((cat) => (
          <Link key={cat.id} href={`/blog?category=${cat.name}`} className={`rounded-full px-4 py-1.5 text-xs font-semibold ${category === cat.name ? "bg-brand-primary text-white" : "border border-surface-line bg-white text-ink"}`}>
            {cat.name}
          </Link>
        ))}
      </div>

      <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {blogs.length ? blogs.map((post) => (
            <article key={post.id} className="overflow-hidden rounded-card border border-surface-line bg-white shadow-card">
              <div className="relative aspect-video">
                <Image src={post.cover_image_url ?? "https://picsum.photos/seed/blog-card/800/450"} alt={post.title} fill className="object-cover" loading="lazy" />
              </div>
              <div className="p-4">
                <p className="mb-1 text-xs font-semibold text-brand-primary">{post.category ?? "General"}</p>
                <h3 className="line-clamp-2 text-xl font-bold text-ink">{post.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-ink-muted">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-primary">Read More <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </article>
          )) : (
            <div className="col-span-full rounded-card border border-surface-line bg-white p-10 text-center text-ink-muted">No blog posts found for this category.</div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-card border border-surface-line bg-white p-4">
            <h3 className="font-semibold text-ink">Popular Posts</h3>
            <div className="mt-3 space-y-2">
              {popular.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="block text-sm text-brand-primary hover:underline">{post.title}</Link>
              ))}
            </div>
          </div>
          <div className="rounded-card border border-surface-line bg-white p-4">
            <h3 className="font-semibold text-ink">Need Research Help?</h3>
            <p className="mt-2 text-sm text-ink-muted">Talk to a PhD expert and place your order directly.</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/order" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-primary">
                Place Your Order <ArrowRight className="h-4 w-4" />
              </Link>
              <ContactDirectOrderLink size="compact" message="Hello, I need research help from ResearchScholars." />
            </div>
          </div>
        </aside>
      </section>

      <div className="mt-8 flex items-center justify-center gap-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <Link key={index} href={`/blog?page=${index + 1}${category !== "all" ? `&category=${category}` : ""}`} className={`h-9 w-9 rounded-full text-center text-sm leading-9 ${page === index + 1 ? "bg-brand-primary text-white" : "border border-surface-line bg-white text-ink"}`}>
            {index + 1}
          </Link>
        ))}
      </div>
    </main>
  );
}
