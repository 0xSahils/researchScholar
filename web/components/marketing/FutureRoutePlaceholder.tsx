import Link from "next/link";

import { whatsappHref } from "@/lib/site-config";

type FutureRoutePlaceholderProps = {
  title: string;
  description: string;
  bullets?: string[];
};

export function FutureRoutePlaceholder({
  title,
  description,
  bullets = [],
}: FutureRoutePlaceholderProps) {
  return (
    <section className="mx-auto max-w-content px-6 py-24 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">Phase one routing</p>
      <h1 className="mt-3 font-heading text-4xl font-bold text-ink">{title}</h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-muted">{description}</p>
      {bullets.length > 0 ? (
        <ul className="mt-6 max-w-3xl list-disc space-y-2 pl-5 text-sm text-ink-muted">
          {bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/order"
          className="rounded-btn bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-brand-deep"
        >
          Place your order
        </Link>
        <Link
          href={whatsappHref()}
          className="rounded-btn border border-brand-primary/30 px-5 py-2.5 text-sm font-semibold text-brand-primary transition hover:border-brand-primary"
        >
          WhatsApp the desk
        </Link>
        <Link href="/" className="rounded-btn px-5 py-2.5 text-sm font-semibold text-ink-muted hover:text-brand-primary">
          Back to home
        </Link>
      </div>
    </section>
  );
}
