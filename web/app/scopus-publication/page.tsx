import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { whatsappHref } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Scopus journal publication support",
  description:
    "Educational overview of Scopus indexing, rejection avoidance, and how PhD scholars support manuscript preparation through acceptance.",
  alternates: { canonical: "/scopus-publication" },
};

const rejectionReasons = [
  { label: "Poor manuscript structure", value: 31 },
  { label: "Wrong journal selection", value: 24 },
  { label: "Formatting non-compliance", value: 18 },
  { label: "Weak abstract and novelty framing", value: 15 },
  { label: "Citation and reference issues", value: 12 },
] as const;

const processSteps = [
  "Journal selection analysis with 3-5 legitimate Scopus matches",
  "Manuscript preparation in IMRaD structure and reviewer-ready tone",
  "Formatting and compliance mapping to target author guidelines",
  "Editor-facing cover letter and submission documentation",
  "Submission handling and reviewer response coordination",
  "Revision round support until final editorial decision",
  "Proofing and publication readiness checks",
] as const;

const faqItems = [
  {
    q: "What journals do you target?",
    a: "We shortlist legitimate Scopus-indexed journals aligned to your subject scope and evidence strength before submission.",
  },
  {
    q: "Do you guarantee acceptance?",
    a: "No ethical service can guarantee editorial acceptance. We guarantee quality controls and strategy that maximise your acceptance probability.",
  },
  {
    q: "How long does the full process take?",
    a: "Typical timelines range from 30 to 90 days depending on manuscript state, journal responsiveness, and revision rounds.",
  },
  {
    q: "What do I need to provide?",
    a: "Your research findings, key references, and any previous reviewer comments. We handle structuring, compliance, and submission support.",
  },
] as const;

export default function ScopusPublicationPage() {
  return (
    <main className="bg-gradient-to-b from-surface-cream via-surface-mist/60 to-surface-cream">
      <section className="relative overflow-hidden bg-brand-deep text-white">
        <Image
          src="https://picsum.photos/seed/rs-scopus-hero-ink/1800/900"
          alt=""
          fill
          className="img-grade-section object-cover opacity-35"
          aria-hidden
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040a06] via-brand-deep/90 to-brand-deep/50" />
        <div className="relative mx-auto grid max-w-content gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-light">Scopus publication desk</p>
            <h1 className="mt-4 max-w-xl font-heading text-4xl font-bold leading-tight md:text-5xl">
              From research to recognition, with Scopus-ready editorial discipline.
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/80">
              First submissions are frequently rejected on structure, fit, and compliance. Our PhD
              editorial team removes those avoidable failure points before your manuscript reaches an
              editor.
            </p>
            <span className="mt-6 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              94% acceptance across supported submissions
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-content px-6 py-16 lg:px-8">
        <div className="rounded-[1.5rem] border border-surface-line bg-white p-6 shadow-card md:p-8">
          <h2 className="font-heading text-3xl font-bold text-ink md:text-4xl">What is Scopus and why does it matter?</h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            Scopus is Elsevier&apos;s indexed database of peer-reviewed literature and a key quality benchmark
            for faculty progression, grants, and doctoral milestones. It is not a publisher itself; journal
            legitimacy and fit must be validated before submission.
          </p>
          <div className="mt-6 rounded-card border border-brand-alert/25 bg-brand-alert/10 p-4 text-sm text-ink">
            <p className="flex items-start gap-2 font-semibold text-brand-alert">
              <span aria-hidden>!</span>
              Predatory journals often make false indexing claims.
            </p>
            <p className="mt-1 text-ink-muted">
              We verify journal status against current source lists and historical delisting patterns before any submission advice.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-content px-6 pb-16 lg:px-8">
        <div className="rounded-[1.5rem] border border-surface-line bg-white p-6 shadow-card md:p-8">
          <h2 className="font-heading text-2xl font-bold text-ink md:text-3xl">
            Why 68% of submissions get rejected on first round
          </h2>
          <div className="mt-8 space-y-4">
            {rejectionReasons.map((reason) => (
              <div key={reason.label}>
                <div className="mb-1 flex items-center justify-between text-sm font-semibold">
                  <span className="text-ink">{reason.label}</span>
                  <span className="text-brand-primary">{reason.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-surface-mist">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-accent" style={{ width: `${reason.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-content px-6 pb-16 lg:px-8">
        <div className="rounded-[1.5rem] border border-surface-line bg-white p-6 shadow-card md:p-8">
          <h2 className="font-heading text-2xl font-bold text-ink md:text-3xl">Seven-step publication process</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-2">
            {processSteps.map((step, index) => (
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
          <h2 className="font-heading text-2xl font-bold text-ink md:text-3xl">Frequently asked questions</h2>
          <div className="mt-6 space-y-3">
            {faqItems.map((item) => (
              <details key={item.q} className="rounded-card border border-surface-line bg-surface-cream p-4">
                <summary className="cursor-pointer list-none text-sm font-semibold text-ink">{item.q}</summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-deep px-6 py-16 text-white lg:px-8">
        <div className="mx-auto flex max-w-content flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="font-heading text-3xl font-bold">Ready to get your paper publication-ready?</h2>
            <p className="mt-2 max-w-2xl text-sm text-white/80">
              Share your draft and target domain; we will return a journal-fit and readiness plan.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/order" className="inline-flex items-center gap-2 rounded-btn bg-white px-5 py-2.5 text-sm font-semibold text-brand-deep">
              Start publication journey
              <span aria-hidden>→</span>
            </Link>
            <Link href={whatsappHref("Hello, I need Scopus publication support.")} className="inline-flex items-center rounded-btn border border-white/30 px-5 py-2.5 text-sm font-semibold text-white">
              WhatsApp consultation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
