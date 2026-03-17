import { DollarSign, Clock, CalendarX } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const painPoints = [
  {
    icon: DollarSign,
    title: "Platíte 100–300 € mesačne za editáciu",
    description:
      "Pri 20 fotkách na nehnuteľnosť a cene 3–5 € za fotku vám fotografovia účtujú stovky eur mesačne. To sú peniaze, ktoré môžu ísť do marketingu.",
  },
  {
    icon: Clock,
    title: "Čakáte 24–48 hodín na hotové fotky",
    description:
      "Fotograf odfotí, potom edituje doma. Vy čakáte a inzerát stojí. Každý deň oneskorenia je stratená príležitosť na predaj.",
  },
  {
    icon: CalendarX,
    title: "Závislosť na cudzom rozvrhu",
    description:
      "Fotograf je chorý? Na dovolenke? Nestíha? Vy nemôžete čakať — klient chce inzerát hneď. S AI ste nezávislí.",
  },
];

export function ProblemSectionA() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="section-padding">
      <div className={`section-container transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Poznáte to?</p>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Fotograf vás stojí viac, než si myslíte
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Nie je to len cena za fotky. Je to čakanie, závislosť a stratené príležitosti.
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
