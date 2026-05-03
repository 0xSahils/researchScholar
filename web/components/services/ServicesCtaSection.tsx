"use client";

import Link from "next/link";
import { ArrowRight, WhatsappLogo } from "@phosphor-icons/react";
import { whatsappHref } from "@/lib/site-config";

export function ServicesCtaSection() {
  return (
    <section className="bg-brand-deep px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-heading text-3xl font-bold text-white md:text-5xl">
          Not Sure Which Package You Need?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 leading-relaxed">
          WhatsApp us your requirement — we&apos;ll guide you to the right service and match you with the right scholar within 30 minutes.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={whatsappHref()}
            className="group inline-flex items-center gap-2 rounded-btn bg-[#25D366] px-6 py-3.5 text-base font-semibold text-white shadow-cardHover transition hover:bg-[#20bd5a] hover:-translate-y-[1px]"
          >
            <WhatsappLogo className="h-5 w-5" weight="fill" />
            Contact directly
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" weight="bold" />
          </Link>
          <Link
            href="/order"
            className="inline-flex items-center justify-center rounded-btn border border-white/20 bg-white/5 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
          >
            View Order Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
