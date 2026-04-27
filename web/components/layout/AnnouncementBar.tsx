import Link from "next/link";

const tickerItems = [
  "Welcome to ResearchScholars — structured support by PhD scholars",
  "500+ academic projects delivered",
  "94% Scopus-indexed acceptance on supported submissions",
  "Average first response under one hour on working days",
  "98% on-time delivery across tracked milestones",
];

export function AnnouncementBar() {
  const loop = [...tickerItems, ...tickerItems];

  return (
    <div className="sticky top-0 z-[80] flex h-9 items-center overflow-hidden bg-brand-primary text-xs text-white md:text-sm">
      <div className="flex min-w-0 flex-1 items-center">
        <div className="animate-marquee flex whitespace-nowrap hover:[animation-play-state:paused]">
          {loop.map((item, index) => (
            <span key={`${item}-${index}`} className="mx-8 inline-flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-brand-gold" aria-hidden />
              {item}
            </span>
          ))}
        </div>
      </div>
      <Link
        href="/track-order"
        className="hidden shrink-0 border-l border-white/20 px-4 font-medium tracking-wide text-white/90 transition hover:text-white md:inline-flex"
      >
        Track order
      </Link>
    </div>
  );
}
