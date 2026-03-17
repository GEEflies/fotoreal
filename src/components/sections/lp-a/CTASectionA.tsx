import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function CTASectionA() {
  const navigate = useNavigate();
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/40 to-background" />
      <div className="section-container relative z-10 text-center max-w-2xl mx-auto">
        <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
          Ušetrite <span className="text-primary">stovky eur</span> mesačne
        </h2>
        <p className="text-muted-foreground text-sm sm:text-lg mb-8 max-w-lg mx-auto">
          Získajte rovnakú kvalitu ako od profesionálneho fotografa — za zlomok ceny.
          Prvých 5 fotiek je zadarmo.
        </p>
        <Button size="lg" className="group font-bold shadow-glow hover:shadow-lg transition-all text-base px-8">
          Vyskúšať ZADARMO
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
        <p className="text-xs text-muted-foreground mt-4">
          5 fotiek zadarmo • Bez kreditnej karty • Výsledok za 30 sekúnd
        </p>
      </div>
    </section>
  );
}
