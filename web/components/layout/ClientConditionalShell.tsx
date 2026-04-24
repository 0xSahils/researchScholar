"use client";

import { usePathname } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export function ClientConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // Admin routes: no public site chrome at all
  if (isAdmin) return <>{children}</>;

  // Public site
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main className="overflow-x-hidden">{children}</main>
      <SiteFooter />
      <FloatingWhatsApp />
    </>
  );
}
