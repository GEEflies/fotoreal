import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { SocialProofStrip } from "@/components/sections/SocialProofStrip";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { ResultsSection } from "@/components/sections/ResultsSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { PdfGuideSection } from "@/components/sections/PdfGuideSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ValuationModal } from "@/components/valuation/ValuationModal";
import { FloatingCTA } from "@/components/ui/FloatingCTA";

const Index = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header onOpenForm={openForm} />
      
      <main className="pb-16 sm:pb-20 lg:pb-0">
        <HeroSection onOpenForm={openForm} />
        <SocialProofStrip />
        <BenefitsSection onOpenForm={openForm} />
        <ResultsSection />
        <HowItWorksSection onOpenForm={openForm} />
        <PdfGuideSection onOpenForm={openForm} />
        <FaqSection />
        <AboutSection />
        <ContactSection onOpenForm={openForm} />
      </main>

      <Footer />
      
      <ValuationModal isOpen={isFormOpen} onClose={closeForm} />
      <FloatingCTA onClick={openForm} isVisible={!isFormOpen} />
    </div>
  );
};

export default Index;
