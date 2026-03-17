import { ClipboardList, MessageSquare, CheckCircle, ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

interface HowItWorksSectionProps {
  onOpenForm: () => void;
}

const steps = [
  {
    icon: ClipboardList,
    number: "01",
    title: "Vyplníte krátky formulár",
    description: "Základné údaje o vašej nehnuteľnosti – typ, lokalita, výmera. Trvá to len 2 minúty.",
  },
  {
    icon: MessageSquare,
    number: "02",
    title: "Okamžite vám pošleme SMS",
    description: "Dostanete odhad hodnoty nehnuteľnosti a link na PDF návod priamo do telefónu.",
  },
  {
    icon: CheckCircle,
    number: "03",
    title: "Urobíte kroky, ktoré zvyšujú cenu",
    description: "Podľa kontrolného zoznamu pripravíte nehnuteľnosť tak, aby sa predala rýchlejšie a drahšie.",
  },
];

export function HowItWorksSection({ onOpenForm }: HowItWorksSectionProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      id="ako-to-funguje"
      className="section-padding bg-secondary/30"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div
        className={`section-container transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-16">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            Ako to <span className="text-primary">funguje</span>?
          </h2>
          <p className="text-sm sm:text-lg text-muted-foreground">
            Tri jednoduché kroky k vyššej predajnej cene
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-12 mb-8 sm:mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              {/* Connector line - hidden on mobile */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-border">
                  <ArrowRight className="absolute -right-3 -top-2.5 h-5 w-5 text-primary" />
                </div>
              )}

              {/* Step content */}
              <div className="relative z-10">
                <div className="relative inline-block mb-3 sm:mb-6 mx-auto">
                  <div className="flex items-center justify-center h-14 w-14 sm:h-20 sm:w-20 lg:h-24 lg:w-24 rounded-xl sm:rounded-2xl bg-primary/10 text-primary">
                    <step.icon className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
                  </div>
                  <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 flex h-5 w-5 sm:h-7 sm:w-7 lg:h-8 lg:w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] sm:text-xs lg:text-sm font-bold">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-heading text-xs sm:text-base lg:text-xl font-semibold text-foreground mb-1 sm:mb-3 leading-tight">
                  {step.title}
                </h3>
                <p className="text-[10px] sm:text-xs lg:text-base text-muted-foreground leading-snug sm:leading-relaxed hidden sm:block max-w-sm mx-auto">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center space-y-6">
          <Button
            size="lg"
            onClick={onOpenForm}
            className="w-full sm:w-auto group font-bold shadow-glow hover:shadow-lg transition-all px-4 sm:px-6"
          >
            <span className="sm:hidden">Získať ocenenie ZDARMA</span>
            <span className="hidden sm:inline">Získať ocenenie + PDF návod ZDARMA</span>
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          {/* Optional help */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 max-w-xl mx-auto">
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-success/10 text-success flex-shrink-0">
                <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground text-sm sm:text-base">
                  Chcete pomoc od odborníkov?
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Ozveme sa vám a pomôžeme s predajom.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
