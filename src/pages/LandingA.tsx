/**
 * LP:A — For agents who USE photographers
 * Core message: Same professional quality at 90% less cost. Replace your photographer bill.
 */
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSectionA } from "@/components/sections/lp-a/HeroSectionA";
import { SocialProofStrip } from "@/components/sections/SocialProofStrip";
import { ProblemSectionA } from "@/components/sections/lp-a/ProblemSectionA";
import { FeaturesGrid } from "@/components/sections/FeaturesGrid";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { PricingComparisonA } from "@/components/sections/lp-a/PricingComparisonA";
import { TestimonialsSectionA } from "@/components/sections/lp-a/TestimonialsSectionA";
import { FaqSection } from "@/components/sections/FaqSection";
import { CTASectionA } from "@/components/sections/lp-a/CTASectionA";

const LandingA = () => (
  <div className="min-h-screen bg-background overflow-x-hidden">
    <Header />
    <main>
      <HeroSectionA />
      <SocialProofStrip />
      <ProblemSectionA />
      <FeaturesGrid />
      <HowItWorksSection />
      <PricingComparisonA />
      <TestimonialsSectionA />
      <FaqSection />
      <CTASectionA />
    </main>
    <Footer />
  </div>
);

export default LandingA;
