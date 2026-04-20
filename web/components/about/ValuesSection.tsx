"use client";

import {
  ChatCircle,
  LockKey,
  Medal,
  Scales,
  ShieldCheck,
  UsersThree,
} from "@phosphor-icons/react";

import { values } from "@/lib/data/site-content";

const icons = [ShieldCheck, Medal, LockKey, Scales, UsersThree, ChatCircle];

export function ValuesSection() {
  return (
    <section className="border-y border-white/10 bg-[#050d08] text-white" aria-labelledby="values-heading">
      <div className="mx-auto max-w-content px-6 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">Operating values</p>
          <h2 id="values-heading" className="mt-3 font-heading text-3xl font-bold text-white md:text-4xl">
            Non-negotiables on every statement of work we sign.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => {
            const Icon = icons[index % icons.length];
            return (
              <article
                key={value.title}
                className="group rounded-card border border-white/10 bg-white/5 p-6 shadow-card transition duration-500 ease-premium hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-cardHover"
              >
                <Icon className="h-8 w-8 text-brand-accent" weight="duotone" aria-hidden />
                <h3 className="mt-4 font-heading text-lg font-semibold text-white">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{value.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
