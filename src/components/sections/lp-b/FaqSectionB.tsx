import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const faqs = [
  {
    q: "Stačí na to fotka z mobilu?",
    a: "Áno! RealFoto je optimalizovaný práve pre fotky z mobilov. Podporujeme iPhone aj Android. Stačí dobre osvetlená miestnosť a naše AI spraví zvyšok.",
  },
  {
    q: "Naozaj to vyzerá ako od profesionálneho fotografa?",
    a: "Naše AI bolo trénované na tisíckach profesionálne upravených realitných fotiek. Výsledky sú konzistentne na úrovni skúsených fotografov — HDR, korekcia perspektívy, vyváženie farieb, všetko automaticky.",
  },
  {
    q: "Koľko stojí jedna fotka?",
    a: "0,70 € za fotku. Pri 20 fotkách na nehnuteľnosť je to len 14 €. Prvých 5 fotiek je úplne zadarmo.",
  },
  {
    q: "Ako rýchlo dostanem výsledok?",
    a: "Priemerne za 15–30 sekúnd. Nahráte fotku, AI ju spracuje a stiahnete hotový výsledok. Žiadne čakanie.",
  },
  {
    q: "Naozaj to pomôže predať rýchlejšie?",
    a: "Dáta ukazujú, že inzeráty s profesionálnymi fotkami dostávajú o 118% viac zobrazení. Viac zobrazení = viac záujemcov = rýchlejší predaj za lepšiu cenu.",
  },
  {
    q: "Aké formáty podporujete?",
    a: "JPG, PNG, WebP a RAW (CR2, NEF, ARW). Maximálna veľkosť 50 MB. Dávkové spracovanie až 50 fotiek naraz.",
  },
];

export function FaqSectionB() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section id="faq" className="section-padding" ref={ref as React.RefObject<HTMLElement>}>
      <div className={`section-container transition-[opacity,transform] duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">FAQ</p>
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
