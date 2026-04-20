import { AboutIntroHome } from "@/components/home/AboutIntroHome";
import { BentoStatsHome } from "@/components/home/BentoStatsHome";
import { ChallengeHome } from "@/components/home/ChallengeHome";
import { CtaBannerHome } from "@/components/home/CtaBannerHome";
import { FeatureStripsHome } from "@/components/home/FeatureStripsHome";
import { HeroHome } from "@/components/home/HeroHome";
import { LogoMarqueeHome } from "@/components/home/LogoMarqueeHome";
import { ProcessTimelineHome } from "@/components/home/ProcessTimelineHome";
import { ServicesTabsHome } from "@/components/home/ServicesTabsHome";
import { TestimonialsHome } from "@/components/home/TestimonialsHome";
import { WhyChooseHome } from "@/components/home/WhyChooseHome";

export function HomeComposition() {
  return (
    <>
      <HeroHome />
      <FeatureStripsHome />
      <AboutIntroHome />
      <BentoStatsHome />
      <ChallengeHome />
      <ServicesTabsHome />
      <ProcessTimelineHome />
      <WhyChooseHome />
      <LogoMarqueeHome />
      <TestimonialsHome />
      <CtaBannerHome />
    </>
  );
}
