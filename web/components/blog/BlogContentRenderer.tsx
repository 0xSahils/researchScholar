import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowSquareOut, Diamond, Info, Lightbulb, Warning } from "@phosphor-icons/react/dist/ssr";
import type { BlogBlock } from "@/lib/actions/blogs";

export function BlogContentRenderer({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="space-y-2">
      {blocks.map((block, index) => {
        if (block.type === "paragraph") return <p key={index} className="mb-6 text-[17px] leading-[1.85] text-ink-muted">{block.content}</p>;
        if (block.type === "heading2")
          return (
            <h2 key={index} id={`section-${index}`} className="mb-4 mt-12 scroll-mt-28 border-l-4 border-brand-primary pl-4 font-heading text-3xl font-bold text-ink">
              {block.content}
            </h2>
          );
        if (block.type === "heading3")
          return (
            <h3 key={index} id={`section-${index}`} className="mb-3 mt-8 scroll-mt-28 font-heading text-2xl font-bold text-ink">
              {block.content}
            </h3>
          );
        if (block.type === "image") {
          return (
            <figure key={index} className="my-8">
              <Image src={block.url} alt={block.alt} width={1200} height={675} className="w-full rounded-xl object-cover" />
              {block.caption ? <figcaption className="mt-2 text-sm italic text-ink-muted">{block.caption}</figcaption> : null}
            </figure>
          );
        }
        if (block.type === "bulletList") {
          return (
            <ul key={index} className="mb-6 space-y-2">
              {block.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[17px] text-ink-muted">
                  <ArrowRight className="mt-1 h-4 w-4 text-brand-primary" />
                  {item}
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "numberedList") {
          return (
            <ol key={index} className="mb-6 space-y-3">
              {block.items.map((item, itemIndex) => (
                <li key={item} className="flex items-start gap-3 text-[17px] text-ink-muted">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-light font-mono text-sm font-semibold text-brand-primary">{itemIndex + 1}</span>
                  {item}
                </li>
              ))}
            </ol>
          );
        }
        if (block.type === "quote") return <blockquote key={index} className="my-8 rounded-lg border-l-4 border-brand-gold bg-[#FFFDE7] px-6 py-5 italic text-ink">{block.content}{block.author ? <p className="mt-2 text-xs not-italic text-ink-muted">- {block.author}</p> : null}</blockquote>;
        if (block.type === "callout") {
          const meta = block.variant === "warning"
            ? { icon: Warning, className: "bg-orange-50 text-orange-800" }
            : block.variant === "tip"
              ? { icon: Lightbulb, className: "bg-green-50 text-green-800" }
              : { icon: Info, className: "bg-blue-50 text-blue-800" };
          const Icon = meta.icon;
          return (
            <aside key={index} className={`my-6 flex items-start gap-3 rounded-lg p-4 ${meta.className}`}>
              <Icon className="mt-0.5 h-5 w-5" />
              <p>{block.content}</p>
            </aside>
          );
        }
        if (block.type === "divider") return <div key={index} className="my-8 flex items-center gap-3"><div className="h-px flex-1 bg-brand-primary/20" /><Diamond className="h-4 w-4 text-brand-primary" /><div className="h-px flex-1 bg-brand-primary/20" /></div>;
        if (block.type === "link") return <p key={index} className="mb-6"><Link href={block.url} target={block.isExternal ? "_blank" : undefined} rel={block.isExternal ? "noreferrer" : undefined} className="inline-flex items-center gap-1 underline text-brand-primary">{block.text}{block.isExternal ? <ArrowSquareOut className="h-4 w-4" /> : null}</Link></p>;
        if (block.type === "table") {
          return (
            <div key={index} className="my-8 overflow-x-auto rounded-card border border-surface-line">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-brand-primary text-white">
                  <tr>{block.headers.map((header) => <th key={header} className="px-4 py-2">{header}</th>)}</tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex % 2 ? "bg-white" : "bg-brand-light/20"}>
                      {row.map((cell, cellIndex) => <td key={cellIndex} className="px-4 py-2 text-ink-muted">{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
