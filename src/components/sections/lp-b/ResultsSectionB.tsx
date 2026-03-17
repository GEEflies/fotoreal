import { TrendingUp, Users, DollarSign } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { FEATURE_IMAGES } from "@/lib/images";

const results = [
  {
    icon: TrendingUp,
    stat: "+118%",
    label: "zobrazení inzerátu",
    desc: "Profesionálne fotky priťahujú 2x viac pohľadov na portáloch ako Nehnuteľnosti.sk a Reality.sk.",
  },
  {
    icon: Users,
    stat: "+74%",
    label: "viac obhliadok",
    desc: "Viac zobrazení = viac telefonátov = viac obhliadok. Jednoduchá matematika predaja.",
  },
  {
    icon: DollarSign,
    stat: "+5–10%",
    label: "vyššia predajná cena",
    desc: "Nehnuteľnosti s kvalitnými fotkami sa predávajú bližšie k požadovanej cene. Menej zliav.",
  },
];

export function ResultsSectionB() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section id="vysledky" ref={ref as React.RefObject<HTMLElement>} className="section-padding bg-accent/30">
      <div className={`section-container transition-[opacity,transform] duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Výsledky</p>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Lepšie fotky = <span className="text-primary">vyššia cena</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Dáta ukazujú, že kvalitné fotky priamo ovplyvňujú rýchlosť predaja a finálnu cenu.
          </p>
        </div>

        {/* Before/After showcase */}
        <div className="max-w-3xl mx-auto mb-12">
          <BeforeAfterSlider
            beforeSrc={FEATURE_IMAGES.sky.before}
            afterSrc={FEATURE_IMAGES.sky.after}
            className="aspect-[16/9] rounded-2xl shadow-xl"
          />
          <p className="text-center text-sm text-muted-foreground mt-3">
            Rovnaká nehnuteľnosť. Vľavo: fotka z mobilu. Vpravo: po úprave RealFoto.
          </p>
        </div>

        {/* Results cards */}
        <div className="grid md:grid-cols-3 gap-3 sm:gap-8">
          {results.map((r, i) => (
            <div key={i} className="p-4 sm:p-6 rounded-xl bg-card border border-border sm:text-center">
              {/* Mobile: horizontal compact */}
              <div className="flex items-start gap-3 sm:hidden">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <r.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-1.5 mb-0.5">
                    <span className="font-heading text-xl font-extrabold text-primary">{r.stat}</span>
                    <span className="font-semibold text-foreground text-sm">{r.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
                </div>
              </div>
              {/* Desktop: centered vertical */}
              <div className="hidden sm:block">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <r.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="font-heading text-3xl font-extrabold text-primary mb-1">{r.stat}</p>
                <p className="font-semibold text-foreground text-sm mb-2">{r.label}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-10 text-center p-6 rounded-xl bg-primary/5 border border-primary/20 max-w-2xl mx-auto">
          <p className="font-heading text-lg sm:text-xl font-bold text-foreground">
            Investícia <span className="text-primary">0,70 € za fotku</span> sa vráti v tisícoch na predajnej cene
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            20 fotiek = 14 € → potenciálne tisíce eur navyše na predaji
          </p>
        </div>
      </div>
    </section>
  );
}
