import { useState } from 'react';
import { UserLayout } from '@/components/dashboard/UserLayout';
import { useCredits } from '@/hooks/use-credits';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, ChevronDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

const PACKAGES = [
  { photos: 20, price: 14, ppp: 0.70, properties: 1, discount: 0 },
  { photos: 40, price: 26, ppp: 0.65, properties: 2, discount: 7 },
  { photos: 80, price: 48, ppp: 0.59, properties: 4, discount: 16 },
  { photos: 160, price: 87, ppp: 0.54, properties: 8, discount: 23 },
  { photos: 320, price: 165, ppp: 0.51, properties: 16, discount: 27 },
] as const;

function propLabel(n: number) {
  return n === 1 ? "nehnuteľnosť" : n < 5 ? "nehnuteľnosti" : "nehnuteľností";
}

export default function DashboardCredits() {
  const { credits, isLoading } = useCredits();
  const [selected, setSelected] = useState(2);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const pkg = PACKAGES[selected];
  const photographerLow = pkg.properties * 100;
  const photographerHigh = pkg.properties * 300;

  const handleCheckout = async () => {
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
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <div className="max-w-lg mx-auto space-y-4 sm:space-y-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-foreground">Kredity</h1>
          <p className="text-sm text-muted-foreground">1 kredit = 1 AI-spracovaná fotka</p>
        </div>

        {/* Current balance */}
        {isLoading ? (
          <Skeleton className="h-20 rounded-lg" />
        ) : credits && (
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/20">
            <CardContent className="p-3 sm:p-6 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Váš zostatok</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-4xl font-heading font-bold text-foreground">{credits.available}</span>
                  <span className="text-sm text-muted-foreground">fotiek</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {credits.free_credits - Math.min(credits.total_used, credits.free_credits)} voľných + {credits.purchased_credits - Math.max(0, credits.total_used - credits.free_credits)} zakúpených
                </p>
              </div>
              <div className="p-2.5 sm:p-4 rounded-full bg-primary/10 shrink-0">
                <Sparkles className="h-5 w-5 sm:h-8 sm:w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* LP-style pricing widget */}
        <div>
          <h2 className="text-base sm:text-lg font-heading font-bold text-foreground mb-3 sm:mb-4">Dokúpiť kredity</h2>

          <div className="rounded-xl sm:rounded-2xl border-2 border-primary/20 bg-card shadow-lg overflow-visible">
            {/* Dropdown selector */}
            <div className="px-3 sm:px-5 pt-3 sm:pt-5 pb-0">
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-1.5 sm:mb-2 uppercase tracking-wide">
                Vybrať balíček
              </p>
              <div className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="w-full p-2.5 sm:p-4 rounded-lg sm:rounded-xl border border-border bg-background hover:border-primary/40 transition-colors text-left"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-heading text-xl sm:text-2xl font-extrabold text-foreground shrink-0">
                        {pkg.photos}
                      </span>
                      <span className="text-muted-foreground text-xs sm:text-sm shrink-0">fotiek</span>
                      {pkg.discount > 0 && (
                        <span className="text-[10px] sm:text-xs font-bold text-success bg-success/10 px-1 sm:px-1.5 py-0.5 rounded-full shrink-0">
                          -{pkg.discount}%
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="font-heading text-lg sm:text-xl font-bold text-foreground">
                        {pkg.price} €
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-muted-foreground text-[11px] sm:text-xs">
                      ~{pkg.properties} {propLabel(pkg.properties)}
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold text-primary">({pkg.ppp.toFixed(2)} € / ks)</span>
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
                        className={`w-full px-3 py-2.5 text-left transition-colors hover:bg-accent/50 ${
                          i === selected ? "bg-primary/5" : ""
                        } ${i < PACKAGES.length - 1 ? "border-b border-border/50" : ""}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="font-heading text-base sm:text-lg font-bold text-foreground shrink-0">
                              {p.photos}
                            </span>
                            <span className="text-muted-foreground text-xs sm:text-sm shrink-0">fotiek</span>
                            {p.discount > 0 && (
                              <span className="text-[10px] sm:text-xs font-bold text-success bg-success/10 px-1 sm:px-1.5 py-0.5 rounded-full shrink-0">
                                -{p.discount}%
                              </span>
                            )}
                          </div>
                          <span className="font-bold text-sm sm:text-base text-foreground shrink-0">{p.price} €</span>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="text-muted-foreground text-[11px] sm:text-xs">
                            ~{p.properties} {propLabel(p.properties)}
                          </span>
                          <span className="text-[11px] sm:text-xs font-semibold text-primary">({p.ppp.toFixed(2)} € / ks)</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Savings + CTA */}
            <div className="p-3 sm:p-5 space-y-2.5 sm:space-y-4">
              <div className="rounded-lg bg-success/5 border border-success/20 px-2.5 py-2 sm:px-4 sm:py-3 text-center">
                <span className="text-[11px] sm:text-sm text-muted-foreground">
                  Fotograf ~{pkg.properties} {propLabel(pkg.properties)}:{" "}
                </span>
                <span className="text-[11px] sm:text-sm text-destructive font-semibold line-through">
                  {photographerLow}–{photographerHigh} €
                </span>
              </div>

              <Button
                size="lg"
                onClick={handleCheckout}
                disabled={loading}
                className="w-full font-bold text-xs sm:text-base h-10 sm:h-11 bg-success hover:bg-success/90 text-success-foreground shadow-[0_4px_20px_-4px_hsl(var(--success)/0.4)]"
              >
                {loading ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-1.5 h-4 w-4" />
                )}
                {loading
                  ? "Presmerovanie..."
                  : `Kúpiť fotky pre ${pkg.properties} ${propLabel(pkg.properties)} za ${pkg.price} €`}
              </Button>

              <p className="text-[9px] sm:text-xs text-muted-foreground text-center">
                Kredity nevypršia · Bezpečná platba cez Stripe · Faktúra emailom
              </p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
