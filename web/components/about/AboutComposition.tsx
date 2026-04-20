import { BentoStatsHome } from "@/components/home/BentoStatsHome";
import { AboutCtaSection } from "@/components/about/AboutCtaSection";
import { AboutHero } from "@/components/about/AboutHero";
import { CredibilitySection } from "@/components/about/CredibilitySection";
import { MissionVisionSection } from "@/components/about/MissionVisionSection";
import { StorySection } from "@/components/about/StorySection";
import { TeamSection } from "@/components/about/TeamSection";
import { ValuesSection } from "@/components/about/ValuesSection";

export function AboutComposition() {
  return (
    <>
      <AboutHero />
      <StorySection />
      <MissionVisionSection />
      <BentoStatsHome />
      <TeamSection />
      <ValuesSection />
      <CredibilitySection />
      <AboutCtaSection />
    </>
  );
}
