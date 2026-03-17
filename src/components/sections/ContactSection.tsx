import { Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

interface ContactSectionProps {
  onOpenForm: () => void;
}

export function ContactSection({ onOpenForm }: ContactSectionProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      id="kontakt"
      className="py-12 sm:py-16 lg:py-20 bg-foreground text-background relative overflow-hidden"
      ref={ref as React.RefObject<HTMLElement>}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/50 rounded-full blur-3xl" />
      </div>
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      <div
        className={`section-container relative z-10 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Ste pripravení zistiť hodnotu{" "}
            <span className="text-primary">nehnuteľnosti</span>?
          </h2>
          <p className="text-sm sm:text-lg text-muted-foreground mb-6 sm:mb-8">
            Vyplňte krátky formulár a dostanete odhad hodnoty aj PDF návod.
          </p>

          <Button
            size="lg"
            onClick={onOpenForm}
            className="w-full sm:w-auto group font-bold shadow-glow hover:shadow-lg transition-all mb-8 sm:mb-12 px-4 sm:px-6"
          >
            <span className="sm:hidden">Získať ocenenie ZDARMA</span>
            <span className="hidden sm:inline">Získať ocenenie + PDF návod ZDARMA</span>
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          {/* Contact details */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-6 sm:pt-8 border-t border-muted/20">
            <a
              href="tel:+421911911288"
              className="flex items-center gap-3 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/10 group-hover:bg-primary/20 transition-colors">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground group-hover:text-background transition-colors">Telefón</p>
                <p className="font-semibold text-background text-sm">0911 911 288</p>
              </div>
            </a>

            <div className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/10 group-hover:bg-primary/20 transition-colors">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground group-hover:text-background transition-colors">Email</p>
                <p className="font-semibold text-background text-sm">info@nehnutelnostibratislava.sk</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/10">
                <Clock className="h-4 w-4" />
              </div>
              <div className="text-left">
                <p className="text-xs">Pracovná doba</p>
                <p className="font-semibold text-background text-sm">Po–Pi: 9–19</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
