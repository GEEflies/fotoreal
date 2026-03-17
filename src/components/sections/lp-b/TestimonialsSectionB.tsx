import { Star, Quote } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import tomasAvatar from "@/assets/avatars/tomas-lukac.png";
import andreaAvatar from "@/assets/avatars/andrea-kmetova.png";
import marekAvatar from "@/assets/avatars/marek-balaz.png";

const testimonials = [
  {
    name: "Tomáš Lukáč",
    role: "Realitný maklér, Žilina",
    avatar: tomasAvatar,
    text: "Vždy som fotil na mobil a myslel som, že to stačí. Od kedy používam RealFoto, mám o 50% viac telefonátov. Klienti si všímajú kvalitné fotky.",
    stars: 5,
  },
  {
    name: "Andrea Kmeťová",
    role: "Maklérka, Košice",
    avatar: andreaAvatar,
    text: "Posledný byt som predala za 8 000 € nad pôvodnú cenu. Jediné, čo som zmenila, boli fotky — RealFoto im dal úplne iný level.",
    stars: 5,
  },
  {
    name: "Marek Baláž",
    role: "Nezávislý maklér, Banská Bystrica",
    avatar: marekAvatar,
    text: "Za 14 € mesačne mám fotky, ktoré vyzerajú ako od profesionála. Klienti sú nadšení a odporúčajú ma ďalej.",
    stars: 5,
  },
];

export function TestimonialsSectionB() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="section-padding">
      <div className={`section-container transition-[opacity,transform] duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Príbehy</p>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Makléri, ktorí <span className="text-primary">predávajú rýchlejšie</span>
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
