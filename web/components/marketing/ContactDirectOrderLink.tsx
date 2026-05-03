"use client";

import Link from "next/link";
import { WhatsappLogo } from "@phosphor-icons/react";

import { whatsappHref } from "@/lib/site-config";

const defaultMessage =
  "Hello, I would like to place an order / get a quote for ResearchScholars. Please guide me on the next steps.";

export function ContactDirectOrderLink({
  message = defaultMessage,
  className = "",
  variant = "outline",
  size = "default",
}: {
  message?: string;
  className?: string;
  variant?: "outline" | "ghostOnDark";
  size?: "default" | "compact";
}) {
  const styles =
    variant === "ghostOnDark"
      ? "border border-white/40 bg-white/5 text-white hover:bg-white/10"
      : "border border-brand-primary/30 bg-white text-brand-primary hover:border-brand-primary hover:bg-brand-light/30";

  const sizeStyles = size === "compact" ? "px-3 py-2 text-xs gap-1.5" : "px-5 py-2.5 text-sm gap-2";
  const iconClass = size === "compact" ? "h-4 w-4" : "h-5 w-5";

  return (
    <Link
      href={whatsappHref(message)}
      className={`inline-flex items-center justify-center rounded-btn font-semibold shadow-sm transition ${sizeStyles} ${styles} ${className}`.trim()}
    >
      <WhatsappLogo className={`${iconClass} shrink-0`} weight="fill" aria-hidden />
      Contact directly
    </Link>
  );
}
