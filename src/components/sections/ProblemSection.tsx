import { Clock, DollarSign, AlertTriangle } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const painPoints = [
  {
    icon: Clock,
    title: "Hodiny manuálnej práce",
    description:
      "Bežná úprava jednej sady fotiek trvá 30–60 minút. Pri 10 nehnuteľnostiach mesačne strácate celý pracovný deň.",
  },
  {
    icon: DollarSign,
    title: "Drahí externí fotografi",
    description:
      "Profesionálny fotograf si účtuje 150–300 € za fotoshoot (cca 20 fotiek). Pri viacerých nehnuteľnostiach sú to tisíce eur ročne.",
  },
  {
    icon: AlertTriangle,
    title: "Nekonzistentné výsledky",
    description:
      "Rôzni editori = rôzna kvalita. Vaša značka pôsobí neprofesionálne a nehnuteľnosti sa predávajú pomalšie.",
  },
];

export function ProblemSection() {
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
            Poznáte to?
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Úprava fotiek vám berie čas aj peniaze
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Väčšina realitných profesionálov rieši tie isté problémy.
            FotoReal ich odstraňuje jedným kliknutím.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 sm:gap-8">
          {painPoints.map((p, i) => (
            <div
              key={i}
              className="relative p-6 rounded-xl bg-destructive/[0.04] border border-destructive/10 hover:border-destructive/20 transition-colors"
            >
              <div className="h-11 w-11 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                <p.icon className="h-5 w-5 text-destructive" />
              </div>
              <h3 className="font-heading font-semibold text-foreground text-base sm:text-lg mb-2">
                {p.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
