import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Button } from "@/components/ui/button";

const PACKAGES = [
  { photos: 20, price: 14, ppp: 0.70, properties: 1, discount: 0 },
  { photos: 40, price: 26, ppp: 0.65, properties: 2, discount: 7 },
  { photos: 80, price: 48, ppp: 0.59, properties: 4, discount: 16 },
  { photos: 160, price: 87, ppp: 0.54, properties: 8, discount: 23 },
  { photos: 320, price: 165, ppp: 0.51, properties: 16, discount: 27 },
] as const;

export function PricingPackagesA() {
  const [selected, setSelected] = useState(2);
  const [open, setOpen] = useState(false);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const pkg = PACKAGES[selected];
  const photographerLow = pkg.properties * 100;
  const photographerHigh = pkg.properties * 300;
  const photographerMid = (photographerLow + photographerHigh) / 2;
  const savingsPercent = Math.round(((photographerMid - pkg.price) / photographerMid) * 100);

  return (
    <section
      id="balicky"
      ref={ref as React.RefObject<HTMLElement>}
      className="section-padding bg-background"
    >
      <div
        className={`section-container transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            Cenník
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Vyberte si <span className="text-primary">balíček</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Čím viac fotiek, tým nižšia cena za kus. Kredity nevypršia.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="rounded-2xl border-2 border-primary/20 bg-card shadow-lg overflow-hidden">
            {/* Dropdown selector */}
            <div className="p-5 pb-0">
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                Vybrať balíček
              </p>
              <div className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:border-primary/40 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-heading text-2xl font-extrabold text-foreground">
                      {pkg.photos}
                    </span>
                    <span className="text-muted-foreground text-sm">fotiek</span>
                    {pkg.discount > 0 && (
                      <span className="text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
                        -{pkg.discount}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-xl font-bold text-foreground">
                      {pkg.price} €
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {open && (
                  <div className="absolute top-full left-0 right-0 z-30 mt-1 rounded-xl border border-border bg-card shadow-xl overflow-hidden">
                    {PACKAGES.map((p, i) => (
                      <button
                        key={p.photos}
                        onClick={() => {
                          setSelected(i);
                          setOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-accent/50 ${
                          i === selected ? "bg-primary/5" : ""
                        } ${i < PACKAGES.length - 1 ? "border-b border-border/50" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-heading text-lg font-bold text-foreground">
                            {p.photos}
                          </span>
                          <span className="text-muted-foreground text-sm">fotiek</span>
                          {p.discount > 0 && (
                            <span className="text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
                              -{p.discount}%
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            ~{p.properties} {p.properties === 1 ? "nehnuteľnosť" : p.properties < 5 ? "nehnuteľnosti" : "nehnuteľností"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">{p.price} €</span>
                          <span className="text-xs text-muted-foreground">({p.ppp.toFixed(2)} € / ks)</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Price hero + savings + CTA */}
            <div className="p-5 space-y-4">
              {/* Price hero */}
              <div className="text-center py-2">
                <span className="font-heading text-5xl font-extrabold text-foreground">
                  {pkg.price} €
                </span>
                <p className="text-sm text-muted-foreground mt-1">
                  {pkg.ppp.toFixed(2)} € za fotku · {pkg.photos} kreditov
                </p>
              </div>

              {/* Savings strip */}
              <div className="rounded-xl bg-success/5 border border-success/20 px-4 py-3 flex items-center justify-between gap-3">
                <div className="text-sm">
                  <span className="text-muted-foreground">
                    ~{pkg.properties} {pkg.properties === 1 ? "nehnuteľnosť" : pkg.properties < 5 ? "nehnuteľnosti" : "nehnuteľností"} · Fotograf:
                  </span>{" "}
                  <span className="text-destructive font-semibold line-through">
                    {photographerLow}–{photographerHigh} €
                  </span>
                </div>
                <span className="text-sm font-bold text-success whitespace-nowrap">
                  Ušetríte {savingsPercent}%
                </span>
              </div>

              {/* Green CTA */}
              <Button
                size="lg"
                className="w-full font-bold text-base bg-success hover:bg-success/90 text-success-foreground shadow-[0_4px_20px_-4px_hsl(var(--success)/0.4)] group"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Kúpiť za {pkg.price} €
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Kredity nevypršia · Bezpečná platba
              </p>
            </div>
          </div>

          {/* Quick-select chips */}
          <div className="mt-6 flex items-center justify-center gap-4 flex-wrap text-xs text-muted-foreground">
            {PACKAGES.map((p, i) => (
              <button
                key={p.photos}
                onClick={() => setSelected(i)}
                className={`px-3 py-1.5 rounded-full border transition-all ${
                  i === selected
                    ? "border-primary bg-primary/10 text-primary font-semibold"
                    : "border-border hover:border-primary/30"
                }`}
              >
                {p.photos} ks = {p.ppp.toFixed(2)} €
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}