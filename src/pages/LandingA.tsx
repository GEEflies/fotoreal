/**
 * LP:A — For agents who USE photographers
 * Core message: Same professional quality at 90% less cost. Replace your photographer bill.
 */
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSectionA } from "@/components/sections/lp-a/HeroSectionA";
import { SocialProofStrip } from "@/components/sections/SocialProofStrip";
import { ProblemSectionA } from "@/components/sections/lp-a/ProblemSectionA";
import { FeaturesGrid } from "@/components/sections/FeaturesGrid";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { PricingComparisonA } from "@/components/sections/lp-a/PricingComparisonA";
import { PricingPackagesA } from "@/components/sections/lp-a/PricingPackagesA";
import { TestimonialsSectionA } from "@/components/sections/lp-a/TestimonialsSectionA";
import { FaqSection } from "@/components/sections/FaqSection";
import { CTASectionA } from "@/components/sections/lp-a/CTASectionA";
import { SEO } from "@/components/SEO";

const LandingA = () => (
  <div className="min-h-screen bg-background overflow-x-hidden">
    <SEO
      title="AI úprava fotiek pre fotografov"
      description="Rovnaká profesionálna kvalita za 90% nižšiu cenu. Nahraďte náklady na fotografa pomocou AI editora realitných fotiek."
      path="/pre-fotografov"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "Aké formáty obrázkov podporujete?", acceptedAnswer: { "@type": "Answer", text: "Podporujeme JPG, PNG, WebP a RAW formáty (CR2, NEF, ARW). Maximálna veľkosť súboru je 50 MB." } },
          { "@type": "Question", name: "Ako dlho trvá spracovanie jednej fotky?", acceptedAnswer: { "@type": "Answer", text: "Priemerný čas spracovania je 15–30 sekúnd v závislosti od veľkosti súboru a typu úprav." } },
          { "@type": "Question", name: "Je kvalita porovnateľná s manuálnou úpravou?", acceptedAnswer: { "@type": "Answer", text: "Áno. Naše AI bolo trénované na tisíckach profesionálne upravených realitných fotiek. Výsledky sú konzistentne na úrovni skúsených editorov." } },
          { "@type": "Question", name: "Musím platiť za skúšobné obdobie?", acceptedAnswer: { "@type": "Answer", text: "Nie. Prvých 5 fotiek je úplne zadarmo, bez nutnosti zadávať kreditnú kartu." } },
          { "@type": "Question", name: "Ako funguje GDPR ochrana súkromia?", acceptedAnswer: { "@type": "Answer", text: "Funkcia Auto Súkromie automaticky detekuje a rozmazáva tváre, ŠPZ a ďalšie citlivé informácie. Fotky sa spracúvajú na serveroch v EÚ." } },
          { "@type": "Question", name: "Môžem spracovať viacero fotiek naraz?", acceptedAnswer: { "@type": "Answer", text: "Áno. Dávkové spracovanie umožňuje nahrať až 50 fotiek naraz. Všetky sa spracujú paralelne." } },
          { "@type": "Question", name: "Akú cenu zaplatím za fotku?", acceptedAnswer: { "@type": "Answer", text: "Základná cena je 0,70 € za fotku. Pri väčších objemoch ponúkame zľavy." } },
        ],
      }}
    />
    <Header />
    <main>
      <HeroSectionA />
      <SocialProofStrip />
      <ProblemSectionA />
      <FeaturesGrid />
      <HowItWorksSection />
      <PricingComparisonA />
      <PricingPackagesA />
      <TestimonialsSectionA />
      <FaqSection />
      <CTASectionA />
    </main>
    <Footer />
  </div>
);

export default LandingA;
