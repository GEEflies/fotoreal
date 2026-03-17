import { ImageOff, TrendingDown, Clock } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const painPoints = [
  {
    icon: ImageOff,
    title: "Nekvalitné fotky odrádzajú záujemcov",
    description:
      "Tmavé, šikmé fotky z mobilu vytvárajú dojem lacnej nehnuteľnosti. Kupujúci prejdú na ďalší inzerát za 3 sekundy.",
  },
  {
    icon: TrendingDown,
    title: "Menej zobrazení = nižšia predajná cena",
    description:
      "Inzeráty s neprofesionálnymi fotkami dostávajú o 60% menej kliknutí. Menej záujemcov znamená slabšiu vyjednávaciu pozíciu.",
  },
  {
    icon: Clock,
    title: "Nehnuteľnosť sa predáva dlhšie",
    description:
      "Priemerne o 3 týždne dlhšie. To sú 3 týždne navyše, kedy klient čaká a vy nedostávate províziu.",
  },
];

export function ProblemSectionB() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="section-padding">
      <div className={`section-container transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-destructive uppercase tracking-wider mb-2">Problém</p>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Fotky z mobilu vás stoja peniaze
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Aj keď šetríte na fotografovi, nekvalitné fotky vás stoja viac — na predajnej cene a čase.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 sm:gap-8">
          {painPoints.map((p, i) => (
            <div key={i} className="relative p-6 rounded-xl bg-destructive/[0.04] border border-destructive/10 hover:border-destructive/20 transition-colors">
              <div className="h-11 w-11 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                <p.icon className="h-5 w-5 text-destructive" />
              </div>
              <h3 className="font-heading font-semibold text-foreground text-base sm:text-lg mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
