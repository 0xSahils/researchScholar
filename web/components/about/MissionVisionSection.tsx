import { missionVision } from "@/lib/data/site-content";

export function MissionVisionSection() {
  return (
    <section
      className="border-y border-white/10 bg-brand-deep text-white"
      aria-labelledby="mission-heading"
    >
      <div className="mx-auto max-w-content px-6 py-20 lg:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-diffusion backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">Mission</p>
            <h2 id="mission-heading" className="mt-3 font-heading text-2xl font-bold text-white">
              Make PhD-led support reachable at the moment writing risk peaks.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/70">{missionVision.mission}</p>
          </article>
          <article className="rounded-[2rem] border border-white/10 bg-brand-primary p-8 text-white shadow-cardHover">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-light">Vision</p>
            <h2 className="mt-3 font-heading text-2xl font-bold">Earn trust through defensible drafts.</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/80">{missionVision.vision}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
