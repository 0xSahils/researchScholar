"use client";

import { CheckCircle } from "@phosphor-icons/react";
import { academicStandards } from "@/lib/data/site-content";

export function ServicesStandards() {
  return (
    <section className="border-y border-surface-line bg-surface-subtle overflow-hidden py-16">
      <div className="mx-auto max-w-content px-6 lg:px-8 mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">Flawless Compliance</p>
        <h2 className="mt-3 font-heading text-2xl font-bold text-ink">
          Strict Academic Formatting Capabilities
        </h2>
      </div>

      <div className="relative flex w-full flex-col gap-4 overflow-hidden pt-4">
        {/* Fade gradients for marquee edges */}
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-24 bg-gradient-to-r from-surface-subtle to-transparent" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-24 bg-gradient-to-l from-surface-subtle to-transparent" />

        <div className="flex w-max shrink-0 animate-marquee items-center gap-4 hover:[animation-play-state:paused]">
          {[...academicStandards, ...academicStandards, ...academicStandards].map((standard, i) => (
            <div
              key={`${standard}-${i}`}
              className="group flex items-center gap-3 rounded-full border border-surface-line/60 bg-white px-5 py-3 shadow-sm transition hover:border-brand-primary/30 hover:shadow-card"
            >
              <CheckCircle className="h-5 w-5 text-brand-primary transition group-hover:text-brand-accent" weight="fill" />
              <span className="font-heading text-sm font-semibold text-ink whitespace-nowrap">{standard}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
