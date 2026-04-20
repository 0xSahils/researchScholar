"use client";

import { Star } from "@phosphor-icons/react";

import { testimonials } from "@/lib/data/site-content";

export function TestimonialsHome() {
  return (
    <section
      className="bg-gradient-to-b from-[#0a1f12] to-[#040a06] text-white"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-content px-6 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
            Proof from the field
          </p>
          <h2 id="testimonials-heading" className="mt-3 font-heading text-3xl font-bold text-white md:text-4xl">
            Researchers who needed velocity without compromising review readiness.
          </h2>
        </div>

        <div className="mt-12 columns-1 gap-6 md:columns-2 lg:columns-3">
          {testimonials.map((item) => (
            <article
              key={item.name}
              className="mb-6 break-inside-avoid rounded-card border border-white/10 bg-white/5 p-6 shadow-card backdrop-blur-[2px] transition duration-500 ease-premium hover:-translate-y-1 hover:shadow-cardHover"
            >
              <div className="flex items-center gap-1 text-brand-gold">
                {Array.from({ length: item.rating }).map((_, index) => (
                  <Star key={index} className="h-4 w-4" weight="fill" aria-hidden />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white">{item.quote}</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-4">
                <div>
                  <p className="font-heading text-sm font-semibold text-white">{item.name}</p>
                  <p className="text-xs text-white/70">
                    {item.role} · {item.org}
                  </p>
                </div>
                <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-primary">
                  {item.tag}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
