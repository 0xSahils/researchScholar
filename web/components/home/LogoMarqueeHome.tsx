import { partnerLabels } from "@/lib/data/site-content";

function MarqueeRow({ reverse }: { reverse?: boolean }) {
  const items = [...partnerLabels, ...partnerLabels];

  return (
    <div className="relative overflow-hidden py-3">
      <div
        className={reverse ? "flex w-max animate-marqueeReverse hover:[animation-play-state:paused]" : "flex w-max animate-marquee hover:[animation-play-state:paused]"}
      >
        {items.map((label, index) => (
          <span
            key={`${label}-${index}`}
            className="mx-10 text-sm font-semibold uppercase tracking-[0.3em] text-ink/35 transition hover:text-brand-primary"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function LogoMarqueeHome() {
  return (
    <section
      className="border-y border-surface-line/60 bg-surface-mist/90"
      aria-label="Trusted academic ecosystems"
    >
      <div className="mx-auto max-w-content px-6 py-12 text-center lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
          Trusted by researchers connected to
        </p>
      </div>
      <MarqueeRow />
      <MarqueeRow reverse />
    </section>
  );
}
