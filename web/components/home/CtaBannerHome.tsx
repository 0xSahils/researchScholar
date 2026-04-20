"use client";

import { ArrowRight, WhatsappLogo } from "@phosphor-icons/react";
import Link from "next/link";

import { whatsappHref } from "@/lib/site-config";

export function CtaBannerHome() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-deep via-brand-primary to-brand-deep text-white">
      <div className="pointer-events-none absolute inset-0 opacity-30 mix-blend-screen">
        <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,rgba(249,168,37,0.35),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(45,140,78,0.45),transparent_40%)]" />
      </div>
      <div className="relative mx-auto max-w-content px-6 py-16 text-center lg:px-8 lg:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
          Ready when your calendar is not
        </p>
        <h2 className="mt-4 font-heading text-3xl font-bold md:text-4xl">
          Place a brief today—get a scoped response, timeline, and scholar match within the hour on
          working days.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-white/75">
          We will tell you honestly if your deadline needs a narrower scope, a staged delivery, or an
          additional reviewer pass. No retainers required to start the conversation.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/order"
            className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-deep shadow-card transition duration-500 ease-premium hover:-translate-y-1 hover:bg-brand-light"
          >
            Place your order
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary transition group-hover:translate-x-0.5">
              <ArrowRight className="h-4 w-4" weight="bold" aria-hidden />
            </span>
          </Link>
          <Link
            href={whatsappHref()}
            className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <WhatsappLogo className="h-5 w-5" weight="fill" aria-hidden />
            WhatsApp the desk
          </Link>
        </div>
      </div>
    </section>
  );
}
