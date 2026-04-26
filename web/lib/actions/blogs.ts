"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";

export type BlogBlock =
  | { type: "paragraph"; content: string }
  | { type: "heading2"; content: string }
  | { type: "heading3"; content: string }
  | { type: "bulletList"; items: string[] }
  | { type: "numberedList"; items: string[] }
  | { type: "image"; url: string; alt: string; caption?: string }
  | { type: "quote"; content: string; author?: string }
  | { type: "callout"; variant: "info" | "warning" | "tip"; content: string }
  | { type: "divider" }
  | { type: "link"; text: string; url: string; isExternal?: boolean }
  | { type: "table"; headers: string[]; rows: string[][] };

export interface BlogRecord {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  content: BlogBlock[];
  author_name: string | null;
  author_avatar_url: string | null;
  author_designation: string | null;
  category: string | null;
  tags: string[];
  meta_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  og_image_url: string | null;
  reading_time_minutes: number;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  view_count: number;
}

export async function getPublishedBlogs(page = 1, category = "all") {
  try {
    const db = createAdminClient();
    const from = (page - 1) * 9;
    const to = from + 8;

    let query = db
      .from("blogs")
      .select("*", { count: "exact" })
      .eq("is_published", true)
      .order("published_at", { ascending: false, nullsFirst: false })
      .range(from, to);
    if (category !== "all") query = query.eq("category", category);
    const { data, error, count } = await query;
    if (error) {
      if (error.message.includes("Could not find the table")) return { blogs: [], total: 0 };
      console.warn("[getPublishedBlogs]", error.message);
      return { blogs: [], total: 0 };
    }
    return { blogs: (data ?? []) as BlogRecord[], total: count ?? 0 };
  } catch (err) {
    console.warn("[getPublishedBlogs]", err);
    return { blogs: [], total: 0 };
  }
}

export async function getBlogBySlug(slug: string) {
  const db = createAdminClient();
  const { data, error } = await db
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  if (error) throw new Error(error.message);
  return data as BlogRecord;
}

export async function incrementBlogView(slug: string) {
  const db = createAdminClient();
  const { data } = await db.from("blogs").select("id, view_count").eq("slug", slug).single();
  if (!data) return;
  await db.from("blogs").update({ view_count: (data.view_count ?? 0) + 1 }).eq("id", data.id);
}

export async function getBlogCategories() {
  try {
    const db = createAdminClient();
    const { data, error } = await db
      .from("blog_categories")
      .select("id, name, slug, description, color")
      .order("name", { ascending: true });
    if (error) {
      if (error.message.includes("Could not find the table")) return [];
      console.warn("[getBlogCategories]", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.warn("[getBlogCategories]", err);
    return [];
  }
}

export async function createBlogCategory(input: { name: string; slug: string; color: string; description?: string }) {
  const db = createAdminClient();
  const { error } = await db.from("blog_categories").insert(input);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog/categories");
  revalidatePath("/blog");
}

export async function getPopularBlogs(limit = 5) {
  try {
    const db = createAdminClient();
    const { data, error } = await db
      .from("blogs")
      .select("id, title, slug, view_count, published_at")
      .eq("is_published", true)
      .order("view_count", { ascending: false })
      .limit(limit);
    if (error) {
      if (error.message.includes("Could not find the table")) return [];
      console.warn("[getPopularBlogs]", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.warn("[getPopularBlogs]", err);
    return [];
  }
}

export async function getAllPublishedSlugs(): Promise<{ slug: string; updated_at: string }[]> {
  try {
    const db = createAdminClient();
    const { data, error } = await db
      .from("blogs")
      .select("slug, updated_at")
      .eq("is_published", true);
    if (error) {
      if (error.message.includes("Could not find the table")) return [];
      console.warn("[getAllPublishedSlugs]", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    // Offline build, bad URL, DNS, firewall — do not fail `next build`
    console.warn("[getAllPublishedSlugs]", err);
    return [];
  }
}

export async function getAdminBlogs() {
  try {
    const db = createAdminClient();
    const { data, error } = await db
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      if (error.message.includes("Could not find the table")) return [];
      console.warn("[getAdminBlogs]", error.message);
      return [];
    }
    return (data ?? []) as BlogRecord[];
  } catch (err) {
    console.warn("[getAdminBlogs]", err);
    return [];
  }
}

export async function getBlogById(id: string) {
  const db = createAdminClient();
  const { data, error } = await db.from("blogs").select("*").eq("id", id).single();
  if (error) throw new Error(error.message);
  return data as BlogRecord;
}

export async function upsertBlog(input: Partial<BlogRecord> & { title: string; slug: string; content: BlogBlock[]; id?: string }) {
  const db = createAdminClient();
  const payload = {
    ...input,
    reading_time_minutes: input.reading_time_minutes ?? Math.max(1, Math.ceil(JSON.stringify(input.content).split(/\s+/).length / 200)),
    updated_at: new Date().toISOString(),
    published_at: input.is_published ? input.published_at ?? new Date().toISOString() : null,
  };

  if (input.id) {
    const { error } = await db.from("blogs").update(payload).eq("id", input.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await db.from("blogs").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${input.slug}`);
  revalidatePath("/admin/blog");
}

