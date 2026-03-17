import { Check, X } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

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
            RealFoto vs. Profesionálny fotograf
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Rovnaký výsledok. Zlomok ceny a času.
          </p>
        </div>

        {/* Comparison table */}
        <div className="max-w-lg mx-auto">
          <div className="rounded-xl border border-border overflow-hidden bg-card">
            {/* Header */}
            <div className="grid grid-cols-2">
              <div className="p-3 sm:p-4 bg-primary/10 border-r border-border relative">
                <span className="absolute -top-0 left-3 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-b-md">
                  ODPORÚČANÉ
                </span>
                <p className="font-heading font-bold text-foreground text-sm sm:text-base mt-4">RealFoto AI</p>
                <p className="font-heading text-xl sm:text-2xl font-extrabold text-primary">0,70 €<span className="text-muted-foreground text-xs font-normal"> /fotka</span></p>
              </div>
              <div className="p-3 sm:p-4">
                <p className="font-heading font-bold text-foreground text-sm sm:text-base mt-4">Fotograf</p>
                <p className="font-heading text-xl sm:text-2xl font-extrabold text-destructive">8–15 €<span className="text-muted-foreground text-xs font-normal"> /fotka</span></p>
              </div>
            </div>
            {/* Rows */}
            {comparisonRows.map((row, i) => (
              <div key={i} className="grid grid-cols-2 border-t border-border">
                <div className="p-2.5 sm:p-3 bg-primary/5 border-r border-border flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-success shrink-0" />
                  <span className="text-xs sm:text-sm text-foreground">{row.pro}</span>
                </div>
                <div className="p-2.5 sm:p-3 flex items-center gap-1.5">
                  <X className="h-3.5 w-3.5 text-destructive shrink-0" />
                  <span className="text-xs sm:text-sm text-muted-foreground">{row.con}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Savings calculator */}
        <div className="mt-8 sm:mt-10 text-center px-4 py-3 sm:p-6 rounded-xl bg-success/5 border border-success/20 max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">Pri 10 nehnuteľnostiach × 20 fotiek mesačne</p>
          <p className="font-heading text-base sm:text-xl font-bold text-foreground">
            Fotograf: <span className="text-destructive">1 500–3 000 €</span> → RealFoto: <span className="text-success font-extrabold">140 €</span>
          </p>
          <p className="text-success font-bold text-xs sm:text-sm mt-0.5 sm:mt-1">Ušetríte až 2 860 € mesačne</p>
        </div>
      </div>
    </section>
  );
}