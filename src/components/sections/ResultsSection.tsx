import { TrendingUp, Home, Building2, MapPin, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const examples = [
  {
    icon: Building2,
    location: "Bratislava Ružinov",
    type: "3-izbový byt ~68 m²",
    marketRange: "240 000 – 320 000 €",
    soldFor: "~310 000 €",
    highlight: "Horná hranica trhu",
  },
  {
    icon: Home,
    location: "Trnava",
    type: "Rodinný dom 4+kk, 500 m² pozemok",
    marketRange: "280 000 – 330 000 €",
    soldFor: "~315 000 €",
    highlight: "Predané za 3 týždne",
  },
  {
    icon: MapPin,
    location: "Košice",
    type: "2-izbový byt 50 m²",
    marketRange: "130 000 – 150 000 €",
    soldFor: "+20 000 €",
    highlight: "Za týždeň po úpravách",
  },
];

export function ResultsSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      id="predajte-drahsie"
      className="section-padding"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div
        className={`section-container transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-8 lg:mb-16">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            Predajte nehnuteľnosť <span className="text-primary">drahšie</span>
          </h2>
          <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed">
            Správna prezentácia a načasovanie môžu pridať tisíce eur k predajnej cene.
          </p>
        </div>

        {/* How it works explanation */}
        <div className="bg-accent/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-primary text-primary-foreground flex-shrink-0">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h3 className="font-heading text-base sm:text-xl font-semibold text-foreground mb-1 sm:mb-2">
                Prečo to funguje?
              </h3>
              <p className="text-xs sm:text-base text-muted-foreground leading-relaxed">
                Profesionálne fotografie, správny popis a homestaging môžu dramaticky zvýšiť finálnu cenu.
              </p>
            </div>
          </div>
        </div>

        {/* Results examples */}
        <div className="mb-6 sm:mb-8">
          <h3 className="font-heading text-lg sm:text-2xl font-bold text-foreground text-center mb-4 sm:mb-8">
            Typické výsledky na Slovensku
          </h3>
          <div className="grid md:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {examples.map((example, index) => (
              <Card
                key={index}
                className="bg-card border-border hover:border-primary/30 hover:shadow-card-hover transition-all"
              >
                <CardContent className="p-3 sm:p-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <example.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground text-sm sm:text-base truncate">{example.location}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{example.type}</p>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-border">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Bežné:</span>
                      <span className="font-medium text-foreground text-right">{example.marketRange}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-xs sm:text-sm">Predané:</span>
                      <span className="font-bold text-primary text-sm sm:text-lg">{example.soldFor}</span>
                    </div>
                    <div className="pt-1 sm:pt-2">
                      <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-success/10 text-success text-[10px] sm:text-sm font-medium">
                        {example.highlight}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 sm:p-6 max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-0.5 sm:gap-1 mb-2 sm:mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="h-4 w-4 sm:h-5 sm:w-5 fill-warning text-warning" />
            ))}
          </div>
          <p className="text-foreground italic text-center text-xs sm:text-base mb-2 sm:mb-3">
            "Vďaka návodu som predal o 18 000 € viac. Oplatilo sa pripraviť nehnuteľnosť."
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            — Martin K., Bratislava
          </p>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-[10px] sm:text-sm text-muted-foreground max-w-2xl mx-auto">
          * Príklady sú ilustratívne. Výsledky sa líšia podľa nehnuteľnosti a trhu.
        </p>
      </div>
    </section>
  );
}
