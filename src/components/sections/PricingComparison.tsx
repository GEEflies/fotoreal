import { Check, X } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";

const IMG = (path: string) =>
  `https://realfoto-adames.vercel.app/_next/image?url=%2Flanding%2F${encodeURIComponent(path)}&w=1200&q=85`;

const fotoRealPros = [
  "Hotovo do 30 sekúnd",
  "Konzistentné výsledky vždy",
  "HDR, obloha, perspektíva, farby",
  "24/7 dostupnosť bez čakania",
  "Neobmedzený objem fotiek",
];

const photographerCons = [
  "Dodanie 24–48 hodín",
  "Nekonzistentná kvalita",
  "Limitované typy úprav",
  "Obmedzené kapacity",
  "Drahé pri veľkom objeme",
];

export function PricingComparison() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      id="ceny"
      className="section-padding bg-accent/30"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div
        className={`section-container transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            Porovnanie
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Rýchlejšie a <span className="text-primary">lacnejšie</span> ako manuálna úprava
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Získajte vysokokvalitné vylepšenia za zlomok času a nákladov.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* FotoReal Card */}
          <div className="rounded-2xl border-2 border-primary bg-card overflow-hidden relative">
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full z-10">
              Odporúčame
            </div>
            <BeforeAfterSlider
              beforeSrc={IMG("aurix edit/original-edit.jpg")}
              afterSrc={IMG("aurix edit/aurix-edit.jpg")}
              className="aspect-[16/10]"
              beforeLabel="Originál"
              afterLabel="FotoReal"
            />
            <div className="p-6">
              <h3 className="font-heading text-lg font-bold text-foreground mb-1">
                FotoReal
              </h3>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-3xl sm:text-4xl font-extrabold text-primary">
                  0,70€
                </span>
                <span className="text-muted-foreground text-sm">/ fotka</span>
              </div>
              <ul className="space-y-2.5">
                {fotoRealPros.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-sm text-foreground"
                  >
                    <Check className="h-4 w-4 text-success flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Photographer Card */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <BeforeAfterSlider
              beforeSrc={IMG("human edit/original-edit.jpg")}
              afterSrc={IMG("human edit/human-edit.jpg")}
              className="aspect-[16/10]"
              beforeLabel="Originál"
              afterLabel="Fotograf"
            />
            <div className="p-6">
              <h3 className="font-heading text-lg font-bold text-foreground mb-1">
                Fotograf
              </h3>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-3xl sm:text-4xl font-extrabold text-muted-foreground">
                  5€
                </span>
                <span className="text-muted-foreground text-sm">/ fotka</span>
              </div>
              <ul className="space-y-2.5">
                {photographerCons.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground"
                  >
                    <X className="h-4 w-4 text-destructive flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
