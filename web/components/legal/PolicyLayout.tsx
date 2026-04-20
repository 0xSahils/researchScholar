import Link from "next/link";

type PolicySection = {
  title: string;
  points: readonly string[];
};

export function PolicyLayout({
  eyebrow,
  title,
  intro,
  sections,
  effectiveDate,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: readonly PolicySection[];
  effectiveDate: string;
}) {
  return (
    <main className="bg-gradient-to-b from-surface-cream via-surface-mist/60 to-surface-cream">
      <section className="mx-auto max-w-content px-6 py-16 lg:px-8 lg:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-heading text-4xl font-bold text-ink md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-base text-ink-muted">{intro}</p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Effective date: {effectiveDate}
        </p>
      </section>

      <section className="mx-auto max-w-content px-6 pb-16 lg:px-8 lg:pb-24">
        <div className="space-y-4">
          {sections.map((section) => (
            <article key={section.title} className="rounded-card border border-surface-line bg-white p-6 shadow-card">
              <h2 className="font-heading text-2xl font-bold text-ink">{section.title}</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
                {section.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/contact" className="rounded-btn bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white">
            Contact support
          </Link>
          <Link href="/" className="rounded-btn border border-brand-primary/20 px-5 py-2.5 text-sm font-semibold text-brand-primary">
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}
