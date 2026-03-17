import { Upload, Wand2, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Nahrajte fotky",
    description: "Pretiahnite fotky alebo vyberte z priečinka. Podporujeme JPG, PNG aj RAW formáty.",
  },
  {
    icon: Wand2,
    number: "02",
    title: "AI spracuje úpravy",
    description: "Naše AI automaticky aplikuje HDR, opravu perspektívy, výmenu oblohy a ďalšie vylepšenia.",
  },
  {
    icon: Download,
    number: "03",
    title: "Stiahnite výsledok",
    description: "Za menej ako 30 sekúnd máte hotové profesionálne fotografie pripravené na inzerciu.",
  },
];

export function HowItWorksSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      id="ako-to-funguje"
      className="section-padding"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div
        className={`section-container transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            Ako to funguje
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Tri jednoduché kroky k profesionálnym fotkám
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="relative text-center">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px border-t-2 border-dashed border-primary/20" />
              )}
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-5 mx-auto">
                <step.icon className="h-7 w-7 text-primary" />
              </div>
              <span className="text-xs font-bold text-primary tracking-widest">
                {step.number}
              </span>
              <h3 className="font-heading font-bold text-foreground text-lg mt-1 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
