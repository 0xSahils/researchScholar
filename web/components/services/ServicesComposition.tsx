import { ServicesHero } from "./ServicesHero";
import { ServicesAudienceTabs } from "./ServicesAudienceTabs";
import { ServicesGrid } from "./ServicesGrid";
import { ServicesStandards } from "./ServicesStandards";
import { ServicesPricing } from "./ServicesPricing";
import { ServicesCtaSection } from "./ServicesCtaSection";

export function ServicesComposition() {
  return (
    <main className="flex min-h-screen flex-col">
      <ServicesHero />
      <ServicesAudienceTabs />
      <ServicesGrid />
      <ServicesStandards />
      <ServicesPricing />
      <ServicesCtaSection />
    </main>
  );
}
