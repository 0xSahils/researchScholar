import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChartBar,
  CheckCircle,
  SealWarning,
  Table,
} from "@phosphor-icons/react/dist/ssr";

import { AlternatingTimeline } from "@/components/common/AlternatingTimeline";
import { FaqAccordion } from "@/components/common/FaqAccordion";
import { SubjectChipGrid } from "@/components/common/SubjectChipGrid";
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

const subjectFields = [
  "Mechanical Engineering",
  "Computer Science & AI",
  "Management & Business",
  "Medical Sciences",
  "Life Sciences & Biotech",
  "Civil Engineering",
  "Electrical Engineering",
  "Social Sciences",
  "Law & Jurisprudence",
  "Architecture",
  "Education & Pedagogy",
  "Environmental Sciences",
] as const;

const journals = [
  "PUBLISHER_LOGO_ELSEVIER",
  "PUBLISHER_LOGO_SPRINGER_NATURE",
  "PUBLISHER_LOGO_WILEY",
  "PUBLISHER_LOGO_TAYLOR_FRANCIS",
  "PUBLISHER_LOGO_SAGE",
  "PUBLISHER_LOGO_IEEE",
  "PUBLISHER_LOGO_EMERALD",
  "PUBLISHER_LOGO_MDPI",
] as const;

export default function ScopusPublicationPage() {
  return (
    <main className="bg-gradient-to-b from-surface-cream via-surface-mist/60 to-surface-cream">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-brand-deep text-white min-h-[85vh] flex flex-col justify-center">
        <Image
          src="/_next/image?url=https%3A%2F%2Fpicsum.photos%2Fseed%2Frs-scopus-hero-ink%2F1800%2F900&w=3840&q=75"
          alt="Desk with academic journals"
          fill
          className="img-grade-section object-cover opacity-20"
          aria-hidden
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-deep via-brand-deep/80 to-transparent" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
        
        <div className="relative mx-auto mt-20 grid w-full max-w-content gap-12 px-6 py-20 lg:grid-cols-12 lg:px-8 lg:py-24">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/5 px-3 py-1 space-x-2 backdrop-blur-md">
              <SealWarning className="h-4 w-4 text-brand-accent" weight="fill" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90">Scopus Publication Desk</span>
            </div>
            <h1 className="mt-8 max-w-2xl font-heading text-5xl font-bold leading-[1.1] md:text-6xl tracking-tight text-white">
              From research to <br className="hidden md:block"/>
              <span className="bg-gradient-to-r from-brand-light to-brand-accent bg-clip-text text-transparent">recognition.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/70 leading-relaxed font-light">
              First submissions are frequently rejected on structure, fit, and compliance. Our PhD
              editorial team removes those avoidable failure points before your manuscript reaches an
              editor.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/order" className="group inline-flex h-14 items-center justify-center gap-2 rounded-btn bg-white px-8 text-sm font-semibold text-brand-deep transition-all hover:bg-surface-mist hover:scale-[1.02]">
                Start publication journey
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link href={whatsappHref("Hello, I need Scopus publication support.")} className="inline-flex h-14 items-center justify-center rounded-btn border border-white/20 px-8 text-sm font-semibold text-white transition-all hover:bg-white/5">
                Contact directly
              </Link>
            </div>
          </div>
          <div className="hidden lg:block lg:col-span-5 relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-primary/20 to-transparent blur-2xl" />
             <div className="relative h-full w-full rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm overflow-hidden shadow-2xl">
               <Image
                 src="/images/scopus_desk_realistic_1777197960707.png"
                 alt="Academic Desk"
                 width={600}
                 height={800}
                 className="h-full w-full object-cover rounded-xl"
               />
             </div>
          </div>
        </div>
      </section>

      {/* Stats Bento Grid Section */}
      <section className="mx-auto max-w-content px-6 py-24 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 rounded-[2rem] border border-surface-line bg-white p-10 shadow-card flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="font-heading text-4xl font-bold text-ink tracking-tight">What is Scopus and why does it matter?</h2>
              <p className="mt-6 text-base leading-relaxed text-ink-muted max-w-2xl">
                Scopus is Elsevier's indexed database of peer-reviewed literature and a key quality benchmark
                for faculty progression, grants, and doctoral milestones. It is not a publisher itself; journal
                legitimacy and fit must be validated before submission.
              </p>
            </div>
            <div className="mt-12 rounded-2xl border border-brand-alert/25 bg-brand-alert/5 p-6 backdrop-blur-sm relative z-10 w-fit">
              <p className="flex items-center gap-3 font-semibold text-brand-alert">
                <SealWarning weight="fill" className="h-6 w-6" />
                Predatory journals often make false indexing claims.
              </p>
              <p className="mt-2 text-sm text-ink-muted max-w-lg">
                We verify journal status against current source lists and historical delisting patterns before any submission advice.
              </p>
            </div>
            
            <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />
          </div>

          <div className="rounded-[2rem] border border-surface-line bg-brand-deep text-white p-10 shadow-card flex flex-col justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] mix-blend-overlay" />
             <div className="relative z-10">
                <p className="text-5xl font-heading font-bold text-brand-light">94%</p>
                <p className="mt-4 text-lg font-medium text-white/90">Acceptance Rate</p>
                <p className="mt-2 text-sm text-white/60">Across all our supported submissions, measured over the last three academic cycles.</p>
             </div>
          </div>
        </div>
      </section>

      {/* The 68% Rejection Section with Image */}
      <section className="mx-auto max-w-content px-6 pb-24 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
           <div>
             <h2 className="font-heading text-4xl font-bold text-ink tracking-tight">
               Why 68% of submissions get rejected on the first round
             </h2>
             <p className="mt-4 text-ink-muted leading-relaxed">
               Most rejections are not strictly due to the quality of the underlying research. They are structural and formatting failures that trigger automated desk rejections.
             </p>
             <div className="mt-10 space-y-6">
                {rejectionReasons.map((reason) => (
                  <div key={reason.label}>
                    <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                      <span className="text-ink">{reason.label}</span>
                      <span className="text-brand-primary">{reason.value}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-surface-mist overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-deep transition-all duration-1000 ease-premium"
                        style={{ width: `${reason.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
           </div>
           
           <div className="relative h-[600px] w-full rounded-[2rem] border border-surface-line shadow-card overflow-hidden bg-white p-2">
              <Image 
                src="/images/scopus_process_minimal_1777197975055.png"
                alt="Process minimal"
                fill
                className="object-cover rounded-[1.5rem]"
              />
           </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="mx-auto max-w-content px-6 pb-24 lg:px-8">
        <div className="rounded-[2.5rem] bg-white p-10 lg:p-16 shadow-card border border-surface-line">
           <div className="text-center max-w-2xl mx-auto mb-16">
             <span className="text-brand-primary font-semibold tracking-wider text-sm uppercase">The Methodology</span>
             <h2 className="mt-4 font-heading text-4xl font-bold text-ink tracking-tight">
               Seven-step publication process
             </h2>
           </div>
           <div className="px-4">
             <AlternatingTimeline steps={[...processSteps]} />
           </div>
        </div>
      </section>

      {/* Data & Scope Bento Grid */}
      <section className="mx-auto max-w-content px-6 pb-24 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6">
           <div className="rounded-[2rem] border border-surface-line bg-white p-10 shadow-card">
              <h2 className="font-heading text-2xl font-bold text-ink">
                Journals We Work With
              </h2>
              <div className="mt-8 flex flex-wrap gap-4">
                {journals.map((publisher) => (
                  <div
                    key={publisher}
                    className="flex-1 min-w-[200px] flex h-16 items-center justify-center rounded-xl bg-surface-cream border border-surface-line text-xs font-semibold text-ink-muted transition-all hover:border-brand-primary/30 hover:bg-white hover:shadow-card"
                  >
                    {publisher.replace('PUBLISHER_LOGO_', '').replace('_', ' ')}
                  </div>
                ))}
              </div>
           </div>

           <div className="rounded-[2rem] border border-surface-line bg-white p-10 shadow-card">
              <h2 className="font-heading text-2xl font-bold text-ink">
                Subject Fields We Cover
              </h2>
              <div className="mt-8">
                <SubjectChipGrid fields={[...subjectFields]} />
              </div>
           </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="mx-auto max-w-content px-6 pb-24 lg:px-8">
        <div className="rounded-[2.5rem] bg-brand-deep text-white p-10 lg:p-16 shadow-2xl overflow-hidden relative">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="font-heading text-3xl md:text-4xl font-bold">
                Timeline Comparison
              </h2>
              <p className="mt-4 text-white/70 leading-relaxed max-w-md">
                Don't lose months to administrative desk rejections. Get it right the first time.
              </p>
            </div>
            
            <div className="flex-1 space-y-4 w-full">
               <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                 <p className="text-sm font-semibold text-brand-alert flex justify-between">
                   <span>Without ResearchScholars</span>
                   <span>12+ months</span>
                 </p>
                 <ul className="mt-4 space-y-3 text-sm text-white/60">
                   <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-alert/50" /> Journal selection: guesswork</li>
                   <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-alert/50" /> Abstract quality: unclear</li>
                 </ul>
               </div>

               <div className="rounded-2xl border border-brand-primary/30 bg-brand-primary/10 p-6 backdrop-blur-md">
                 <p className="text-sm font-semibold text-brand-light flex justify-between">
                   <span>With ResearchScholars</span>
                   <span>Average 45 days</span>
                 </p>
                 <ul className="mt-4 space-y-3 text-sm text-white/90">
                   <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-light" /> Journal selection: expert-matched</li>
                   <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-light" /> EXACT journal template formatting</li>
                 </ul>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-content px-6 pb-24 lg:px-8">
        <div className="rounded-[2.5rem] border border-surface-line bg-white p-10 lg:p-16 shadow-card">
          <div className="mb-12">
            <h2 className="font-heading text-3xl font-bold text-ink">
              Frequently asked questions
            </h2>
          </div>
          <FaqAccordion items={faqItems.map((item) => ({ question: item.q, answer: item.a }))} />
        </div>
      </section>

      <section className="border-t border-white/10 bg-brand-deep px-6 py-24 text-white lg:px-8">
        <div className="mx-auto flex max-w-content flex-col items-center text-center gap-8">
          <div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">Ready to get your paper publication-ready?</h2>
            <p className="mt-6 max-w-2xl text-lg text-white/70 mx-auto">
              Share your draft and target domain; we will return a journal-fit and readiness plan.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/order" className="group inline-flex h-14 items-center justify-center gap-2 rounded-btn bg-white px-8 text-sm font-semibold text-brand-deep hover:scale-105 transition-all">
              Start publication journey
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link href={whatsappHref("Hello, I need Scopus publication support.")} className="inline-flex h-14 items-center justify-center rounded-btn border border-white/20 px-8 text-sm font-semibold text-white transition-all hover:bg-white/5">
              Contact directly
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
