import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ResultsSection } from "@/components/sections/ResultsSection";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";

export default function References() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Referencie"
        description="Pozrite sa, čo hovoria naši klienti a aké výsledky dosahujú s RealFoto AI editorom realitných fotiek."
        path="/referencie"
        breadcrumbs={[
          { name: "Domov", path: "/" },
          { name: "Referencie", path: "/referencie" },
        ]}
      />
      <Header />
      <main className="flex-1 pt-20 sm:pt-24">
        {/* Hero */}
        <div className="section-container py-12 sm:py-20 text-center max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Referencie</p>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Výsledky hovoria za <span className="text-primary">nás</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Pozrite sa, čo hovoria naši klienti a aké výsledky dosahujú s RealFoto.
          </p>
        </div>

        <TestimonialsSection />
        <ResultsSection />

        {/* Bottom CTA */}
        <div className="section-container py-12 sm:py-16 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Pridajte sa k spokojným klientom
          </h2>
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
