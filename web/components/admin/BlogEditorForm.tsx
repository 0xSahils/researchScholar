"use client";

import { useMemo, useState, useTransition } from "react";
import { upsertBlog, type BlogBlock } from "@/lib/actions/blogs";

const emptyBlock: BlogBlock = { type: "paragraph", content: "" };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlogEditorForm({ categories, initial }: { categories: any[]; initial?: any }) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [content, setContent] = useState<BlogBlock[]>(initial?.content?.length ? initial.content : [emptyBlock]);
  const [savedAt, setSavedAt] = useState<string>("");
  const [isPublished, setIsPublished] = useState(Boolean(initial?.is_published));

  const computedSlug = useMemo(() => {
    const source = slug || title;
    return source.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 60);
  }, [slug, title]);

  const save = () => {
    startTransition(async () => {
      await upsertBlog({
        id: initial?.id,
        title,
        slug: computedSlug,
        excerpt,
        category,
        content,
        is_published: isPublished,
        author_name: initial?.author_name ?? "ResearchScholars Editorial",
      });
      setSavedAt(new Date().toLocaleTimeString("en-IN"));
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
      <section className="rounded-2xl border border-white/[0.06] bg-white p-6 text-zinc-900">
        <input value={title} onChange={(event) => setTitle(event.target.value)} className="w-full border-none bg-transparent text-4xl font-bold outline-none placeholder:text-zinc-400" placeholder="Post Title..." />
        <div className="mt-5 space-y-4">
          {content.map((block, index) => (
            <div key={index} className="rounded-xl border border-zinc-200 p-3">
              <select
                value={block.type}
                onChange={(event) => {
                  const next = [...content];
                  const type = event.target.value as BlogBlock["type"];
                  next[index] = type === "bulletList" || type === "numberedList"
                    ? { type, items: [""] }
                    : type === "divider"
                      ? { type }
                      : { type: "paragraph", content: "" };
                  setContent(next);
                }}
                className="mb-2 rounded border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 outline-none"
              >
                <option value="paragraph">Paragraph</option>
                <option value="heading2">Heading 2</option>
                <option value="heading3">Heading 3</option>
                <option value="bulletList">Bullet list</option>
                <option value="numberedList">Numbered list</option>
                <option value="divider">Divider</option>
              </select>
              {"content" in block ? (
                <textarea value={block.content} onChange={(event) => {
                  const next = [...content];
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (next[index] as any).content = event.target.value;
                  setContent(next);
                }} rows={block.type === "paragraph" ? 4 : 2} className="w-full rounded border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-800 outline-none placeholder:text-zinc-400" />
              ) : null}
            </div>
          ))}
          <button type="button" onClick={() => setContent((prev) => [...prev, emptyBlock])} className="rounded border border-zinc-300 px-3 py-1 text-xs text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900">+ Add block</button>
        </div>
      </section>
      <aside className="space-y-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-white">
        <h2 className="font-semibold">SEO & Publish</h2>
        <div>
          <label className="mb-1 block text-xs text-white/60">Slug</label>
          <input value={computedSlug} onChange={(event) => setSlug(event.target.value)} className="w-full rounded-lg border border-white/[0.1] bg-transparent px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/60">Excerpt</label>
          <textarea value={excerpt} onChange={(event) => setExcerpt(event.target.value)} rows={4} className="w-full rounded-lg border border-white/[0.1] bg-transparent px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/60">Category</label>
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full rounded-lg border border-white/[0.1] bg-transparent px-3 py-2 text-sm">
            <option value="">Select</option>
            {categories.map((cat) => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isPublished} onChange={(event) => setIsPublished(event.target.checked)} />
          Published
        </label>
        <button type="button" onClick={save} disabled={isPending} className="w-full rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white">
          {isPending ? "Saving..." : "Save"}
        </button>
        {savedAt ? <p className="text-xs text-white/50">Saved at {savedAt}</p> : null}
      </aside>
    </div>
  );
}
