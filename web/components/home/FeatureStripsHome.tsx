import { ContentIcon } from "@/components/icons/ContentIcon";
import { featureStrips } from "@/lib/data/site-content";

export function FeatureStripsHome() {
  return (
    <section
      className="border-y border-surface-line/80 bg-gradient-to-b from-surface-mist via-surface-sage/30 to-surface-cream"
      aria-labelledby="support-pillars"
    >
      <div className="mx-auto max-w-content px-6 py-16 lg:px-8">
        <p id="support-pillars" className="sr-only">
          Core support pillars
        </p>
        <div className="grid gap-10 divide-y divide-surface-line md:grid-cols-3 md:divide-x md:divide-y-0 md:gap-0">
          {featureStrips.map(({ title, body, icon }) => (
            <article
              key={title}
              className="flex gap-4 pt-8 first:pt-0 md:px-6 md:pt-0 md:first:pl-0"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-primary text-white shadow-card">
                <ContentIcon name={icon} className="h-7 w-7" weight="duotone" aria-hidden />
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
