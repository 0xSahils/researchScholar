"use client";

import type { BlogBlock } from "@/lib/actions/blogs";

export type TocItem = { index: number; level: "heading2" | "heading3"; text: string };

export function BlogTableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="On this page" className="rounded-card border border-surface-line bg-white p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">On this page</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.index} className={item.level === "heading3" ? "pl-3" : ""}>
            <a href={`#section-${item.index}`} className="text-brand-primary hover:underline">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function buildTocFromBlocks(blocks: BlogBlock[] | null | undefined): TocItem[] {
  if (!blocks?.length) return [];
  const out: TocItem[] = [];
  blocks.forEach((block, index) => {
    if (block.type === "heading2" || block.type === "heading3") {
      out.push({ index, level: block.type, text: block.content });
    }
  });
  return out;
}
