/**
 * LP:B — For agents who DON'T use photographers
 * Core message: Phone photos → professional quality → more interest → higher sale price.
 */
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSectionB } from "@/components/sections/lp-b/HeroSectionB";
import { SocialProofStripB } from "@/components/sections/lp-b/SocialProofStripB";
import { ProblemSectionB } from "@/components/sections/lp-b/ProblemSectionB";
import { FeaturesGrid } from "@/components/sections/FeaturesGrid";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { PricingPackagesA } from "@/components/sections/lp-a/PricingPackagesA";
import { ResultsSectionB } from "@/components/sections/lp-b/ResultsSectionB";
import { TestimonialsSectionB } from "@/components/sections/lp-b/TestimonialsSectionB";
import { FaqSectionB } from "@/components/sections/lp-b/FaqSectionB";
import { CTASectionB } from "@/components/sections/lp-b/CTASectionB";
import { SEO } from "@/components/SEO";

const LandingB = () => (
  <div className="min-h-screen bg-background overflow-x-hidden">
    <SEO
      title="Profesionálne fotky z mobilu"
      description="Fotky z telefónu premeníme na profesionálnu kvalitu. Viac záujmu, vyššia predajná cena. Vyskúšajte AI editor realitných fotiek."
      path="/bez-fotografa"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "Stačí na to fotka z mobilu?", acceptedAnswer: { "@type": "Answer", text: "Áno! RealFoto je optimalizovaný práve pre fotky z mobilov. Podporujeme iPhone aj Android. Stačí dobre osvetlená miestnosť a naše AI spraví zvyšok." } },
          { "@type": "Question", name: "Naozaj to vyzerá ako od profesionálneho fotografa?", acceptedAnswer: { "@type": "Answer", text: "Naše AI bolo trénované na tisíckach profesionálne upravených realitných fotiek. Výsledky sú konzistentne na úrovni skúsených fotografov — HDR, korekcia perspektívy, vyváženie farieb, všetko automaticky." } },
          { "@type": "Question", name: "Koľko stojí jedna fotka?", acceptedAnswer: { "@type": "Answer", text: "0,70 € za fotku. Pri 20 fotkách na nehnuteľnosť je to len 14 €. Prvých 5 fotiek je úplne zadarmo." } },
          { "@type": "Question", name: "Ako rýchlo dostanem výsledok?", acceptedAnswer: { "@type": "Answer", text: "Priemerne za 15–30 sekúnd. Nahráte fotku, AI ju spracuje a stiahnete hotový výsledok. Žiadne čakanie." } },
          { "@type": "Question", name: "Naozaj to pomôže predať rýchlejšie?", acceptedAnswer: { "@type": "Answer", text: "Dáta ukazujú, že inzeráty s profesionálnymi fotkami dostávajú o 118% viac zobrazení. Viac zobrazení = viac záujemcov = rýchlejší predaj za lepšiu cenu." } },
          { "@type": "Question", name: "Aké formáty podporujete?", acceptedAnswer: { "@type": "Answer", text: "JPG, PNG, WebP a RAW (CR2, NEF, ARW). Maximálna veľkosť 50 MB. Dávkové spracovanie až 50 fotiek naraz." } },
        ],
      }}
    />
    <Header />
    <main>
      <HeroSectionB />
      <SocialProofStripB />
      <ProblemSectionB />
      <FeaturesGrid />
      <HowItWorksSection />
      <PricingPackagesA />
      <ResultsSectionB />
      <TestimonialsSectionB />
      <FaqSectionB />
      <CTASectionB />
    </main>
    <Footer />
  </div>
);

export default LandingB;
