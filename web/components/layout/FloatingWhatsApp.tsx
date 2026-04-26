"use client";

import { WhatsappLogo } from "@phosphor-icons/react";
import Link from "next/link";

import { whatsappHref } from "@/lib/site-config";

export function FloatingWhatsApp() {
  return (
    <Link
      href={whatsappHref("Hi ResearchScholars, I need help with [topic]. My deadline is [date].")}
      className="group fixed bottom-6 right-6 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-cardHover ring-4 ring-white/70 transition duration-500 ease-premium hover:-translate-y-1 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary md:bottom-10 md:right-10"
      aria-label="Chat on WhatsApp"
    >
      <span className="absolute inline-flex h-full w-full animate-pulseRing rounded-full bg-[#25D366]/40 opacity-60" />
      <WhatsappLogo className="relative h-7 w-7" weight="fill" aria-hidden />
    </Link>
  );
}
