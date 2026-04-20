"use client";

import { ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";

export function AboutCtaSection() {
  return (
    <section
      className="border-t border-surface-line/50 bg-gradient-to-b from-surface-mist to-surface-cream"
      aria-labelledby="about-cta-heading"
    >
      <div className="mx-auto max-w-content px-6 py-20 text-center lg:px-8">
        <h2 id="about-cta-heading" className="font-heading text-3xl font-bold text-ink md:text-4xl">
          Ready to work with a bench that treats your deadline like a defence date?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-ink-muted">
          Share anonymised briefs if you need to—NDA-backed workflows are available for corporate and
          lab partnerships.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/order"
            className="group inline-flex items-center gap-3 rounded-btn bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:-translate-y-[1px] hover:bg-brand-deep"
          >
            Place your order
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition group-hover:translate-x-0.5">
              <ArrowRight className="h-4 w-4" weight="bold" aria-hidden />
            </span>
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-btn border border-brand-primary/30 px-6 py-3 text-sm font-semibold text-brand-primary transition hover:border-brand-primary"
          >
            Browse services
          </Link>
        </div>
      </div>
    </section>
  );
}
