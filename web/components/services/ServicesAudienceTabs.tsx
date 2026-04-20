"use client";

import { useState } from "react";
import clsx from "clsx";
import { audienceTabs } from "@/lib/data/site-content";

export function ServicesAudienceTabs() {
  const [activeTab, setActiveTab] = useState(audienceTabs[0].id);

  return (
    <section className="bg-surface-cream border-y border-surface-line py-16 lg:py-24" aria-labelledby="audience-heading">
      <div className="mx-auto max-w-content px-6 lg:px-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">Who We Serve</p>
        <h2 id="audience-heading" className="mt-3 font-heading text-3xl font-bold text-ink md:text-4xl">
          Support adapted to your academic level.
        </h2>
        
        {/* Tabs */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {audienceTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "rounded-full px-5 py-2.5 text-sm font-semibold transition duration-300 ease-premium",
                activeTab === tab.id
                  ? "bg-brand-primary text-white shadow-card shadow-brand-primary/20"
                  : "bg-surface-subtle text-ink/70 hover:bg-black/5 hover:text-ink"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        <div className="mt-8 mx-auto max-w-3xl min-h-[90px]">
          {audienceTabs.map((tab) => (
            <div
              key={tab.id}
              role="tabpanel"
              className={clsx(
                "transition-all duration-500 ease-premium rounded-[2rem] border border-surface-line/80 bg-gradient-to-br from-surface-cream to-white/70 p-6 md:p-8 shadow-diffusion",
                activeTab === tab.id ? "opacity-100 translate-y-0 relative z-10" : "opacity-0 translate-y-4 absolute inset-x-0 top-0 pointer-events-none"
              )}
              {...(activeTab !== tab.id ? { "aria-hidden": true } : {})}
            >
              <h3 className="font-heading text-xl font-bold text-ink mb-2">{tab.label} Focus</h3>
              <p className="text-base text-ink-muted leading-relaxed">
                {tab.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
