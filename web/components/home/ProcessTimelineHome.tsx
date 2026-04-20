import { ContentIcon } from "@/components/icons/ContentIcon";
import { processSteps } from "@/lib/data/site-content";

export function ProcessTimelineHome() {
  return (
    <section
      className="border-y border-white/10 bg-brand-deep text-white"
      aria-labelledby="process-heading"
    >
      <div className="mx-auto max-w-content px-6 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">How it works</p>
          <h2 id="process-heading" className="mt-3 font-heading text-3xl font-bold text-white md:text-4xl">
            From brief to delivery in three governed moves
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            You always know who owns the draft, when similarity checks run, and how revisions are
            folded back in—no black-box ghostwriting.
          </p>
        </div>

        <div className="relative mx-auto mt-14 max-w-5xl">
          <div className="pointer-events-none absolute left-[8%] right-[8%] top-10 hidden h-0.5 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary md:block" />
          <ol className="relative grid gap-10 md:grid-cols-3 md:gap-6">
          {processSteps.map((step, index) => (
            <li key={step.title} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-brand-light shadow-card ring-4 ring-white/10">
                <ContentIcon name={step.icon} className="h-8 w-8" weight="duotone" aria-hidden />
                <span className="absolute -top-3 rounded-full bg-brand-accent px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-deep">
                  Step {index + 1}
                </span>
              </div>
              <h3 className="mt-6 font-heading text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{step.body}</p>
            </li>
          ))}
          </ol>
        </div>

        <div className="mx-auto mt-12 max-w-4xl rounded-card border border-white/10 bg-white/5 p-6 text-center text-sm text-white/70 shadow-card backdrop-blur-sm">
          Confidential handling · plagiarism certificate on request · revision windows documented in
          your statement of work · urgent lanes when the bench confirms feasibility
        </div>
      </div>
    </section>
  );
}
