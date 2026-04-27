"use client";

import {
  ArrowRight,
  List,
  X,
} from "@phosphor-icons/react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { primaryNav } from "@/lib/data/site-content";
import { whatsappHref } from "@/lib/site-config";

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "relative font-medium transition duration-300 ease-premium",
        active ? "text-brand-primary" : "text-ink/80 hover:text-brand-primary",
      )}
    >
      {label}
      {active ? (
        <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-brand-accent" />
      ) : null}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setScrolled(!entry.isIntersecting);
      },
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <div ref={sentinelRef} className="h-px w-full" aria-hidden />
      <header
        className={clsx(
          "sticky top-9 z-[70] border-b transition-all duration-500 ease-premium",
          scrolled
            ? "border-surface-line/80 bg-surface-cream/95 shadow-card backdrop-blur-md"
            : "border-transparent bg-surface-cream/90 backdrop-blur-sm",
        )}
      >
        <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading text-lg font-bold tracking-tight text-brand-primary md:text-xl">
              ResearchScholars
            </span>
            <span className="hidden rounded-full bg-brand-light px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-primary sm:inline-flex">
              PhD bench
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-7 text-sm lg:flex">
            {primaryNav.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                active={pathname === item.href}
              />
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href={whatsappHref()}
              className="rounded-btn border border-brand-primary/15 px-4 py-2 text-sm font-semibold text-brand-primary transition hover:border-brand-primary/40"
            >
              Free quote
            </Link>
            <Link
              href="/order"
              className="group inline-flex items-center gap-2 rounded-btn bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:-translate-y-[1px] hover:bg-brand-deep hover:shadow-cardHover"
            >
              Place your order
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition group-hover:translate-x-0.5 group-hover:-translate-y-px">
                <ArrowRight className="h-4 w-4" weight="bold" aria-hidden />
              </span>
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-primary/10 text-brand-primary lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-drawer"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <List className="h-6 w-6" />}
            <span className="sr-only">Toggle navigation</span>
          </button>
        </div>

        {/* Services Mega Menu deferred to Phase 2 */}
      </header>

      <div
        id="mobile-drawer"
        className={clsx(
          "fixed inset-0 z-[80] bg-brand-deep/70 backdrop-blur-md transition lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!mobileOpen}
        onClick={() => setMobileOpen(false)}
      >
        <div
          className={clsx(
            "absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-surface-cream p-6 shadow-card transition duration-500 ease-premium",
            mobileOpen ? "translate-x-0" : "translate-x-full",
          )}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-8 flex items-center justify-between">
            <p className="font-heading text-lg font-bold text-brand-primary">Menu</p>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-primary/10"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-col gap-4 text-base font-semibold text-ink">
            {primaryNav.map((item) => (
              <Link key={item.href} href={item.href} className="border-b border-surface-line pb-3">
                {item.label}
              </Link>
            ))}
            <Link
              href="/order"
              className="mt-4 rounded-btn bg-brand-primary px-4 py-3 text-center text-white"
            >
              Place your order
            </Link>
            <Link
              href={whatsappHref()}
              className="rounded-btn border border-brand-primary px-4 py-3 text-center text-brand-primary"
            >
              WhatsApp a brief
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
