"use client";

import { CaretDown } from "@phosphor-icons/react";
import { useId, useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

export function FaqAccordion({ items, titleIcon }: { items: FaqItem[]; titleIcon?: React.ReactNode }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const rootId = useId();

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${rootId}-panel-${index}`;
        return (
          <details
            key={item.question}
            open={isOpen}
            onToggle={(event) => {
              if (!event.currentTarget.open && isOpen) {
                setOpenIndex(null);
                return;
              }
              if (event.currentTarget.open) {
                setOpenIndex(index);
              }
            }}
            className={`group overflow-hidden rounded-card border bg-surface-cream transition ${
              isOpen
                ? "border-brand-primary/40 border-l-4 border-l-brand-primary"
                : "border-surface-line"
            }`}
          >
            <summary
              className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 text-sm font-semibold text-ink"
              onClick={(event) => {
                event.preventDefault();
                setOpenIndex((prev) => (prev === index ? null : index));
              }}
            >
              <span className="inline-flex items-center gap-2">
                {titleIcon}
                {item.question}
              </span>
              <CaretDown
                className={`h-4 w-4 shrink-0 text-brand-primary transition-transform duration-300 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
                aria-hidden
              />
            </summary>
            <div
              id={panelId}
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-80"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-4 pb-4 text-sm leading-relaxed text-ink-muted">{item.answer}</p>
              </div>
            </div>
          </details>
        );
      })}
    </div>
  );
}
