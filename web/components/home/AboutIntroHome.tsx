"use client";

import { SealCheck, WhatsappLogo } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";

import { whatsappHref } from "@/lib/site-config";

const checklist = [
  "PhD experts across engineering, medicine, management, law, life sciences, and allied domains",
  "Formatting aligned to APA 7, MLA 9, IEEE, Harvard, Chicago, Vancouver, and custom guides",
  "Indexed journal workflows for Scopus and UGC-care aware submissions",
  "Revision cycles included until committee or reviewer comments are addressed within scope",
];

export function AboutIntroHome() {
  return (
    <section
      className="border-b border-surface-line/60 bg-gradient-to-br from-surface-cream via-white/25 to-surface-mist"
      aria-labelledby="about-intro-heading"
    >
      <div className="mx-auto grid max-w-content items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div className="relative">
          <div className="absolute -left-6 top-10 hidden h-48 w-48 rounded-full bg-brand-light blur-3xl lg:block" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative aspect-[3/4] overflow-hidden rounded-card border border-surface-line shadow-card md:translate-y-8">
              <Image
                src="/images/about-collage-a.png"
                alt="PhD scholar reviewing a printed manuscript with annotations"
                fill
                className="img-grade-section object-cover"
                sizes="(min-width: 1024px) 320px, 45vw"
              />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-card border border-surface-line shadow-card">
              <Image
                src="/images/about-collage-b.png"
                alt="Student working on research notes with a laptop in a campus study space"
                fill
                className="img-grade-section object-cover"
                sizes="(min-width: 1024px) 320px, 45vw"
              />
            </div>
          </div>
          <div className="absolute -bottom-6 right-4 flex max-w-xs items-center gap-3 rounded-2xl border border-brand-primary/25 bg-surface-cream/95 p-4 shadow-cardHover backdrop-blur-sm">
            <SealCheck className="h-8 w-8 text-brand-accent" weight="duotone" aria-hidden />
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-ink-muted">Bench strength</p>
              <p className="font-heading text-base font-semibold text-brand-primary">
                16+ years combined academic experience
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
            Who we are
          </p>
          <div className="space-y-4">
            <h2
              id="about-intro-heading"
              className="font-heading text-3xl font-bold tracking-tight text-ink md:text-4xl"
            >
              India&apos;s PhD-led research desk for serious writing and publication milestones.
            </h2>
            <p className="text-base leading-relaxed text-ink-muted">
              ResearchScholars.online exists because structured academic writing is rarely taught at
              scale—yet it decides outcomes for theses, vivas, and indexed journals alike.
            </p>
            <p className="text-base leading-relaxed text-ink-muted">
              We pair you with a verified scholar in your domain, govern originality checks, and
              ship to explicit briefs so your committee or editor sees coherent argumentation—not
              generic prose.
            </p>
          </div>
          <ul className="space-y-3 text-sm text-ink">
            {checklist.map((line) => (
              <li key={line} className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-accent" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-btn border border-brand-primary px-5 py-2.5 text-sm font-semibold text-brand-primary transition hover:bg-brand-light"
            >
              More about our bench
            </Link>
            <Link
              href={whatsappHref()}
              className="inline-flex items-center gap-2 rounded-btn bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-brand-deep"
            >
              <WhatsappLogo className="h-5 w-5" weight="fill" aria-hidden />
              WhatsApp the desk
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
