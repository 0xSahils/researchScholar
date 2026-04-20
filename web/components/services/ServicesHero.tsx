"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";

export function ServicesHero() {
  return (
    <section className="relative overflow-hidden bg-brand-deep text-white pt-24 pb-20 lg:pt-32 lg:pb-28">
      {/* Background Image / Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/about-hero.png"
          alt="Library and academic architecture"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-deep via-brand-deep/80 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-content px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-brand-light backdrop-blur-md mb-6">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-light opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-light"></span>
          </span>
          PHASE 1 SERVICES MAP
        </div>
        <h1 className="mx-auto max-w-4xl font-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-white">
          Comprehensive Academic Support — At Every Stage
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 leading-relaxed font-medium">
          Whether you are submitting your first university assignment or targeting a Scopus-indexed journal — we have a verified PhD scholar for every stage of your research journey.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/order"
            className="group inline-flex items-center gap-2 rounded-btn bg-brand-light px-6 py-3.5 text-base font-semibold text-brand-deep transition shadow-cardHover hover:bg-white hover:-translate-y-[1px]"
          >
            Explore Order Options
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" weight="bold" />
          </Link>
        </div>
      </div>
    </section>
  );
}
