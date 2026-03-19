import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AboutSection } from "@/components/sections/AboutSection";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="O nás"
        description="Sme slovenský tím s vášňou pre technológie a realitný trh. Pomáhame realitným maklérom s profesionálnymi fotkami pomocou AI."
        path="/o-nas"
        breadcrumbs={[
          { name: "Domov", path: "/" },
          { name: "O nás", path: "/o-nas" },
        ]}
      />
      <Header />
      <main className="flex-1 pt-20 sm:pt-24">
        <div className="section-container py-12 sm:py-20 text-center max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">O nás</p>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Kto stojí za <span className="text-primary">RealFoto</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Sme slovenský tím s vášňou pre technológie a realitný trh.
          </p>
        </div>

        <AboutSection />

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
