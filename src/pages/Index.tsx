import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesGrid } from "@/components/sections/FeaturesGrid";
import { PricingComparison } from "@/components/sections/PricingComparison";
import { CTASection } from "@/components/sections/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      
      <main>
        <HeroSection />
        <FeaturesGrid />
        <PricingComparison />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
