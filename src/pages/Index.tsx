import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { SocialProofStrip } from "@/components/sections/SocialProofStrip";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { FeaturesGrid } from "@/components/sections/FeaturesGrid";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { PricingComparison } from "@/components/sections/PricingComparison";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { CTASection } from "@/components/sections/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      <main>
        {/* 1. Hero — value prop + before/after + trust */}
        <HeroSection />

        {/* 2. Social proof — numbers strip */}
        <SocialProofStrip />

        {/* 3. Problem/Agitation — pain points */}
        <ProblemSection />

        {/* 4. Features — 9 AI capabilities with before/after */}
        <FeaturesGrid />

        {/* 5. How it works — 3-step process */}
        <HowItWorksSection />

        {/* 6. Pricing comparison — us vs them */}
        <PricingComparison />

        {/* 7. Testimonials — social proof */}
        <TestimonialsSection />

        {/* 8. FAQ — objection handling */}
        <FaqSection />

        {/* 9. Final CTA — conversion close */}
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
