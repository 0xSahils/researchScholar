"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

export function FeaturedCarousel({
  features,
}: {
  features: any[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (features.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 5000); // 5 seconds per slide
    return () => clearInterval(interval);
  }, [features.length]);

  if (!features || features.length === 0) return null;

  return (
    <section className="mt-8 overflow-hidden rounded-[1.5rem] border border-surface-line bg-white shadow-card relative h-[340px] group">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={features[currentIndex].cover_image_url ?? "https://picsum.photos/seed/blog-featured/1280/720"}
            alt={features[currentIndex].title}
            fill
            className="object-cover"
            priority /* Since it's LCP */
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col justify-end p-6 z-10 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="pointer-events-auto max-w-2xl text-white"
          >
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              {features[currentIndex].category ?? "General"}
            </span>
            <h2 className="mt-3 font-heading text-2xl md:text-3xl font-bold leading-tight">
              {features[currentIndex].title}
            </h2>
            <p className="mt-2 text-sm text-white/80 line-clamp-2">
              {features[currentIndex].excerpt}
            </p>
            <Link
              href={`/blog/${features[currentIndex].slug}`}
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold transition hover:text-brand-light"
            >
              Read Article <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* progress indicators */}
      {features.length > 1 && (
        <div className="absolute bottom-6 right-6 flex gap-1.5 z-20">
          {features.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
