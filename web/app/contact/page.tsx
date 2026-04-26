import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChatCircleDots, EnvelopeSimple, PhoneCall, Question } from "@phosphor-icons/react/dist/ssr";

import { FaqAccordion } from "@/components/common/FaqAccordion";
import { siteConfig, whatsappHref } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact ResearchScholars",
  description:
    "Reach the ResearchScholars desk via WhatsApp, email, or the contact form for quotes, timelines, and collaboration questions.",
  alternates: { canonical: "/contact" },
};

const faqItems = [
  {
    q: "How do I place an order?",
    a: "Use the order page or message us on WhatsApp with your topic, deadline, and institution guidelines.",
  },
  {
    q: "Is the work original?",
    a: "Yes. Every assignment follows original writing protocols with similarity checks before delivery.",
  },
  {
    q: "Can you handle urgent deadlines?",
    a: "Yes, for many services. We confirm feasibility within one hour during working windows.",
  },
  {
    q: "What subjects do you cover?",
    a: "Engineering, medicine, management, social sciences, law, life sciences, computer science, and related fields.",
  },
] as const;

export default function ContactPage() {
  return (
    <main className="bg-gradient-to-b from-surface-cream via-surface-mist/60 to-surface-cream">
      <section className="mx-auto max-w-content px-6 py-20 lg:px-8 lg:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">Contact desk</p>
        <h1 className="mt-3 max-w-3xl font-heading text-4xl font-bold text-ink md:text-5xl">
          Talk to our team before you place your order.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-ink-muted">
          We reply fastest on WhatsApp and can guide scope, delivery window, and domain-match availability in one conversation.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <article className="rounded-card border border-surface-line bg-white p-5 shadow-card">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-primary"><ChatCircleDots className="h-4 w-4" />WhatsApp</p>
            <p className="mt-2 text-sm text-ink-muted">Fastest support during working hours</p>
            <Link href={whatsappHref("Hello, I need a quote for academic support.")} className="group mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-primary">
              Message now <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </article>
          <article className="rounded-card border border-surface-line bg-white p-5 shadow-card">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-primary"><EnvelopeSimple className="h-4 w-4" />Email</p>
            <p className="mt-2 text-sm text-ink-muted">{siteConfig.email}</p>
            <a href={`mailto:${siteConfig.email}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-primary">
              Send details
            </a>
          </article>
          <article className="rounded-card border border-surface-line bg-white p-5 shadow-card">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-primary"><PhoneCall className="h-4 w-4" />Working hours</p>
            <p className="mt-2 text-sm text-ink-muted">{siteConfig.hours}</p>
            <p className="mt-4 text-sm font-semibold text-ink">{siteConfig.phoneDisplay}</p>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-content px-6 pb-16 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.5rem] border border-surface-line bg-white p-6 shadow-card md:p-8">
            <h2 className="font-heading text-2xl font-bold text-ink">Send a detailed requirement</h2>
            <form className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Name
                </label>
                <input id="contact-name" className="w-full rounded-btn border border-surface-line bg-surface-cream px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-primary" placeholder="Your full name" />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Email
                </label>
                <input id="contact-email" type="email" className="w-full rounded-btn border border-surface-line bg-surface-cream px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-primary" placeholder="you@example.com" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="contact-subject" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Subject
                </label>
                <select id="contact-subject" className="w-full rounded-btn border border-surface-line bg-surface-cream px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-primary">
                  <option>General query</option>
                  <option>Order inquiry</option>
                  <option>Pricing support</option>
                  <option>Urgent request</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="contact-message" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Message
                </label>
                <textarea id="contact-message" rows={5} className="w-full rounded-btn border border-surface-line bg-surface-cream px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-primary" placeholder="Share your topic, deadline, and required output." />
              </div>
              <div className="md:col-span-2">
                <button type="button" className="group inline-flex items-center gap-2 rounded-btn bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-deep">
                  Send message
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-[1.5rem] border border-surface-line bg-white p-6 shadow-card md:p-8">
            <h2 className="inline-flex items-center gap-2 font-heading text-2xl font-bold text-ink"><Question className="h-6 w-6 text-brand-primary" />Quick answers</h2>
            <div className="mt-6">
              <FaqAccordion items={faqItems.map((item) => ({ question: item.q, answer: item.a }))} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
