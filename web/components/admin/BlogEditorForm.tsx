"use client";

import { useMemo, useState, useTransition, useRef } from "react";
import { upsertBlog, type BlogBlock } from "@/lib/actions/blogs";
import { Image, Trash } from "@phosphor-icons/react";
import NextImage from "next/image";

const emptyBlock: BlogBlock = { type: "paragraph", content: "" };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlogEditorForm({ categories, initial }: { categories: any[]; initial?: any }) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(initial?.cover_image_url ?? "");
  const [content, setContent] = useState<BlogBlock[]>(initial?.content?.length ? initial.content : [emptyBlock]);
  const [savedAt, setSavedAt] = useState<string>("");
  const [isPublished, setIsPublished] = useState(Boolean(initial?.is_published));
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  const computedSlug = useMemo(() => {
    const source = slug || title;
    return source.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 60);
  }, [slug, title]);

  const handleImageUpload = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload-image", { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url;
  };

  const save = () => {
    startTransition(async () => {
      await upsertBlog({
        id: initial?.id,
        title,
        slug: computedSlug,
        excerpt,
        category,
        content,
        cover_image_url: coverImageUrl || null,
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
            <div key={index} className="relative rounded-xl border border-zinc-200 p-3 group">
              <button
                type="button"
                onClick={() => setContent(content.filter((_, i) => i !== index))}
                className="absolute top-2 right-2 p-1.5 text-zinc-400 hover:text-red-500 rounded bg-white shadow-sm opacity-0 group-hover:opacity-100 transition"
                title="Delete block"
              >
                <Trash className="w-4 h-4" />
              </button>
              
              <select
                value={block.type}
                onChange={(event) => {
                  const next = [...content];
                  const type = event.target.value as BlogBlock["type"];
                  next[index] = type === "bulletList" || type === "numberedList"
                    ? { type, items: [""] }
                    : type === "image"
                      ? { type, url: "", alt: "" }
                    : type === "quote"
                      ? { type, content: "", author: "" }
                    : type === "callout"
                      ? { type, content: "", variant: "info" }
                    : type === "link"
                      ? { type, text: "", url: "", isExternal: false }
                    : type === "table"
                      ? { type, headers: ["Column 1", "Column 2"], rows: [["", ""]] }
                      : type === "divider"
                        ? { type }
                        : { type, content: "" } as any;
                  setContent(next);
                }}
                className="mb-3 rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs text-zinc-800 outline-none w-auto block select-none"
              >
                <option value="paragraph">Paragraph</option>
                <option value="heading2">Heading 2</option>
                <option value="heading3">Heading 3</option>
                <option value="bulletList">Bullet list</option>
                <option value="numberedList">Numbered list</option>
                <option value="quote">Quote</option>
                <option value="callout">Callout Box</option>
                <option value="link">Link</option>
                <option value="table">Table</option>
                <option value="image">Image</option>
                <option value="divider">Divider</option>
              </select>

              {/* RENDER BLOCK INPUTS */}
              {"content" in block ? (
                <textarea
                  value={block.content}
                  onChange={(event) => {
                    const next = [...content];
                    (next[index] as any).content = event.target.value;
                    setContent(next);
                  }}
                  placeholder={block.type.startsWith("heading") ? "Heading text..." : block.type === "quote" ? "Quote text..." : block.type === "callout" ? "Callout text..." : "Start typing..."}
                  rows={block.type === "paragraph" ? 4 : 2}
                  className="w-full rounded border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
                />
              ) : null}

              {block.type === "quote" && (
                <input
                  type="text"
                  placeholder="Author (optional)"
                  value={block.author || ""}
                  onChange={(e) => {
                    const next = [...content];
                    (next[index] as any).author = e.target.value;
                    setContent(next);
                  }}
                  className="w-full mt-2 rounded border border-zinc-200 bg-transparent px-3 py-1.5 text-xs text-zinc-800 outline-none"
                />
              )}

              {block.type === "callout" && (
                <select
                  value={block.variant}
                  onChange={(e) => {
                    const next = [...content];
                    (next[index] as any).variant = e.target.value;
                    setContent(next);
                  }}
                  className="w-full mt-2 rounded border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-800 outline-none"
                >
                  <option value="info">Info (Blue)</option>
                  <option value="warning">Warning (Orange)</option>
                  <option value="tip">Tip (Green)</option>
                </select>
              )}

              {block.type === "link" && (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Link Text"
                    value={block.text}
                    onChange={(e) => {
                      const next = [...content];
                      (next[index] as any).text = e.target.value;
                      setContent(next);
                    }}
                    className="w-full rounded border border-zinc-200 bg-transparent px-3 py-1.5 text-xs text-zinc-800 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="URL (e.g. https://...)"
                    value={block.url}
                    onChange={(e) => {
                      const next = [...content];
                      (next[index] as any).url = e.target.value;
                      setContent(next);
                    }}
                    className="w-full rounded border border-zinc-200 bg-transparent px-3 py-1.5 text-xs text-zinc-800 outline-none"
                  />
                  <label className="col-span-2 flex items-center text-xs text-zinc-600 gap-2 font-medium select-none">
                    <input
                      type="checkbox"
                      checked={!!block.isExternal}
                      onChange={(e) => {
                        const next = [...content];
                        (next[index] as any).isExternal = e.target.checked;
                        setContent(next);
                      }}
                    />
                    External Link (Opens in new tab)
                  </label>
                </div>
              )}

              {block.type === "table" && (
                <div className="space-y-4">
                  <div className="overflow-x-auto border rounded-xl border-zinc-200">
                    <table className="w-full text-left text-xs text-zinc-800 min-w-[300px]">
                      <thead className="bg-zinc-100/50">
                        <tr>
                          {block.headers.map((h, cidx) => (
                            <th key={cidx} className="p-0 border-r border-zinc-200 last:border-0 relative group/th">
                              <input
                                value={h}
                                onChange={(e) => {
                                  const n = [...content];
                                  (n[index] as any).headers[cidx] = e.target.value;
                                  setContent(n);
                                }}
                                className="w-full bg-transparent outline-none p-2 font-semibold min-w-[100px]"
                                placeholder="Header"
                              />
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {block.rows.map((row, ridx) => (
                          <tr key={ridx} className="border-t border-zinc-200">
                            {row.map((cell, cidx) => (
                              <td key={cidx} className="p-0 border-r border-zinc-200 last:border-0">
                                <input
                                  value={cell}
                                  onChange={(e) => {
                                    const n = [...content];
                                    (n[index] as any).rows[ridx][cidx] = e.target.value;
                                    setContent(n);
                                  }}
                                  className="w-full bg-transparent outline-none p-2 min-w-[100px]"
                                  placeholder="Cell content"
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 shadow-sm text-xs font-semibold"
                      onClick={() => {
                        const n = [...content];
                        (n[index] as any).headers.push(`Column ${(n[index] as any).headers.length + 1}`);
                        (n[index] as any).rows.forEach((r: any) => r.push(""));
                        setContent(n);
                      }}
                    >
                      + Add Column
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 shadow-sm text-xs font-semibold"
                      onClick={() => {
                        const n = [...content];
                        (n[index] as any).rows.push(new Array((n[index] as any).headers.length).fill(""));
                        setContent(n);
                      }}
                    >
                      + Add Row
                    </button>
                  </div>
                </div>
              )}

              {"items" in block ? (
                <div className="space-y-2">
                  <textarea
                    value={block.items.join("\n")}
                    onChange={(event) => {
                      const next = [...content];
                      (next[index] as any).items = event.target.value.split("\n");
                      setContent(next);
                    }}
                    placeholder="Enter items separated by newlines..."
                    rows={4}
                    className="w-full rounded border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
                  />
                  <p className="text-[10px] text-zinc-400">Put each list item on a new line.</p>
                </div>
              ) : null}

              {block.type === "image" && (
                <div className="space-y-3">
                  {block.url ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-zinc-200">
                      <NextImage src={block.url} alt="preview" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...content];
                          (next[index] as any).url = "";
                          setContent(next);
                        }}
                        className="absolute top-2 right-2 bg-white text-red-500 text-xs px-2 py-1 rounded shadow-md font-semibold"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-zinc-300 rounded-lg bg-zinc-50 hover:bg-zinc-100 cursor-pointer text-zinc-500 transition">
                      <Image className="w-6 h-6 mb-2" />
                      <span className="text-xs font-medium">Click to upload image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const url = await handleImageUpload(file);
                            const next = [...content];
                            (next[index] as any).url = url;
                            setContent(next);
                          } catch (err) {
                            alert("Failed to upload image");
                          }
                        }}
                      />
                    </label>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Alt text (for SEO)"
                      value={block.alt}
                      onChange={(e) => {
                        const next = [...content];
                        (next[index] as any).alt = e.target.value;
                        setContent(next);
                      }}
                      className="w-full rounded border border-zinc-200 bg-transparent px-3 py-1.5 text-xs text-zinc-800 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Caption (optional)"
                      value={block.caption || ""}
                      onChange={(e) => {
                        const next = [...content];
                        (next[index] as any).caption = e.target.value;
                        setContent(next);
                      }}
                      className="w-full rounded border border-zinc-200 bg-transparent px-3 py-1.5 text-xs text-zinc-800 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
          <button type="button" onClick={() => setContent((prev) => [...prev, emptyBlock])} className="rounded border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 border-dashed w-full text-center">+ Add block</button>
        </div>
      </section>
      <aside className="space-y-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-white">
        <h2 className="font-semibold">SEO & Publish</h2>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-white/60">Cover Image</label>
          {coverImageUrl ? (
            <div className="relative aspect-video rounded-lg overflow-hidden border border-white/[0.1] mb-2">
              <NextImage src={coverImageUrl} alt="Cover Preview" fill className="object-cover" />
              <button
                type="button"
                onClick={() => setCoverImageUrl("")}
                className="absolute top-1.5 right-1.5 bg-black/60 text-white hover:text-red-400 text-[10px] px-2 py-1 rounded-md"
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => coverImageInputRef.current?.click()}
              className="w-full aspect-video rounded-lg border border-dashed border-white/[0.2] bg-white/[0.02] flex flex-col items-center justify-center text-white/40 hover:text-white/60 hover:border-white/[0.4] transition text-xs mb-2"
            >
              <Image className="w-5 h-5 mb-1" />
              Upload Cover Image
            </button>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={coverImageInputRef}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const url = await handleImageUpload(file);
                setCoverImageUrl(url);
              } catch (err) {
                alert("Failed to upload cover image");
              }
            }}
          />
        </div>
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
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full rounded-lg border border-white/[0.1] bg-[#0d1410] px-3 py-2 text-sm text-white">
            <option value="">Select</option>
            {categories.map((cat) => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isPublished} onChange={(event) => setIsPublished(event.target.checked)} />
          Published
        </label>
        <button type="button" onClick={save} disabled={isPending} className="w-full rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-deep transition">
          {isPending ? "Saving..." : "Save Blog Post"}
        </button>
        {savedAt ? <p className="text-xs text-brand-accent text-center">Saved successfully at {savedAt}</p> : null}
      </aside>
    </div>
  );
}
