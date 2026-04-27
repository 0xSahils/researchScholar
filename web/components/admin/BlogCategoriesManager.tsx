"use client";

import { useState, useTransition } from "react";
import { Trash } from "@phosphor-icons/react";
import { createBlogCategory } from "@/lib/actions/blogs";
import { deleteBlogCategory } from "@/lib/actions/blog-admin";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlogCategoriesManager({ categories }: { categories: any[] }) {
  const [form, setForm] = useState({ name: "", slug: "", color: "#1F7A45" });
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-white">Blog Categories</h1>
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value, slug: event.target.value.toLowerCase().replace(/\s+/g, "-") }))} className="rounded-xl border border-white/[0.1] bg-transparent px-3 py-2 text-sm text-white" placeholder="Category name" />
          <input value={form.slug} onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))} className="rounded-xl border border-white/[0.1] bg-transparent px-3 py-2 text-sm text-white" placeholder="slug" />
          <input type="color" value={form.color} onChange={(event) => setForm((prev) => ({ ...prev, color: event.target.value }))} className="h-10 rounded-xl border border-white/[0.1] bg-transparent" />
          <button
            type="button"
            disabled={isPending}
            className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white"
            onClick={() => startTransition(async () => { await createBlogCategory(form); setForm({ name: "", slug: "", color: "#1F7A45" }); })}
          >
            Add
          </button>
        </div>
      </div>
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02]">
        {categories.map((cat) => (
          <div key={cat.id} className="grid grid-cols-[1fr_1fr_120px_40px] items-center border-b border-white/[0.05] px-4 py-3 text-sm text-white/80">
            <p>{cat.name}</p>
            <p className="text-white/40">{cat.slug}</p>
            <span className="rounded-full px-3 py-1 text-center text-xs font-semibold text-white" style={{ backgroundColor: cat.color }}>{cat.color}</span>
            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                if (confirm(`Delete category: ${cat.name}?`)) {
                  startTransition(async () => { await deleteBlogCategory(cat.id); });
                }
              }}
              className="flex justify-end text-white/20 hover:text-red-400 transition"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
