import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  onOpenForm?: () => void;
}

export function CTASection({ onOpenForm }: CTASectionProps) {
  return (
    <section className="section-padding bg-primary/5">
      <div className="section-container text-center max-w-2xl mx-auto">
        <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
          Pripravení začať?
        </h2>
        <p className="text-muted-foreground text-sm sm:text-lg mb-8">
          Pridajte sa k tisíckam realitných profesionálov, ktorí šetria čas s AI.
        </p>
        <Button size="lg" onClick={onOpenForm} className="group font-bold shadow-glow hover:shadow-lg transition-all">
          Vyskúšať ZADARMO
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </section>
  );
}
