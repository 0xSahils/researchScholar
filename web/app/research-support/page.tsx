import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChartLine, ListChecks, Sparkle } from "@phosphor-icons/react/dist/ssr";

import { AlternatingTimeline } from "@/components/common/AlternatingTimeline";
import { FaqAccordion } from "@/components/common/FaqAccordion";
import { SubjectChipGrid } from "@/components/common/SubjectChipGrid";
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

export default function ResearchSupportPage() {
  return (
    <main className="bg-surface-mist font-sans font-light">
      {/* Industrial Brutalist Hero */}
      <section className="relative overflow-hidden bg-[#080808] text-white min-h-[90vh] flex flex-col justify-end pb-24">
        <Image
          src="/images/research_gap_minimal_1777198069327.png"
          alt="Brutalist structural gap"
          fill
          className="object-cover opacity-60 mix-blend-screen scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/70 to-transparent" />
        <div className="relative mx-auto w-full max-w-content px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-light mb-8">Research support structural integration</p>
          <h1 className="max-w-4xl font-heading text-5xl md:text-7xl lg:text-[5rem] font-bold leading-[1.05] tracking-tighter">
            The academic gap is real.<br/>
            <span className="text-white/40">It is structural, not a talent problem.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-xl text-white/70 font-normal leading-relaxed">
            Researchers often fail at formatting, journal fit, and writing conventions despite strong
            underlying data. We provide the structural bridge that mentorship gaps leave behind.
          </p>
          <div className="mt-12 flex items-center gap-6">
            <Link href="#methodology" className="uppercase text-xs font-bold tracking-widest text-brand-light pb-2 border-b-2 border-brand-light/30 hover:border-brand-light transition-all">
              Discover Our Framework
            </Link>
          </div>
        </div>
      </section>

      {/* Massive Typographic Stats Row */}
      <section className="bg-white border-y border-surface-line overflow-hidden">
        <div className="mx-auto max-w-content px-6 py-20 lg:px-8">
           <div className="grid gap-x-8 gap-y-16 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-surface-line">
              {gapStats.map((stat, idx) => (
                <article key={stat.label} className={`flex flex-col justify-center ${idx > 0 ? 'md:pl-8 pt-8 md:pt-0' : ''}`}>
                  <p className="font-heading text-6xl pb-4 font-bold text-ink tracking-tighter">{stat.value}</p>
                  <p className="text-xs uppercase tracking-wide font-semibold text-ink-muted leading-relaxed">{stat.label}</p>
                </article>
              ))}
           </div>
        </div>
      </section>

      {/* Six Invisible Barriers - Gapless Bento List */}
      <section className="mx-auto max-w-content px-6 py-32 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-8 items-start">
           <div className="lg:col-span-5 sticky top-32">
             <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-brand-primary/10 mb-6">
               <Sparkle className="h-6 w-6 text-brand-primary" weight="fill" />
             </div>
             <h2 className="font-heading text-5xl font-bold text-ink tracking-tighter">
               Six invisible barriers
             </h2>
             <p className="mt-6 text-lg text-ink-muted leading-relaxed max-w-md">
               Our infrastructure targets specific points of failure. These are the obstacles we systematically bypass during our drafting and formatting phases.
             </p>
           </div>
           
           <div className="lg:col-span-7">
             <div className="rounded-[2.5rem] border border-surface-line bg-white shadow-card overflow-hidden">
                <FaqAccordion
                  items={challengeCards.map((card) => ({ question: card.title, answer: card.body }))}
                />
             </div>
           </div>
        </div>
      </section>

      {/* Five-step visual methodology */}
      <section id="methodology" className="mx-auto max-w-content px-6 pb-32 lg:px-8">
        <div className="relative rounded-[3rem] bg-[#f8f9f8] p-12 lg:p-20 overflow-hidden shadow-card border border-surface-line">
          <div className="text-center mb-16 relative z-10">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-ink tracking-tighter">
              Five-step methodology
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
             <div className="relative h-[500px] w-full rounded-[2rem] border border-surface-line bg-white p-2 shadow-sm overflow-hidden">
               <Image 
                  src="/images/research_workflow_vector_1777198085561.png"
                  alt="Methodology workflow"
                  fill
                  className="object-cover rounded-[1.5rem]"
               />
             </div>
             <div>
                <AlternatingTimeline steps={[...methodology]} />
             </div>
          </div>
        </div>
      </section>

      {/* Subject Domains */}
      <section className="mx-auto max-w-content px-6 pb-32 lg:px-8">
        <div className="rounded-[3rem] border border-surface-line bg-white p-12 lg:p-20 shadow-card">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <h2 className="font-heading text-4xl lg:text-5xl font-bold text-ink tracking-tighter">
                Subject domains
              </h2>
              <p className="mt-4 text-ink-muted max-w-lg text-lg">
                We support a broad spectrum of rigorous academic fields. Need a niche sub-specialization? We will confirm domain availability before commitment.
              </p>
            </div>
            <Link href={whatsappHref("Hello, I have an inquiry about my specific research domain.")} className="inline-flex h-12 items-center justify-center rounded-full bg-brand-primary/10 px-6 text-sm font-semibold text-brand-primary hover:bg-brand-primary/20 transition-all shrink-0">
              Verify your domain
            </Link>
          </div>
          <SubjectChipGrid fields={[...subjectFields]} />
        </div>
      </section>

      {/* Delivery Timeline Visual */}
      <section className="bg-white py-32 border-t border-surface-line">
        <div className="mx-auto max-w-content px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-20">
             <h2 className="font-heading text-4xl lg:text-5xl font-bold text-ink tracking-tighter">
                Delivery Timelines
             </h2>
             <p className="mt-6 text-lg text-ink-muted">
               Predictable workflows mean predictable delivery.
             </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {[
              { name: "Assignment", time: "24-48 hrs", width: "24%" },
              { name: "Research Paper", time: "3-7 days", width: "38%" },
              { name: "Synopsis", time: "5-10 days", width: "48%" },
              { name: "Thesis", time: "15-25 days", width: "64%" },
              { name: "Scopus Publication", time: "15-45 days", width: "100%" },
            ].map((item, idx) => (
              <div key={item.name} className="group cursor-default relative">
                <div className="mb-3 flex items-end justify-between text-lg font-bold text-ink px-1">
                  <span>{item.name}</span>
                  <span className="text-brand-primary/60 group-hover:text-brand-primary transition-colors">{item.time}</span>
                </div>
                <div className="h-3 rounded-full bg-surface-mist overflow-hidden relative">
                  <div className="h-full rounded-full bg-brand-primary/40 transition-all duration-1000 ease-out group-hover:bg-brand-primary" style={{ width: item.width }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brutalist Dark CTA */}
      <section className="bg-[#080808] px-6 py-32 text-white lg:px-8">
        <div className="mx-auto flex max-w-content flex-col items-center text-center gap-10">
          <div className="inline-flex items-center gap-3">
             <div className="h-px w-8 bg-white/20" />
             <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/50">Next Steps</span>
             <div className="h-px w-8 bg-white/20" />
          </div>
          
          <div>
            <h2 className="font-heading text-5xl md:text-6xl font-bold tracking-tighter">You know what you need.<br/>Let us structure it.</h2>
            <p className="mt-6 max-w-2xl text-xl text-white/60 font-light mx-auto">
              Every delay compresses your review window. Start with a scoped brief today and bypass the structural friction.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-4">
            <Link href="/order" className="group inline-flex h-16 items-center justify-center gap-3 rounded-none bg-white px-10 text-sm font-bold uppercase tracking-wide text-[#080808] hover:bg-brand-light transition-all">
              Place your order
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link href={whatsappHref("Hello, I need research support guidance.")} className="inline-flex h-16 items-center justify-center gap-2 rounded-none border border-white/20 px-10 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-white/5">
              Contact directly
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
