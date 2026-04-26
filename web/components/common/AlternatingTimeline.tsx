"use client";

import { CheckCircle, Sparkle } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

export function AlternatingTimeline({ steps }: { steps: string[] }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          steps.forEach((_, index) => {
            window.setTimeout(() => {
              setVisibleCount((prev) => Math.max(prev, index + 1));
            }, index * 150);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [steps]);

  return (
    <div ref={rootRef} className="relative space-y-6">
      <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-brand-primary/20 md:block" />
      {steps.map((step, index) => {
        const isOdd = index % 2 === 0;
        const isVisible = index < visibleCount;
        return (
          <article
            key={step}
            className={`relative grid items-center gap-4 transition-all duration-500 md:grid-cols-2 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            <div className={isOdd ? "md:pr-10" : "md:order-2 md:pl-10"}>
              <div className="relative rounded-card border border-surface-line bg-surface-cream p-5">
                <span className="pointer-events-none absolute -top-2 right-3 font-mono text-5xl font-semibold text-brand-primary/10">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-primary">
                  <Sparkle className="h-3.5 w-3.5" />
                  Step {index + 1}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink">{step}</p>
              </div>
            </div>
            <div className={isOdd ? "md:order-2 md:pl-10" : "md:pr-10"}>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-brand-primary/30 bg-brand-light text-brand-primary">
                <CheckCircle className="h-6 w-6" weight="fill" />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
