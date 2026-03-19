import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PricingPackagesA } from "@/components/sections/lp-a/PricingPackagesA";
import { PricingComparisonA } from "@/components/sections/lp-a/PricingComparisonA";
import { SEO } from "@/components/SEO";

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Cenník"
        description="Transparentné ceny bez skrytých poplatkov. Kredity nevypršia. Od 14 € za 20 fotiek. Čím viac fotiek, tým lepšia cena."
        path="/cennik"
      />
      <Header />
      <main className="flex-1 pt-20 sm:pt-24">
        <div className="section-container py-12 sm:py-20 text-center max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Cenník</p>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Transparentné <span className="text-primary">ceny</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Žiadne skryté poplatky. Kredity nevypršia. Čím viac fotiek, tým lepšia cena.
          </p>
        </div>

        <PricingPackagesA />
        <PricingComparisonA />
      </main>
      <Footer />
    </div>
  );
}
