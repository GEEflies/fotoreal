import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const faqs = [
  {
    q: "Aké formáty obrázkov podporujete?",
    a: "Podporujeme JPG, PNG, WebP a RAW formáty (CR2, NEF, ARW). Maximálna veľkosť súboru je 50 MB.",
  },
  {
    q: "Ako dlho trvá spracovanie jednej fotky?",
    a: "Priemerný čas spracovania je 15–30 sekúnd v závislosti od veľkosti súboru a typu úprav.",
  },
  {
    q: "Je kvalita porovnateľná s manuálnou úpravou?",
    a: "Áno. Naše AI bolo trénované na tisíckach profesionálne upravených realitných fotiek. Výsledky sú konzistentne na úrovni skúsených editorov.",
  },
  {
    q: "Musím platiť za skúšobné obdobie?",
    a: "Nie. Prvých 5 fotiek je úplne zadarmo, bez nutnosti zadávať kreditnú kartu.",
  },
  {
    q: "Ako funguje GDPR ochrana súkromia?",
    a: "Funkcia Auto Súkromie automaticky detekuje a rozmazáva tváre, ŠPZ a ďalšie citlivé informácie. Fotky sa spracúvajú na serveroch v EÚ.",
  },
  {
    q: "Môžem spracovať viacero fotiek naraz?",
    a: "Áno. Dávkové spracovanie umožňuje nahrať až 50 fotiek naraz. Všetky sa spracujú paralelne.",
  },
  {
    q: "Akú cenu zaplatím za fotku?",
    a: "Základná cena je 0,70 € za fotku. Pri väčších objemoch ponúkame zľavy.",
  },
];

export function FaqSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      id="faq"
      className="section-padding"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div
        className={`section-container transition-[opacity,transform] duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            FAQ
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Často kladené <span className="text-primary">otázky</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-border rounded-xl px-5 data-[state=open]:border-primary/30 transition-colors"
              >
                <AccordionTrigger className="text-sm sm:text-base font-semibold text-foreground hover:no-underline py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
