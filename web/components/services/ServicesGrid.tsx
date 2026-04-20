"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { serviceCards } from "@/lib/data/site-content";

export function ServicesGrid() {
  const orderedServices = ["thesis", "dissertation", "papers", "assignments", "synopsis", "scopus"];

  return (
    <section className="bg-surface-cream py-20 lg:py-28" aria-labelledby="services-grid-heading">
      <div className="mx-auto max-w-content px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 id="services-grid-heading" className="font-heading text-3xl font-bold text-ink md:text-5xl">
            Our Academic Expertise
          </h2>
          <p className="mt-4 text-base text-ink-muted">
            From the initial synopsis blueprint to final indexed publication, we supply dedicated PhD-tier oversight across your writing demands.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orderedServices.map((key) => {
            const service = serviceCards[key];
            if (!service) return null;

            return (
              <div
                key={service.id}
                className="group flex flex-col overflow-hidden rounded-card border border-surface-line/80 bg-white shadow-card transition duration-500 ease-premium hover:-translate-y-1 hover:border-brand-primary/40 hover:shadow-cardHover"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={service.imageSrc}
                    alt={service.imageAlt}
                    fill
                    className="object-cover transition duration-700 ease-premium group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                  
                  <div className="absolute left-4 top-4 rounded-full bg-surface-cream/95 px-3 py-1 font-semibold text-[10px] uppercase tracking-wider text-ink shadow-sm">
                    {service.stat}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6 lg:p-8">
                  <h3 className="font-heading text-xl font-bold text-ink flex items-center justify-between">
                    {service.title}
                  </h3>
                  
                  <div className="mt-2 inline-flex self-start rounded-full bg-brand-accent/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-brand-deep">
                    Phase 2 Core Service
                  </div>

                  <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-muted">
                    {service.description}
                  </p>

                  <div className="mt-8 pt-6 border-t border-surface-line/50">
                    <Link
                      href={`/order?plan=${service.id}`}
                      className="inline-flex w-full items-center justify-between rounded-btn border border-brand-primary/20 bg-surface-subtle px-4 py-2.5 text-sm font-semibold text-brand-primary transition hover:bg-brand-primary hover:text-white"
                    >
                      Instant Booking
                      <ArrowRight className="h-4 w-4" weight="bold" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
