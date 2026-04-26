"use client";

import Link from "next/link";
import { useTransition } from "react";
import { toggleBlogPublish } from "@/lib/actions/blog-admin";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlogAdminTable({ blogs }: { blogs: any[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold text-white">Blog Posts</h1>
        <Link href="/admin/blog/new" className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white">
          New Blog Post
        </Link>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
        <div className="grid grid-cols-[2fr_1fr_120px_120px_220px] gap-3 border-b border-white/[0.06] px-5 py-3 text-[10px] uppercase tracking-widest text-white/30">
          <p>Title</p><p>Category</p><p>Status</p><p>Views</p><p>Actions</p>
        </div>
        {blogs.map((blog) => (
          <div key={blog.id} className="grid grid-cols-[2fr_1fr_120px_120px_220px] gap-3 border-b border-white/[0.05] px-5 py-3 text-sm text-white/80">
            <p className="truncate">{blog.title}</p>
            <p>{blog.category ?? "General"}</p>
            <p>{blog.is_published ? "Published" : "Draft"}</p>
            <p>{blog.view_count ?? 0}</p>
            <div className="flex items-center gap-2">
              <Link href={`/admin/blog/${blog.id}/edit`} className="text-brand-accent">Edit</Link>
              <button
                type="button"
                disabled={pending}
                className="text-brand-light"
                onClick={() => startTransition(async () => { await toggleBlogPublish(blog.id, !blog.is_published); })}
              >
                {blog.is_published ? "Unpublish" : "Publish"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
