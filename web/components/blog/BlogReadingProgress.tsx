"use client";

import { useEffect, useState } from "react";

export function BlogReadingProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const max = doc.scrollHeight - doc.clientHeight;
      setP(max > 0 ? Math.min(1, scrollTop / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed left-0 top-0 z-[90] h-[3px] w-full bg-black/10" aria-hidden>
      <div className="h-full origin-left bg-brand-primary transition-[transform] duration-150 ease-out" style={{ transform: `scaleX(${p})` }} />
    </div>
  );
}
