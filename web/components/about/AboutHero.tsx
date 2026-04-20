import Image from "next/image";

export function AboutHero() {
  return (
    <section
      className="relative min-h-[min(52vh,520px)] overflow-hidden bg-[#040a06] text-white"
      aria-labelledby="about-hero-heading"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d2818] via-[#071510] to-[#040a06]" aria-hidden />
      <div
        className="absolute right-0 top-0 h-[min(70vw,420px)] w-[min(70vw,420px)] rounded-full bg-emerald-500/20 blur-[100px]"
        aria-hidden
      />
      <div className="absolute inset-0">
        <Image
          src="/images/about-hero.png"
          alt=""
          fill
          className="img-grade-section object-cover opacity-45"
          priority
          aria-hidden
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#040a06] via-brand-deep/88 to-brand-deep/55" />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(45,140,78,0.2),transparent_50%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-content px-6 py-24 lg:px-8 lg:py-28">
        <nav aria-label="Breadcrumb" className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          <ol className="flex flex-wrap gap-2">
            <li>
              <a className="hover:text-white" href="/">
                Home
              </a>
            </li>
            <li aria-hidden>/</li>
            <li className="text-white">About</li>
          </ol>
        </nav>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
          People behind the platform
        </p>
        <h1 id="about-hero-heading" className="mt-4 max-w-4xl font-heading text-4xl font-bold leading-tight md:text-5xl">
          The research desk we wished existed when we were defending theses and chasing indexed
          acceptance letters.
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/80">
          ResearchScholars.online is operated by publishing-active PhD scholars who combine
          committee-aware writing, similarity governance, and journal-side realism—without outsourcing
          your authorship voice.
        </p>
      </div>
    </section>
  );
}
