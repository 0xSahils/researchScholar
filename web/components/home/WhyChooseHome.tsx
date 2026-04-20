"use client";

import { SealCheck } from "@phosphor-icons/react";
import Image from "next/image";

import { whyChoose } from "@/lib/data/site-content";

export function WhyChooseHome() {
  return (
    <section
      className="border-y border-surface-line/50 bg-gradient-to-br from-surface-cream via-surface-mist/80 to-surface-sage/20"
      aria-labelledby="why-heading"
    >
      <div className="mx-auto max-w-content px-6 py-20 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-16">
          <div className="relative lg:sticky lg:top-28">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-surface-line shadow-diffusion">
              <Image
                src="/images/why-choose-scholar.png"
                alt="Senior PhD scholar at a desk with academic journals and a laptop"
                fill
                className="img-grade-section object-cover"
                sizes="(min-width: 1024px) 40vw, 90vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/50 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/35 bg-surface-cream/95 p-4 text-sm text-ink shadow-card backdrop-blur-md">
                <p className="font-semibold text-brand-primary">Scholar-in-the-loop, always.</p>
                <p className="mt-1 text-ink-muted">
                  Your named lead signs off structure before you ship to committee or journal.
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
              Why teams pick us
            </p>
            <h2 id="why-heading" className="mt-3 font-heading text-3xl font-bold text-ink md:text-4xl">
              Not generic writers—scholars who publish, review, and defend the same bar you face.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              We optimise for reviewer-readable argumentation, ethical support boundaries, and
              operational transparency. If we cannot match domain expertise inside your timeline, we
              decline early—no false starts.
            </p>

            <ul className="mt-10 space-y-5">
              {whyChoose.map((row) => (
                <li
                  key={row.title}
                  className="flex gap-4 rounded-card border border-surface-line bg-surface-subtle/60 p-4 transition duration-500 ease-premium hover:-translate-y-[2px] hover:border-brand-accent/40 hover:shadow-card"
                >
                  <SealCheck className="mt-1 h-6 w-6 shrink-0 text-brand-accent" weight="duotone" aria-hidden />
                  <div>
                    <p className="font-heading text-lg font-semibold text-ink">{row.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-muted">{row.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
