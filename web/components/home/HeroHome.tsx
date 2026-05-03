"use client";

import { ArrowRight, CheckCircle, Sparkle } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { ContactDirectOrderLink } from "@/components/marketing/ContactDirectOrderLink";
import { heroStatsChips } from "@/lib/data/site-content";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  },
};

/** Hero image: library / study vibe — swap for your WebP (IMG-01) when ready. */
const HERO_IMAGE =
  "/images/hero-scholar.png";

export function HeroHome() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-[min(92dvh,920px)] overflow-hidden text-white"
    >
      {/* Base + cinematic grade */}
      <div className="absolute inset-0 bg-[#040a06]" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#0d2818] via-[#0a1f12] to-[#050d08]"
        aria-hidden
      />
      <div
        className="absolute -left-32 top-0 h-[min(80vw,520px)] w-[min(80vw,520px)] rounded-full bg-emerald-500/25 blur-[120px]"
        aria-hidden
      />
      <div
        className="absolute -right-20 top-1/4 h-[420px] w-[420px] rounded-full bg-amber-400/18 blur-[100px]"
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-1/4 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-brand-primary/35 blur-[100px]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_-10%,rgba(45,140,78,0.22),transparent_55%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_100%_100%,rgba(249,168,37,0.08),transparent_45%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(115deg,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:56px_56px]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50"
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid max-w-content items-center gap-12 px-6 pb-28 pt-16 md:pb-32 md:pt-20 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-14 lg:px-8 lg:pb-36 lg:pt-24">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100/95 shadow-[0_0_0_1px_rgba(45,140,78,0.35)] backdrop-blur-md">
              <Sparkle className="h-4 w-4 text-amber-300" weight="fill" aria-hidden />
              PhD scholar-led support
            </span>
          </motion.div>

          <motion.div variants={item} className="space-y-5">
            <h1
              id="hero-heading"
              className="max-w-[22ch] text-balance font-display text-[clamp(2.4rem,4.2vw,3.85rem)] leading-[1.06] tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]"
            >
              Structured academic support,{" "}
              <span className="bg-gradient-to-r from-emerald-200 via-white to-amber-100/90 bg-clip-text text-transparent">
                done right by PhD scholars.
              </span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-white/78">
              Thesis chapters, dissertations, journal manuscripts, and Scopus submissions—written in
              the register reviewers expect, with originality checks and governed timelines.
            </p>
          </motion.div>

          <motion.ul
            variants={item}
            className="flex flex-wrap gap-3 text-sm font-medium text-white/90"
          >
            {heroStatsChips.map((chip) => (
              <li
                key={chip}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md"
              >
                <CheckCircle className="h-4 w-4 text-emerald-300" weight="fill" aria-hidden />
                {chip}
              </li>
            ))}
          </motion.ul>

          <motion.div variants={item} className="flex flex-wrap gap-4">
            <Link
              href="/order"
              className="group inline-flex items-center gap-3 rounded-btn border border-white/35 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition duration-500 ease-premium hover:-translate-y-[2px] hover:bg-white/15"
            >
              Place your order
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4" weight="bold" aria-hidden />
              </span>
            </Link>
            <ContactDirectOrderLink
              variant="ghostOnDark"
              message="Hello, I would like a structured quote for my academic writing requirement."
            />
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-btn border border-white/35 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/55 hover:bg-white/10"
            >
              View all services
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.85,
            ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
            delay: 0.12,
          }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="relative aspect-[4/5] w-full md:aspect-[5/6]">
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-amber-400/35 via-emerald-400/25 to-teal-600/20 blur-2xl" />
            <div className="absolute inset-3 rounded-[2rem] border border-amber-300/40 shadow-[0_0_0_1px_rgba(0,0,0,0.35)]" />
            <div className="relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a1510] shadow-[0_24px_80px_-20px_rgba(0,0,0,0.65)] ring-1 ring-white/10">
              <div className="clip-edu-hero relative h-full w-full">
                <Image
                  src={HERO_IMAGE}
                  alt="Postgraduate scholar reviewing research notes in a university library setting"
                  fill
                  priority
                  sizes="(min-width: 1024px) 480px, 90vw"
                  className="img-grade-hero object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#030806]/95 via-[#071208]/35 to-emerald-950/25" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-[#040a06]/90 via-transparent to-transparent md:from-[#040a06]/70" />
              </div>
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-black/45 p-4 shadow-2xl backdrop-blur-xl md:bottom-6 md:left-6 md:right-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-200/80">
                      Delivery desk
                    </p>
                    <p className="font-heading text-lg font-bold text-white">500+ projects</p>
                  </div>
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
                  </span>
                </div>
                <p className="mt-2 text-sm leading-snug text-white/70">
                  Median first response under one hour on working days, with milestone tracking from
                  assignment to delivery.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Transition into warm page body */}
      <div className="absolute bottom-0 left-0 right-0 z-[5] translate-y-px text-surface-cream" aria-hidden>
        <svg
          className="block w-full"
          viewBox="0 0 1440 56"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M0,56 V28 C240,8 480,40 720,32 C960,24 1200,0 1440,18 V56 H0 Z"
          />
        </svg>
      </div>
    </section>
  );
}
