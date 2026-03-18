import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { FeaturesGrid } from "@/components/sections/FeaturesGrid";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HowItWorks() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20 sm:pt-24">
        <div className="section-container py-12 sm:py-20 text-center max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Ako to funguje</p>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Profesionálne fotky za <span className="text-primary">30 sekúnd</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Nahrajte fotky nehnuteľnosti a naše AI ich automaticky vylepší na profesionálnu úroveň.
          </p>
        </div>

        <HowItWorksSection />
        <FeaturesGrid />

        <div className="section-container py-12 sm:py-16 text-center">
          <Button onClick={() => navigate("/login")} size="lg" className="font-bold group">
            Vyskúšať ZADARMO
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
