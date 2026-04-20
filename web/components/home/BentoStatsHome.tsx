"use client";

import { useEffect, useRef, useState } from "react";

import { homeStats } from "@/lib/data/site-content";

function useInViewOnce<T extends Element>(margin = "-10% 0px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: margin, threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [inView, margin]);

  return { ref, inView };
}

function useCountUp(target: number, enabled: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    const duration = 1800;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [enabled, target]);

  return value;
}

function StatCell({
  number,
  suffix,
  label,
  className,
}: {
  number: number;
  suffix: string;
  label: string;
  className?: string;
}) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>("-10% 0px");
  const display = useCountUp(number, inView);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-card border border-white/10 bg-white/5 p-6 shadow-innerHighlight ${className ?? ""}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(45,140,78,0.35),transparent_55%)]" />
      <p className="font-mono text-4xl font-semibold text-white md:text-5xl">
        {display}
        <span className="text-brand-accent">{suffix}</span>
      </p>
      <p className="mt-3 text-sm text-white/70">{label}</p>
    </div>
  );
}

export function BentoStatsHome() {
  return (
    <section className="relative overflow-hidden bg-brand-primary text-white" aria-label="Key performance metrics">
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:repeating-linear-gradient(135deg,rgba(255,255,255,0.35)_0,rgba(255,255,255,0.35)_1px,transparent_1px,transparent_12px)]" />
      <div className="relative mx-auto max-w-content px-6 py-20 lg:px-8 lg:py-24">
        <div className="mb-10 max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-light">Evidence, not adjectives</p>
          <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            Delivery metrics we publish because clients hold us to them.
          </h2>
          <p className="text-sm text-white/75">
            Figures reflect governed internal reporting on completed engagements and supported
            Scopus-tracked submissions. They are not a promise of future journal decisions.
          </p>
        </div>

        <div className="grid auto-rows-fr grid-flow-dense gap-4 md:grid-cols-6">
          <StatCell
            className="md:col-span-3 md:row-span-2 md:p-8"
            number={homeStats[0].value}
            suffix={homeStats[0].suffix}
            label={homeStats[0].label}
          />
          <StatCell
            className="md:col-span-3"
            number={homeStats[1].value}
            suffix={homeStats[1].suffix}
            label={homeStats[1].label}
          />
          <StatCell
            className="md:col-span-2"
            number={homeStats[2].value}
            suffix={homeStats[2].suffix}
            label={homeStats[2].label}
          />
          <StatCell
            className="md:col-span-2"
            number={homeStats[3].value}
            suffix={homeStats[3].suffix}
            label={homeStats[3].label}
          />
          <StatCell
            className="md:col-span-2"
            number={homeStats[4].value}
            suffix={homeStats[4].suffix}
            label={homeStats[4].label}
          />
        </div>
      </div>
    </section>
  );
}
