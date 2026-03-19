/**
 * LP:B — For agents who DON'T use photographers
 * Core message: Phone photos → professional quality → more interest → higher sale price.
 */
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSectionB } from "@/components/sections/lp-b/HeroSectionB";
import { SocialProofStripB } from "@/components/sections/lp-b/SocialProofStripB";
import { ProblemSectionB } from "@/components/sections/lp-b/ProblemSectionB";
import { FeaturesGrid } from "@/components/sections/FeaturesGrid";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { PricingPackagesA } from "@/components/sections/lp-a/PricingPackagesA";
import { ResultsSectionB } from "@/components/sections/lp-b/ResultsSectionB";
import { TestimonialsSectionB } from "@/components/sections/lp-b/TestimonialsSectionB";
import { FaqSectionB } from "@/components/sections/lp-b/FaqSectionB";
import { CTASectionB } from "@/components/sections/lp-b/CTASectionB";
import { SEO } from "@/components/SEO";

const LandingB = () => (
  <div className="min-h-screen bg-background overflow-x-hidden">
    <SEO
      title="Profesionálne fotky z mobilu"
      description="Fotky z telefónu premeníme na profesionálnu kvalitu. Viac záujmu, vyššia predajná cena. Vyskúšajte AI editor realitných fotiek."
      path="/bez-fotografa"
      breadcrumbs={[
        { name: "Domov", path: "/" },
        { name: "Bez fotografa", path: "/bez-fotografa" },
      ]}
    />
    <Header />
    <main>
      <HeroSectionB />
      <SocialProofStripB />
      <ProblemSectionB />
      <FeaturesGrid />
      <HowItWorksSection />
      <PricingPackagesA />
      <ResultsSectionB />
      <TestimonialsSectionB />
      <FaqSectionB />
      <CTASectionB />
    </main>
    <Footer />
  </div>
);

export default LandingB;
