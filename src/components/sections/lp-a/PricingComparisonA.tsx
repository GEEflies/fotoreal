import { Check, X } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { FEATURE_IMAGES } from "@/lib/images";

const comparisonRows = [
  { pro: "30 sekúnd", con: "24–48 hodín" },
  { pro: "24/7 dostupné", con: "Podľa rozvrhu" },
  { pro: "9 AI úprav", con: "Len základné" },
  { pro: "Konzistentná kvalita", con: "Rôzna kvalita" },
  { pro: "GDPR ochrana", con: "Žiadna ochrana" },
  { pro: "50+ fotiek naraz", con: "Max 10–20" },
];

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

        {/* Mobile comparison table */}
        <div className="sm:hidden max-w-md mx-auto">
          <div className="rounded-xl border border-border overflow-hidden bg-card">
            {/* Header */}
            <div className="grid grid-cols-2">
              <div className="p-3 bg-primary/10 border-r border-border relative">
                <span className="absolute -top-0 left-3 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-b-md">
                  ODPORÚČANÉ
                </span>
                <p className="font-heading font-bold text-foreground text-sm mt-4">FotoReal AI</p>
                <p className="font-heading text-xl font-extrabold text-primary">0,70 €<span className="text-muted-foreground text-xs font-normal"> /fotka</span></p>
              </div>
              <div className="p-3">
                <p className="font-heading font-bold text-foreground text-sm mt-4">Fotograf</p>
                <p className="font-heading text-xl font-extrabold text-destructive">8–15 €<span className="text-muted-foreground text-xs font-normal"> /fotka</span></p>
              </div>
            </div>
            {/* Rows */}
            {comparisonRows.map((row, i) => (
              <div key={i} className="grid grid-cols-2 border-t border-border">
                <div className="p-2.5 bg-primary/5 border-r border-border flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-success shrink-0" />
                  <span className="text-xs text-foreground">{row.pro}</span>
                </div>
                <div className="p-2.5 flex items-center gap-1.5">
                  <X className="h-3.5 w-3.5 text-destructive shrink-0" />
                  <span className="text-xs text-muted-foreground">{row.con}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop cards */}
        <div className="hidden sm:grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
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
              beforeSrc={FEATURE_IMAGES.whiteBalance.before}
              afterSrc={FEATURE_IMAGES.whiteBalance.after}
              className="aspect-[16/10] rounded-lg mb-5"
            />
            <ul className="space-y-2.5">
              {comparisonRows.map((row, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="h-4 w-4 text-success shrink-0" />
                  {row.pro}
                </li>
              ))}
            </ul>
          </div>

          {/* Photographer */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-heading font-bold text-foreground text-xl mb-1">Profesionálny fotograf</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="font-heading text-3xl font-extrabold text-destructive">8–15 €</span>
              <span className="text-muted-foreground text-sm">/ fotka</span>
            </div>
            <div className="aspect-[16/10] rounded-lg mb-5 bg-muted flex items-center justify-center text-center px-4">
              <p className="text-muted-foreground text-sm">150–300 € za 20 fotiek</p>
            </div>
            <ul className="space-y-2.5">
              {comparisonRows.map((row, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <X className="h-4 w-4 text-destructive shrink-0" />
                  {row.con}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Savings calculator */}
        <div className="mt-10 text-center p-6 rounded-xl bg-primary/5 border border-primary/20 max-w-2xl mx-auto">
          <p className="text-sm text-muted-foreground mb-1">Pri 10 nehnuteľnostiach × 20 fotiek mesačne</p>
          <p className="font-heading text-lg sm:text-xl font-bold text-foreground">
            Fotograf: <span className="text-destructive">1 500–3 000 €</span> → FotoReal: <span className="text-primary">140 €</span>
          </p>
          <p className="text-primary font-bold text-sm mt-1">Ušetríte až 2 860 € mesačne</p>
        </div>
      </div>
    </section>
  );
}