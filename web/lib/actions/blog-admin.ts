"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";

export async function toggleBlogPublish(id: string, publish: boolean) {
  const db = createAdminClient();
  const { error } = await db
    .from("blogs")
    .update({ is_published: publish, published_at: publish ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function deleteBlog(id: string) {
  const db = createAdminClient();
  const { error } = await db.from("blogs").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function deleteBlogCategory(id: string) {
  const db = createAdminClient();
  const { error } = await db.from("blog_categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog/categories");
  revalidatePath("/blog");
}
