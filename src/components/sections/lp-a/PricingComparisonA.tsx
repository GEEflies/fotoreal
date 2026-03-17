import { Check, X } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";

const IMG = (path: string) =>
  `https://realfoto-adames.vercel.app/_next/image?url=%2Flanding%2F${encodeURIComponent(path)}&w=1200&q=85`;

export function PricingComparisonA() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="section-padding bg-accent/30">
      <div className={`section-container transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Porovnanie</p>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            FotoReal vs. Profesionálny fotograf
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Rovnaký výsledok. Zlomok ceny a času.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* FotoReal */}
          <div className="rounded-xl border-2 border-primary bg-card p-6 relative">
            <div className="absolute -top-3 left-6 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
              ODPORÚČANÉ
            </div>
            <h3 className="font-heading font-bold text-foreground text-xl mb-1">FotoReal AI</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="font-heading text-3xl font-extrabold text-primary">0,70 €</span>
              <span className="text-muted-foreground text-sm">/ fotka</span>
            </div>
            <BeforeAfterSlider
              beforeSrc={IMG("white balance/wb-before.jpg")}
              afterSrc={IMG("white balance/wb-after.jpeg")}
              className="aspect-[16/10] rounded-lg mb-5"
            />
            <ul className="space-y-2.5">
              {[
                "Hotové za 30 sekúnd",
                "Dostupné 24/7, bez čakania",
                "9 AI úprav v jednom",
                "Konzistentná kvalita vždy",
                "GDPR ochrana súkromia",
                "Dávkové spracovanie 50+ fotiek",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="h-4 w-4 text-success shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Photographer */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-heading font-bold text-foreground text-xl mb-1">Profesionálny fotograf</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="font-heading text-3xl font-extrabold text-destructive">3–5 €</span>
              <span className="text-muted-foreground text-sm">/ fotka</span>
            </div>
            <div className="aspect-[16/10] rounded-lg mb-5 bg-muted flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Rovnaký výsledok, vyššia cena</p>
            </div>
            <ul className="space-y-2.5">
              {[
                { text: "Čakanie 24–48 hodín", bad: true },
                { text: "Závislé na rozvrhu fotografa", bad: true },
                { text: "Len základné úpravy", bad: true },
                { text: "Rôzna kvalita podľa editora", bad: true },
                { text: "Žiadna automatická ochrana", bad: true },
                { text: "Max 10–20 fotiek naraz", bad: true },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <X className="h-4 w-4 text-destructive shrink-0" />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Savings calculator */}
        <div className="mt-10 text-center p-6 rounded-xl bg-primary/5 border border-primary/20 max-w-2xl mx-auto">
          <p className="text-sm text-muted-foreground mb-1">Pri 10 nehnuteľnostiach × 20 fotiek mesačne</p>
          <p className="font-heading text-lg sm:text-xl font-bold text-foreground">
            Fotograf: <span className="text-destructive">600–1 000 €</span> → FotoReal: <span className="text-primary">140 €</span>
          </p>
          <p className="text-primary font-bold text-sm mt-1">Ušetríte až 860 € mesačne</p>
        </div>
      </div>
    </section>
  );
}
