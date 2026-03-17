import { ArrowRight, Star, Clock, ShieldCheck, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { HERO_BEFORE, HERO_AFTER } from "@/lib/images";
import social1 from "@/assets/avatars/social-1.png";
import social2 from "@/assets/avatars/social-2.png";
import social3 from "@/assets/avatars/social-3.png";

export function HeroSectionA() {
  return (
    <section id="domov" className="relative min-h-[85vh] flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/40 via-background to-background" />
      <div className="section-container relative z-10 py-10 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div className="space-y-5 sm:space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-success/10 border border-success/20 text-sm font-medium text-success">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              Pre maklérov s fotografom
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-[3.25rem] xl:text-[3.75rem] font-extrabold leading-[1.15] lg:leading-[1.2] text-foreground tracking-tight">
              Rovnaká kvalita.
              <br />
              <span className="text-primary">Až 95% úspora.</span>
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg max-w-xl leading-relaxed">
              Prečo platiť fotografovi <span className="font-bold text-foreground">150–300 € za 20 fotiek</span>,
              keď AI dosiahne rovnaký výsledok za{" "}
              <span className="font-bold text-primary">14 €</span>?
              Ušetrite tisíce eur mesačne bez kompromisov na kvalite.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Button size="lg" className="w-full sm:w-auto group font-bold shadow-glow hover:shadow-lg transition-all text-base px-7">
                Vyskúšať 5 fotiek ZADARMO
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center sm:text-left">*Bez kreditnej karty • Hotové za 30 sekúnd</p>

            <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs sm:text-sm text-muted-foreground pt-1">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                Hotovo do 30s
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-success" />
                Kvalita ako od fotografa
              </span>
              <span className="flex items-center gap-1.5">
                <TrendingDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-warning" />
                Úspora 90–95%
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1 justify-center sm:justify-start">
              <div className="flex -space-x-2.5">
                {[social1, social2, social3].map((src, i) => (
                  <img key={i} src={src} alt="Používateľ" className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border-2 border-background object-cover" />
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex">
                  {[1,2,3,4,5].map(s => <Star key={s} className="h-3.5 w-3.5 fill-warning text-warning" />)}
                </div>
                <span className="text-xs text-muted-foreground leading-tight">
                  500+ maklérov už ušetrilo s RealFoto
                </span>
              </div>
            </div>
          </div>

          <div className="animate-fade-in">
            <BeforeAfterSlider beforeSrc={HERO_BEFORE} afterSrc={HERO_AFTER} className="aspect-[4/3] shadow-2xl rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
