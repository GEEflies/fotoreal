import { Check, X } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export function PricingComparison() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      id="ceny"
      className="section-padding"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div className={`section-container transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-5xl font-bold text-foreground mb-3">
            Rýchlejšie a <span className="text-primary">lacnejšie</span> ako manuálna úprava
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto">
            Získajte vysokokvalitné vylepšenia za zlomok času a nákladov.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* FotoReal */}
          <div className="rounded-2xl border-2 border-primary p-6 sm:p-8 bg-card relative">
            <div className="absolute -top-3 left-6 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
              Odporúčame
            </div>
            <h3 className="font-heading text-xl font-bold text-foreground mb-1">FotoReal</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl sm:text-4xl font-extrabold text-primary">0,70€</span>
              <span className="text-muted-foreground text-sm">/ fotka</span>
            </div>
            <ul className="space-y-3">
              {["Hotovo do 30 sekúnd", "Konzistentné výsledky", "HDR, obloha, perspektíva", "24/7 dostupnosť", "Neobmedzený objem"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="h-4 w-4 text-success flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Photographer */}
          <div className="rounded-2xl border border-border p-6 sm:p-8 bg-card">
            <h3 className="font-heading text-xl font-bold text-foreground mb-1">Fotograf</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl sm:text-4xl font-extrabold text-muted-foreground">5€</span>
              <span className="text-muted-foreground text-sm">/ fotka</span>
            </div>
            <ul className="space-y-3">
              {[
                { text: "Dodanie 24–48 hodín", ok: false },
                { text: "Nekonzistentná kvalita", ok: false },
                { text: "Limitované úpravy", ok: false },
                { text: "Obmedzené kapacity", ok: false },
                { text: "Drahé pri veľkom objeme", ok: false },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <X className="h-4 w-4 text-destructive flex-shrink-0" />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
