import { Star, Quote } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const testimonials = [
  {
    name: "Martin Kováč",
    role: "Realitný maklér, RE/MAX Bratislava",
    avatar: "https://realfoto-adames.vercel.app/_next/image?url=%2Ftestimonials%2FGemini_Generated_Image_339lzr339lzr339l.png&w=96&q=80",
    text: "Platil som fotografovi 150 € mesačne za editáciu. S FotoReal platím 30 €. Kvalita je rovnaká, niekedy aj lepšia. Za rok som ušetril vyše 1 400 €.",
    stars: 5,
  },
  {
    name: "Lucia Szabóová",
    role: "Maklérka, Century 21",
    avatar: "https://realfoto-adames.vercel.app/_next/image?url=%2Ftestimonials%2FGemini_Generated_Image_job9rjob9rjob9rj.png&w=96&q=80",
    text: "Najlepšie na tom je, že nemusím čakať. Odfotím ráno, do obeda mám hotový inzerát. Predtým som čakala 2 dni na fotografa.",
    stars: 5,
  },
  {
    name: "Peter Horváth",
    role: "Majiteľ realitnej kancelárie",
    avatar: "https://realfoto-adames.vercel.app/_next/image?url=%2Ftestimonials%2FGemini_Generated_Image_l0v0vll0v0vll0v0.png&w=96&q=80",
    text: "Máme 8 maklérov. S FotoReal sme znížili náklady na fotografie o 85%. Reinvestujeme peniaze do online reklamy a vidíme výsledky.",
    stars: 5,
  },
];

export function TestimonialsSectionA() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="section-padding">
      <div className={`section-container transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Recenzie</p>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Makléri, ktorí <span className="text-primary">prestali platiť</span> za fotografa
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6 flex flex-col">
              <Quote className="h-6 w-6 text-primary/30 mb-3" />
              <p className="text-sm text-foreground leading-relaxed flex-1 mb-5">"{t.text}"</p>
              <div className="flex mb-3">
                {Array.from({ length: t.stars }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-warning text-warning" />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
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
