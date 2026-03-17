import { ArrowRight, Star, Clock, ShieldCheck, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { HERO_BEFORE, HERO_AFTER } from "@/lib/images";

interface HeroSectionProps {
  onOpenForm?: () => void;
}

export function HeroSection({ onOpenForm }: HeroSectionProps) {
  return (
    <section id="domov" className="relative min-h-[85vh] flex items-center pt-20 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/40 via-background to-background" />

      <div className="section-container relative z-10 py-10 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          {/* Left — Copy */}
          <div className="space-y-5 sm:space-y-6 animate-slide-up">
            {/* Category badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-success/10 border border-success/20 text-sm font-medium text-success">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              AI editor fotiek
            </div>

            {/* H1 — benefit-driven headline */}
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-[3.25rem] xl:text-[3.75rem] font-extrabold leading-[1.1] text-foreground tracking-tight">
              Realitné fotografie
              <br />
              <span className="text-primary">s dokonalou oblohou</span>
            </h1>

            {/* Sub-headline — addresses pain + promise */}
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl leading-relaxed">
              Prestaňte strácať hodiny manuálnou úpravou. Získajte konzistentné,
              profesionálne výsledky okamžite a ušetrite až{" "}
              <span className="font-bold text-foreground">90% nákladov</span>.
            </p>

            {/* Dual CTA */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Button
                size="lg"
                onClick={onOpenForm}
                className="group font-bold shadow-glow hover:shadow-lg transition-all text-base px-7"
              >
                Vyskúšať ZADARMO
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() =>
                  document
                    .querySelector("#funkcie")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="font-semibold"
              >
                Pozrieť funkcie
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              *Bez nutnosti kreditnej karty
            </p>

            {/* Trust micro-badges */}
            <div className="flex flex-wrap gap-5 text-xs sm:text-sm text-muted-foreground pt-1">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                Hotovo do 30s
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-success" />
                GDPR Súlad
              </span>
              <span className="flex items-center gap-1.5">
                <TrendingDown className="h-4 w-4 text-warning" />
                10x Lacnejšie
              </span>
            </div>

            {/* Social proof micro-strip */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex -space-x-2.5">
                {[
                  "https://realfoto-adames.vercel.app/_next/image?url=%2Ftestimonials%2FGemini_Generated_Image_339lzr339lzr339l.png&w=96&q=80",
                  "https://realfoto-adames.vercel.app/_next/image?url=%2Ftestimonials%2FGemini_Generated_Image_job9rjob9rjob9rj.png&w=96&q=80",
                  "https://realfoto-adames.vercel.app/_next/image?url=%2Ftestimonials%2FGemini_Generated_Image_l0v0vll0v0vll0v0.png&w=96&q=80",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Používateľ"
                    className="h-9 w-9 rounded-full border-2 border-background object-cover"
                  />
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="h-3.5 w-3.5 fill-warning text-warning"
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground leading-tight">
                  Spoľahlivá kvalita pre profesionálne výsledky
                </span>
              </div>
            </div>
          </div>

          {/* Right — Before / After visual proof */}
          <div className="animate-fade-in">
            <BeforeAfterSlider
              beforeSrc={HERO_BEFORE}
              afterSrc={HERO_AFTER}
              className="aspect-[4/3] shadow-2xl rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
