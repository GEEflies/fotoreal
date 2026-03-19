import { useState, useRef } from "react";
import { ChevronDown, Sparkles, Loader2 } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PACKAGES } from "@/lib/packages";

export function PricingPackagesA() {
  const [selected, setSelected] = useState(2);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const busyRef = useRef(false);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { toast } = useToast();

  const pkg = PACKAGES[selected];
  const photographerLow = pkg.properties * 100;
  const photographerHigh = pkg.properties * 300;
  const photographerMid = (photographerLow + photographerHigh) / 2;
  const savingsPercent = Math.round(((photographerMid - pkg.price) / photographerMid) * 100);

  const handleCheckout = async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { photos: pkg.photos, origin: window.location.origin },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (e: any) {
      console.error("Checkout error:", e);
      toast({
        variant: "destructive",
        title: "Chyba pri platbe",
        description: e?.status === 429 || e?.message?.includes("429")
          ? "Príliš veľa pokusov. Skúste to znova o minútu."
          : "Nepodarilo sa vytvoriť platbu. Skúste to znova.",
      });
      busyRef.current = false;
      setLoading(false);
    }
  };

  return (
    <section
      id="balicky"
      ref={ref as React.RefObject<HTMLElement>}
      className="section-padding bg-background relative z-10"
    >
      <div
        className={`section-container transition-[opacity,transform] duration-700 ${
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
          <div className="rounded-2xl border-2 border-primary/20 bg-card shadow-lg overflow-visible">
            {/* Dropdown selector */}
            <div className="px-3 sm:px-5 pt-3 sm:pt-5 pb-0">
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                Vybrať balíček
              </p>
              <div className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="w-full p-3 sm:p-4 rounded-xl border border-border bg-background hover:border-primary/40 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-heading text-2xl font-extrabold text-foreground">
                        {pkg.photos}
                      </span>
                      <span className="text-muted-foreground text-sm">fotiek</span>
                      {pkg.discount > 0 && (
                        <span className="text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
                          -{pkg.discount}%
                        </span>
                      )}
                      <span className="text-muted-foreground text-sm ml-1">
                        ~{pkg.properties} {pkg.properties === 1 ? "nehnuteľnosť" : pkg.properties < 5 ? "nehnuteľnosti" : "nehnuteľností"}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1">
                        <span className="font-heading text-xl font-bold text-foreground">
                          {pkg.price} €
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 text-muted-foreground transition-transform ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                      <span className="text-sm font-semibold text-primary whitespace-nowrap">({pkg.ppp.toFixed(2)} € / ks)</span>
                    </div>
                  </div>
                </button>

                {open && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-xl border border-border bg-card shadow-xl overflow-hidden">
                    {PACKAGES.map((p, i) => (
                      <button
                        key={p.photos}
                        onClick={() => {
                          setSelected(i);
                          setOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left transition-colors hover:bg-accent/50 ${
                          i === selected ? "bg-primary/5" : ""
                        } ${i < PACKAGES.length - 1 ? "border-b border-border/50" : ""}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-heading text-lg font-bold text-foreground">
                              {p.photos}
                            </span>
                            <span className="text-muted-foreground text-sm">fotiek</span>
                            {p.discount > 0 && (
                              <span className="text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
                                -{p.discount}%
                              </span>
                            )}
                            <span className="text-muted-foreground text-sm ml-1">
                              ~{p.properties} {p.properties === 1 ? "nehnuteľnosť" : p.properties < 5 ? "nehnuteľnosti" : "nehnuteľností"}
                            </span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-bold text-foreground">{p.price} €</span>
                            <p className="text-sm font-semibold text-primary whitespace-nowrap">({p.ppp.toFixed(2)} € / ks)</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Savings + CTA */}
            <div className="p-3 sm:p-5 space-y-3 sm:space-y-4">

              {/* Savings strip */}
              <div className="rounded-lg sm:rounded-xl bg-success/5 border border-success/20 px-3 py-3 sm:px-4 sm:py-3 text-center">
                <span className="text-xs sm:text-sm text-muted-foreground">Fotograf ~{pkg.properties} {pkg.properties === 1 ? "nehnuteľnosť" : pkg.properties < 5 ? "nehnuteľnosti" : "nehnuteľností"}: </span>
                <span className="text-xs sm:text-sm text-destructive font-semibold line-through">
                  {photographerLow}–{photographerHigh} €
                </span>
              </div>

              {/* Green CTA */}
              <Button
                size="lg"
                onClick={handleCheckout}
                disabled={loading}
                className="w-full font-bold text-sm sm:text-base bg-success hover:bg-success/90 text-success-foreground shadow-[0_4px_20px_-4px_hsl(var(--success)/0.4)] group"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                )}
                {loading ? "Presmerovanie..." : `Kúpiť fotky pre ${pkg.properties} ${pkg.properties === 1 ? "nehnuteľnosť" : pkg.properties < 5 ? "nehnuteľnosti" : "nehnuteľností"} za ${pkg.price} €`}
              </Button>

              <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
                Kredity nevypršia · Bezpečná platba
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}