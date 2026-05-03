"use client";

import { ArrowRight } from "@phosphor-icons/react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { ContactDirectOrderLink } from "@/components/marketing/ContactDirectOrderLink";
import { serviceCards, serviceTabs } from "@/lib/data/site-content";

type ServiceTabId = (typeof serviceTabs)[number]["id"];

export function ServicesTabsHome() {
  const [active, setActive] = useState<ServiceTabId>(serviceTabs[0].id);

  const cards = useMemo(() => {
    const tab = serviceTabs.find((t) => t.id === active);
    if (!tab) return [];
    return tab.services.map((id) => serviceCards[id]).filter(Boolean);
  }, [active]);

  return (
    <section
      className="border-y border-surface-line/50 bg-gradient-to-b from-surface-cream via-white/30 to-surface-mist"
      aria-labelledby="services-tabs-heading"
    >
      <div className="mx-auto max-w-content px-6 py-20 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
              Services mapped to where you are
            </p>
            <h2
              id="services-tabs-heading"
              className="font-heading text-3xl font-bold tracking-tight text-ink md:text-4xl"
            >
              Comprehensive academic support across every milestone of your programme.
            </h2>
            <p className="text-sm leading-relaxed text-ink-muted">
              Pick your stage to see how we staff, review similarity, and sequence delivery. Every
              service line routes through the same governed order desk.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {serviceTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={clsx(
                "rounded-full px-4 py-2 text-sm font-semibold transition duration-300 ease-premium",
                active === tab.id
                  ? "bg-brand-primary text-white shadow-card"
                  : "border border-brand-primary/15 text-brand-primary hover:border-brand-primary/40",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <p className="mt-6 max-w-3xl text-sm text-ink-muted">
          {serviceTabs.find((t) => t.id === active)?.summary}
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {cards.map((card) => (
            <article
              key={card.id}
              className="group flex h-full flex-col overflow-hidden rounded-card border border-surface-line/90 bg-gradient-to-b from-surface-cream/95 to-white/80 shadow-card backdrop-blur-sm transition duration-500 ease-premium hover:-translate-y-1 hover:shadow-cardHover"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={card.imageSrc}
                  alt={card.imageAlt}
                  fill
                  className="img-grade-section object-cover transition duration-700 ease-premium group-hover:scale-105"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-deep/70 via-brand-deep/10 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-primary shadow-card">
                  PhD matched
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-primary">
                    {card.stat}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-ink">{card.title}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{card.description}</p>
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/order"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary"
                  >
                    Request a quote
                    <ArrowRight className="h-4 w-4" weight="bold" aria-hidden />
                  </Link>
                  <ContactDirectOrderLink
                    size="compact"
                    message={`Hello, I need a quote for ${card.title} on ResearchScholars.`}
                  />
                  {card.id === "scopus" ? (
                    <Link href="/scopus-publication" className="text-sm font-semibold text-brand-accent">
                      Publication playbook
                    </Link>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
