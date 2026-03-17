import { Star, Pin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroProperty from "@/assets/hero-property.jpg";
import heroBackground from "@/assets/hero-background.jpg";
interface HeroSectionProps {
  onOpenForm: () => void;
}
export function HeroSection({
  onOpenForm
}: HeroSectionProps) {
  return <section id="domov" className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[85vh] flex items-center pt-16 sm:pt-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero opacity-5" />
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `url('${heroBackground}')`,
      opacity: 0.12
    }} />

      <div className="section-container relative z-10 pb-[30px]">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-4 sm:space-y-6 animate-slide-up">
            {/* Headline - 2 lines */}
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-5xl font-extrabold leading-tight text-foreground">
              Zistite aktuálnu hodnotu
              <br />
              <span className="text-primary text-3xl sm:text-4xl lg:text-5xl sm:whitespace-nowrap">vašej nehnuteľnosti!</span>
            </h1>

            {/* Subheadline */}
            <p className="font-semibold text-foreground text-base sm:text-xl">
              <span className="text-primary">BONUS:</span> PDF návod ako bežne pridávame{" "}
              <span className="font-bold">10–20 tisíc eur</span> k hodnote nehnuteľnosti.
            </p>

            <p className="text-muted-foreground leading-relaxed max-w-xl text-sm sm:text-lg">
              Pošleme vám veľmi reálny odhad hodnoty vašej nehnuteľnosti a PDF návod, ako zvýšiť cenu pri predaji kľudne aj o 20 tisíc eur.
            </p>

            {/* CTA */}
            <Button size="lg" onClick={onOpenForm} className="w-full sm:w-auto group font-bold shadow-glow hover:shadow-lg transition-all px-4 sm:px-6">
              <span className="sm:hidden text-base">Získať ocenenie ZDARMA</span>
              <span className="hidden sm:inline">Získať ocenenie + PDF návod ZDARMA</span>
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => <Star key={star} className="h-3 w-3 sm:h-4 sm:w-4 fill-warning text-warning" />)}
                </div>
                <span className="font-semibold text-foreground">4.9/5</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <span>100% zdarma</span>
            </div>

            {/* SMS Callout */}
            <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-success/10 border-l-4 border-success w-full sm:max-w-md">
              <Pin className="h-4 w-4 sm:h-5 sm:w-5 text-success flex-shrink-0" />
              <span className="text-xs sm:text-sm text-foreground">Všetko posielame priamo do SMS.</span>
            </div>
          </div>

          {/* Hero Image - Property */}
          <div className="relative hidden lg:flex justify-center animate-fade-in">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img src={heroProperty} alt="Moderná nehnuteľnosť na predaj" className="w-full h-auto max-h-[480px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>;
}