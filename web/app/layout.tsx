import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Inter, JetBrains_Mono, Nunito_Sans } from "next/font/google";
import { ClientConditionalShell } from "@/components/layout/ClientConditionalShell";
import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
import { defaultMetadata } from "@/lib/metadata-defaults";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap", weight: ["400", "500"] });
const nunito = Nunito_Sans({ subsets: ["latin"], variable: "--font-nunito", display: "swap", weight: ["600", "700"], adjustFontFallback: false });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], variable: "--font-dm-serif", display: "swap", weight: "400" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap", weight: "600" });

export const metadata: Metadata = defaultMetadata;
export const viewport: Viewport = { themeColor: "#0D2F17" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body className={`${inter.variable} ${nunito.variable} ${dmSerif.variable} ${jetbrains.variable} min-h-[100dvh] bg-surface-cream font-sans text-ink`}>
        <SiteJsonLd />
        <div className="grain-overlay" aria-hidden />
        {/*
          ClientConditionalShell:
          - /admin/* → renders children only (no SiteHeader/Footer)
          - everything else → full public site chrome
        */}
        <ClientConditionalShell>
          {children}
        </ClientConditionalShell>
      </body>
    </html>
  );
}
