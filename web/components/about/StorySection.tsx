import Image from "next/image";

import { aboutStoryParagraphs } from "@/lib/data/site-content";
import { siteConfig } from "@/lib/site-config";

export function StorySection() {
  return (
    <section
      className="border-b border-surface-line/50 bg-gradient-to-b from-surface-mist/90 to-surface-cream"
      aria-labelledby="story-heading"
    >
      <div className="mx-auto grid max-w-content items-start gap-12 px-6 py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 lg:px-8 lg:py-24">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">Our story</p>
          <h2 id="story-heading" className="font-heading text-3xl font-bold text-ink md:text-4xl">
            Built after watching strong researchers lose on presentation—not ideas.
          </h2>
          {aboutStoryParagraphs.map((paragraph, index) => (
            <p key={index} className="text-base leading-relaxed text-ink-muted">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative aspect-[3/4] overflow-hidden rounded-card border border-surface-line shadow-card md:col-span-2 md:row-span-2">
            <Image
              src="/images/story-collage-a.png"
              alt="Scholar presenting research slides to peers in a seminar room"
              fill
              className="img-grade-section object-cover"
              sizes="(min-width: 1024px) 480px, 70vw"
            />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-surface-line shadow-card">
            <Image
              src="/images/story-collage-b.png"
              alt="Academic reviewing a manuscript with editorial marks"
              fill
              className="img-grade-section object-cover"
              sizes="(min-width: 1024px) 220px, 40vw"
            />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-surface-line shadow-card">
            <Image
              src="/images/story-collage-c.png"
              alt="Researcher working at a computer with multiple academic database windows"
              fill
              className="img-grade-section object-cover"
              sizes="(min-width: 1024px) 220px, 40vw"
            />
          </div>
          <div className="rounded-card border border-brand-primary/20 bg-brand-light/50 p-5 text-sm text-brand-deep shadow-card md:col-span-3">
            <p className="font-heading text-lg font-semibold text-brand-primary">
              Since {siteConfig.foundingYear}
            </p>
            <p className="mt-2 text-ink-muted">
              The founding bench began as informal mentoring circles inside research labs and
              business schools—before formalising delivery, QA, and confidentiality playbooks.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
