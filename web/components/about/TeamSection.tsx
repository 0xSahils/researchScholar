"use client";

import { LinkedinLogo } from "@phosphor-icons/react";
import Image from "next/image";

import { teamMembers } from "@/lib/data/site-content";

export function TeamSection() {
  return (
    <section className="bg-white" aria-labelledby="team-heading">
      <div className="mx-auto max-w-content px-6 py-20 lg:px-8 lg:py-24">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">Meet the bench</p>
          <h2 id="team-heading" className="font-heading text-3xl font-bold text-ink md:text-4xl">
            Scholar-leads who still publish, review, and defend work in their domains.
          </h2>
          <p className="text-sm text-ink-muted">
            Replace stock avatars with your real leadership portraits when ready—the layout is tuned
            for professional photography and consistent lighting.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              className="group relative h-[420px] [perspective:1200px]"
            >
              <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[2rem] border border-surface-line/90 bg-gradient-to-b from-surface-cream to-white/90 shadow-diffusion [backface-visibility:hidden]">
                  <div className="relative aspect-square w-full">
                    <Image
                      src={`/images/team-member-${index}.png`}
                      alt={`Portrait of ${member.name}`}
                      fill
                      className="img-grade-section object-cover"
                      sizes="(min-width: 768px) 50vw, 90vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-6">
                    <p className="font-heading text-xl font-semibold text-ink">{member.name}</p>
                    <p className="text-sm text-brand-primary">{member.title}</p>
                    <p className="text-xs uppercase tracking-wide text-ink-muted">{member.credentials}</p>
                    <p className="mt-auto text-sm font-semibold text-brand-accent">{member.publications}</p>
                  </div>
                </div>

                <div className="absolute inset-0 flex flex-col justify-between rounded-[2rem] border border-brand-primary/30 bg-brand-deep p-6 text-white shadow-cardHover [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
                      Biography
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-white/80">{member.bio}</p>
                  </div>
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-white/80">
                    <LinkedinLogo className="h-5 w-5" weight="fill" aria-hidden />
                    LinkedIn profile shared on request after an NDA where required.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
