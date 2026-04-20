import Image from "next/image";
import Link from "next/link";

import { challengeCards } from "@/lib/data/site-content";

export function ChallengeHome() {
  return (
    <section className="relative overflow-hidden bg-brand-deep text-white" aria-labelledby="challenge-heading">
      <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] translate-x-1/3 -translate-y-10 opacity-20">
        <Image
          src="/images/challenge-student.png"
          alt=""
          width={900}
          height={700}
          className="h-full w-full object-cover"
          aria-hidden
          priority={false}
        />
      </div>
      <div className="relative mx-auto max-w-content px-6 py-20 lg:px-8 lg:py-24">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            The academic challenge
          </p>
          <h2 id="challenge-heading" className="font-heading text-3xl font-bold md:text-4xl">
            You are capable of strong research—let&apos;s remove the structural friction.
          </h2>
          <p className="text-sm leading-relaxed text-white/70">
            Indian researchers operate in high-throughput programmes with thin writing mentorship.
            These are the failure modes we see most often—and the ones our bench is built to unwind.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {challengeCards.map((card) => (
            <article
              key={card.title}
              className="rounded-card border border-white/10 bg-[#1a3d22] p-6 shadow-card transition duration-500 ease-premium hover:-translate-y-1 hover:border-brand-accent/40"
            >
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#ff6b6b]" aria-hidden />
                <div>
                  <h3 className="font-heading text-lg font-semibold text-white">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">{card.body}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/research-support"
            className="inline-flex items-center justify-center rounded-btn border border-white px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-brand-deep"
          >
            See how we solve this
          </Link>
          <Link
            href="/order"
            className="inline-flex items-center justify-center rounded-btn bg-white px-5 py-2.5 text-sm font-semibold text-brand-deep transition hover:bg-brand-light"
          >
            Skip to a scoped quote
          </Link>
        </div>
      </div>
    </section>
  );
}
