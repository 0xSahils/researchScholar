import type { Metadata } from "next";
import Link from "next/link";

import { challengeCards } from "@/lib/data/site-content";
import { whatsappHref } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Research support and the academic writing gap",
  description:
    "Understand systemic barriers Indian researchers face and how structured PhD-led support reduces friction without compromising authorship integrity.",
  alternates: { canonical: "/research-support" },
};

const gapStats = [
  { label: "First-round Scopus rejections", value: "68%" },
  { label: "Theses requiring major revisions", value: "40%" },
  { label: "Researchers reaching international publication", value: "2%" },
  { label: "Predatory journals in circulation", value: "4,500+" },
  { label: "PhD students with continuous mentor access", value: "1 in 6" },
] as const;

const methodology = [
  "Requirement and institutional guideline mapping",
  "Subject-matched PhD scholar assignment",
  "Structured writing in academic register",
  "Three-stage quality and similarity review",
  "Delivery with revision cycle support",
] as const;

const subjectFields = [
  "Engineering",
  "Medical and Health Sciences",
  "Management and Business",
  "Social Sciences and Psychology",
  "Humanities and Law",
  "Life Sciences and Biotech",
  "Architecture and Design",
  "Education and Pedagogy",
  "Environmental Sciences",
  "Data Science and AI",
] as const;

export default function ResearchSupportPage() {
  return (
    <main className="bg-gradient-to-b from-surface-cream via-surface-mist/60 to-surface-cream">
      <section className="bg-[#08140d] px-6 py-20 text-white lg:px-8 lg:py-24">
        <div className="mx-auto max-w-content">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-light">Research support</p>
          <h1 className="mt-4 max-w-4xl font-heading text-4xl font-bold leading-tight md:text-5xl">
            The academic gap is real. It is usually structural, not a talent problem.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-white/80">
            Researchers often fail at formatting, journal fit, and writing conventions despite strong
            underlying data. We provide the structure that mentorship gaps leave behind.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-content px-6 py-16 lg:px-8">
        <div className="grid gap-4 md:grid-cols-5">
          {gapStats.map((stat) => (
            <article key={stat.label} className="rounded-card border border-surface-line bg-white p-5 shadow-card">
              <p className="font-heading text-3xl font-bold text-brand-primary">{stat.value}</p>
              <p className="mt-2 text-xs uppercase tracking-wide text-ink-muted">{stat.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-content px-6 pb-16 lg:px-8">
        <div className="rounded-[1.5rem] border border-surface-line bg-white p-6 shadow-card md:p-8">
          <h2 className="font-heading text-2xl font-bold text-ink md:text-3xl">Six invisible barriers</h2>
          <div className="mt-6 space-y-3">
            {challengeCards.map((card) => (
              <details key={card.title} className="rounded-card border border-surface-line bg-surface-cream p-4">
                <summary className="cursor-pointer list-none text-sm font-semibold text-ink">{card.title}</summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{card.body}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-content px-6 pb-16 lg:px-8">
        <div className="rounded-[1.5rem] border border-surface-line bg-white p-6 shadow-card md:p-8">
          <h2 className="font-heading text-2xl font-bold text-ink md:text-3xl">Five-step methodology</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-2">
            {methodology.map((step, index) => (
              <li key={step} className="rounded-card border border-surface-line bg-surface-cream p-4 text-sm text-ink">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-primary">Step {index + 1}</p>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-content px-6 pb-16 lg:px-8">
        <div className="rounded-[1.5rem] border border-surface-line bg-white p-6 shadow-card md:p-8">
          <h2 className="font-heading text-2xl font-bold text-ink md:text-3xl">Subject domains we support</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {subjectFields.map((field) => (
              <span key={field} className="rounded-full border border-brand-primary/25 bg-brand-light/50 px-3 py-1 text-xs font-semibold text-brand-deep">
                {field}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-ink-muted">
            Need a niche sub-specialization? WhatsApp your topic and we will confirm domain availability before commitment.
          </p>
        </div>
      </section>

      <section className="bg-brand-deep px-6 py-16 text-white lg:px-8">
        <div className="mx-auto flex max-w-content flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="font-heading text-3xl font-bold">You know what you need. Let us structure it.</h2>
            <p className="mt-2 max-w-2xl text-sm text-white/80">
              Every delay compresses your review window. Start with a scoped brief today.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/order" className="inline-flex items-center gap-2 rounded-btn bg-white px-5 py-2.5 text-sm font-semibold text-brand-deep">
              Place your order
              <span aria-hidden>→</span>
            </Link>
            <Link href={whatsappHref("Hello, I need research support guidance.")} className="inline-flex items-center rounded-btn border border-white/30 px-5 py-2.5 text-sm font-semibold text-white">
              WhatsApp first
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
