import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FeaturesGrid } from "@/components/sections/FeaturesGrid";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Clock, Sofa, Sparkles, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";

const highlights = [
  {
    icon: Zap,
    title: "Blesková rýchlosť",
    description: "Hotové za menej ako 30 sekúnd. Bez čakania, bez oneskorení. Nahrajte a stiahnite.",
  },
  {
    icon: Shield,
    title: "GDPR súlad",
    description: "Automatické rozmazanie tvárí a ŠPZ. Ochrana súkromia na každej fotke bez manuálnej práce.",
  },
  {
    icon: Clock,
    title: "24/7 dostupnosť",
    description: "Na rozdiel od fotografa, RealFoto je k dispozícii kedykoľvek — cez víkendy, sviatky aj o polnoci.",
  },
  {
    icon: Sofa,
    title: "Automatický staging",
    description: "Virtuálne zariadenie prázdnych miestností. Nábytok a dekorácie pridané pomocou AI.",
  },
  {
    icon: Sparkles,
    title: "Zlepšenie kvality",
    description: "Automatické zvýšenie rozlíšenia, ostrosti a celkovej kvality fotky z mobilu.",
  },
  {
    icon: Layers,
    title: "Dávkové spracovanie",
    description: "Nahrajte 50+ fotiek naraz. Spracujte celú nehnuteľnosť v jednom kroku.",
  },
];

export default function Features() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Funkcie"
        description="HDR spájanie, výmena oblohy, korekcia perspektívy, rozmazanie tvárí a ŠPZ, virtuálny staging. Všetko automaticky pomocou AI."
        path="/funkcie"
      />
      <Header />
      <main className="flex-1 pt-20 sm:pt-24">
        {/* Hero */}
        <div className="section-container py-12 sm:py-20 text-center max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Funkcie</p>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Všetko čo potrebujete pre <span className="text-primary">dokonalé fotky</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto mb-8">
            RealFoto kombinuje 9+ AI technológií na automatickú úpravu fotografií nehnuteľností na profesionálnu úroveň.
          </p>
          <Button onClick={() => navigate("/login")} size="lg" className="font-bold group">
            Vyskúšať ZADARMO
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Highlights grid */}
        <section className="section-padding bg-accent/30">
          <div className="section-container">
            <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
                Prečo si vybrať <span className="text-primary">RealFoto</span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Kľúčové výhody, ktoré vás odlíšia od konkurencie.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
              {highlights.map((h, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-lg transition-all">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <h.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground text-base mb-2">{h.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{h.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed features with before/after */}
        <FeaturesGrid />

        {/* How it works */}
        <HowItWorksSection />

        {/* Bottom CTA */}
        <div className="section-container py-12 sm:py-16 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Pripravení na zmenu?
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mb-6 max-w-md mx-auto">
            5 kreditov zadarmo. Bez záväzkov. Výsledky za 30 sekúnd.
          </p>
          <Button onClick={() => navigate("/login")} size="lg" className="font-bold group">
            Začať ZADARMO
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
