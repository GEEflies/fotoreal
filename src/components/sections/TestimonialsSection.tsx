import { Star, Quote } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const testimonials = [
  {
    name: "Martin Kováč",
    role: "Realitný maklér, Bratislava",
    avatar:
      "https://realfoto-adames.vercel.app/_next/image?url=%2Ftestimonials%2FGemini_Generated_Image_339lzr339lzr339l.png&w=96&q=80",
    text: "RealFoto mi ušetrí hodiny týždenne. Fotky vyzerajú profesionálne a klienti si všímajú rozdiel. Inzeráty dostávajú o 40% viac zobrazení.",
    stars: 5,
  },
  {
    name: "Jana Novotná",
    role: "Fotografka nehnuteľností",
    avatar:
      "https://realfoto-adames.vercel.app/_next/image?url=%2Ftestimonials%2FGemini_Generated_Image_job9rjob9rjob9rj.png&w=96&q=80",
    text: "Ako profesionálna fotografka som bola skeptická. Ale kvalita HDR a korekcie perspektívy je na úrovni mojej manuálnej práce — za zlomok času.",
    stars: 5,
  },
  {
    name: "Peter Horváth",
    role: "Majiteľ realitnej kancelárie",
    avatar:
      "https://realfoto-adames.vercel.app/_next/image?url=%2Ftestimonials%2FGemini_Generated_Image_l0v0vll0v0vll0v0.png&w=96&q=80",
    text: "Naša kancelária spracováva 200+ fotiek mesačne. RealFoto znížil naše náklady na editáciu o 85% a kvalita sa dokonca zlepšila.",
    stars: 5,
  },
];

export function TestimonialsSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="section-padding"
    >
      <div
        className={`section-container transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            Recenzie
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Čo hovoria naši <span className="text-primary">používatelia</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-6 flex flex-col"
            >
              <Quote className="h-6 w-6 text-primary/30 mb-3" />
              <p className="text-sm text-foreground leading-relaxed flex-1 mb-5">
                "{t.text}"
              </p>
              <div className="flex mb-3">
                {Array.from({ length: t.stars }).map((_, s) => (
                  <Star
                    key={s}
                    className="h-4 w-4 fill-warning text-warning"
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
