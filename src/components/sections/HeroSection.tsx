import { ArrowRight, Star, Clock, ShieldCheck, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";

interface HeroSectionProps {
  onOpenForm?: () => void;
}

export function HeroSection({ onOpenForm }: HeroSectionProps) {
  return (
    <section id="domov" className="relative min-h-[80vh] flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 gradient-hero opacity-[0.03]" />

      <div className="section-container relative z-10 py-12 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left */}
          <div className="space-y-6 animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 text-sm font-medium text-success">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              AI editor fotiek
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight text-foreground">
              Realitné fotografie
              <br />
              <span className="text-primary">s dokonalou oblohou</span>
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg max-w-xl leading-relaxed">
              Prestaňte strácať hodiny manuálnou úpravou. Získajte konzistentné, profesionálne výsledky okamžite a ušetrite až <span className="font-semibold text-foreground">90% nákladov</span>.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={onOpenForm} className="group font-bold shadow-glow hover:shadow-lg transition-all">
                Vyskúšať ZADARMO
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => {
                document.querySelector("#funkcie")?.scrollIntoView({ behavior: "smooth" });
              }}>
                Pozrieť funkcie
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">*Bez nutnosti kreditnej karty</p>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                <span>Hotovo do 30s</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-success" />
                <span>GDPR Súlad</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingDown className="h-4 w-4 text-warning" />
                <span>10x Lacnejšie</span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full bg-muted border-2 border-background" />
                ))}
              </div>
              <div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-warning text-warning" />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">Spoľahlivá kvalita pre profesionálne výsledky</span>
              </div>
            </div>
          </div>

          {/* Right - Before/After */}
          <div className="animate-fade-in">
            <BeforeAfterSlider
              beforeSrc="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"
              afterSrc="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
              className="aspect-[4/3] shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
