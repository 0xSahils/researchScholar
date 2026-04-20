import Link from "next/link";

import { megaServices } from "@/lib/data/site-content";
import { siteConfig, whatsappHref } from "@/lib/site-config";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/scopus-publication", label: "Scopus publication" },
  { href: "/research-support", label: "Research support" },
  { href: "/contact", label: "Contact" },
  { href: "/order", label: "Place your order" },
];

export function SiteFooter() {
  return (
    <footer className="bg-brand-deep text-white">
      <div className="mx-auto max-w-content px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <p className="font-heading text-xl font-bold tracking-tight">
              {siteConfig.legalName}
            </p>
            <p className="text-sm leading-relaxed text-white/75">{siteConfig.tagline}</p>
            <p className="text-sm text-white/70">
              Every engagement is staffed by verified PhD scholars in matched domains, with
              documented originality checks and governed confidentiality.
            </p>
          </div>
          <nav aria-label="Footer quick links" className="space-y-3">
            <p className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent">
              Explore
            </p>
            <ul className="space-y-2 text-sm text-white/75">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link className="transition hover:text-white" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Services" className="space-y-3">
            <p className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent">
              Services
            </p>
            <ul className="space-y-2 text-sm text-white/75">
              {megaServices.map((service) => (
                <li key={service.title}>
                  <Link className="transition hover:text-white" href={service.href}>
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-4 text-sm text-white/75">
            <p className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent">
              Contact
            </p>
            <p>
              WhatsApp:{" "}
              <a className="text-white hover:underline" href={whatsappHref()}>
                {siteConfig.phoneDisplay}
              </a>
            </p>
            <p>
              Email:{" "}
              <a className="text-white hover:underline" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
            </p>
            <p className="text-white/60">{siteConfig.hours}</p>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 text-xs text-white/55">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p>
              © {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link className="hover:text-white" href="/privacy">
                Privacy
              </Link>
              <Link className="hover:text-white" href="/terms">
                Terms
              </Link>
              <Link className="hover:text-white" href="/plagiarism-policy">
                Plagiarism policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
