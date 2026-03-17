import { Check, MapPin, FileText, ClipboardList, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import benefitsVisual from "@/assets/benefits-visual.webp";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const benefits = [
  {
    title: "Profesionálny odhad hodnoty",
    description: "Presný cenový rozsah na základe aktuálnych trhových dát.",
  },
  {
    title: "PDF návod na predaj",
    description: "Krok za krokom ako pripraviť nehnuteľnosť a predať ju drahšie.",
  },
  {
    title: "Kontrolný zoznam predaja",
    description: "Kompletný checklist všetkého čo potrebujete pred predajom.",
  },
  {
    title: "Prehľad cien v okolí",
    description: "Za koľko sa predávajú podobné nehnuteľnosti vo vašej lokalite.",
  },
  {
    title: "Tipy na navýšenie ceny",
    description: "Konkrétne kroky ako zvýšiť hodnotu bez veľkých investícií.",
  },
];

interface BenefitsSectionProps {
  onOpenForm?: () => void;
}

export function BenefitsSection({ onOpenForm }: BenefitsSectionProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      id="co-dostanete"
      className="section-padding bg-accent/30"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div
        className={`section-container transition-[opacity,transform] duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left Column - Checklist */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
                Čo od nás <span className="text-primary">dostanete</span>
              </h2>
              <p className="text-sm sm:text-lg text-muted-foreground">
                Všetko čo potrebujete pre úspešný predaj, na jednom mieste.
              </p>
            </div>

            <div className="space-y-2 sm:space-y-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-primary text-primary-foreground flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm sm:text-base">
                      {benefit.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {onOpenForm && (
              <Button size="lg" onClick={onOpenForm} className="w-full sm:w-auto group font-bold shadow-glow hover:shadow-lg transition-all px-4 sm:px-6">
                <span className="sm:hidden">Získať ocenenie ZDARMA</span>
                <span className="hidden sm:inline">Získať ocenenie + PDF návod ZDARMA</span>
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>

          {/* Right Column - Visual Image */}
          <div className="relative hidden lg:flex justify-center items-center">
            <img
              src={benefitsVisual}
              alt="Odhad hodnoty, kontrolný zoznam a prehľad cien nehnuteľnosti"
              className="max-h-[520px] w-auto object-contain drop-shadow-xl"
            />
          </div>

          {/* Mobile fallback - simple cards */}
          <div className="grid grid-cols-3 gap-2 lg:hidden">
            <div className="bg-card border border-border rounded-lg p-2 sm:p-3 shadow-sm text-center">
              <ClipboardList className="h-4 w-4 text-primary mx-auto mb-1" />
              <span className="font-semibold text-foreground text-[10px] sm:text-xs block">Checklist</span>
            </div>
            <div className="bg-card border border-border rounded-lg p-2 sm:p-3 shadow-sm text-center">
              <FileText className="h-4 w-4 text-primary mx-auto mb-1" />
              <span className="font-semibold text-foreground text-[10px] sm:text-xs block">Odhad</span>
            </div>
            <div className="bg-card border border-border rounded-lg p-2 sm:p-3 shadow-sm text-center">
              <MapPin className="h-4 w-4 text-primary mx-auto mb-1" />
              <span className="font-semibold text-foreground text-[10px] sm:text-xs block">Ceny</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}