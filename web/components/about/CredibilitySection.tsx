import { credibilityBlocks } from "@/lib/data/site-content";

export function CredibilitySection() {
  return (
    <section
      className="bg-gradient-to-r from-brand-light/50 via-surface-sage/35 to-surface-mist/90"
      aria-labelledby="credibility-heading"
    >
      <div className="mx-auto max-w-content px-6 py-16 lg:px-8">
        <h2 id="credibility-heading" className="sr-only">
          Credibility metrics
        </h2>
        <div className="grid gap-6 divide-y divide-brand-primary/10 md:grid-cols-4 md:divide-x md:divide-y-0 md:gap-0">
          {credibilityBlocks.map((block) => (
            <article key={block.title} className="px-2 pt-6 first:pt-0 md:px-6 md:pt-0 md:first:pl-0">
              <h3 className="font-heading text-lg font-semibold text-ink">{block.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{block.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
