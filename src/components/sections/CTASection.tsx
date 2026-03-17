import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  onOpenForm?: () => void;
}

export function CTASection({ onOpenForm }: CTASectionProps) {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/40 to-background" />

      <div className="section-container relative z-10 text-center max-w-2xl mx-auto">
        <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
          Pripravení <span className="text-primary">začať</span>?
        </h2>
        <p className="text-muted-foreground text-sm sm:text-lg mb-8 max-w-lg mx-auto">
          Pridajte sa k tisíckam realitných profesionálov, ktorí šetria čas a
          peniaze s AI úpravou fotiek.
        </p>
        <Button
          size="lg"
          onClick={onOpenForm}
          className="group font-bold shadow-glow hover:shadow-lg transition-all text-base px-8"
        >
          Vyskúšať ZADARMO
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
        <p className="text-xs text-muted-foreground mt-4">
          5 fotiek zadarmo • Bez kreditnej karty • Hotovo za 30 sekúnd
        </p>
      </div>
    </section>
  );
}
