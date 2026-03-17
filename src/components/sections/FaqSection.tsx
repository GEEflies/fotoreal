import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const faqs = [
  {
    question: "Je to skutočne zdarma?",
    answer:
      "Áno, odhad hodnoty nehnuteľnosti aj PDF návod sú úplne zdarma a bez akýchkoľvek záväzkov. Nemusíte nič platiť ani sa k ničomu zaväzovať. Chceme vám pomôcť urobiť informované rozhodnutie.",
  },
  {
    question: "Ako presný je odhad?",
    answer:
      "Náš odhad vychádza z aktuálnych trhových dát, porovnateľných predajov v okolí a skúseností z trhu. Poskytuje vám realistický rozsah hodnoty vašej nehnuteľnosti. Pre presnejšie ocenenie odporúčame osobnú obhliadku, ktorú vám môžeme sprostredkovať.",
  },
  {
    question: "Môžem dostať PDF návod aj keď ešte nepredávam?",
    answer:
      "Samozrejme! PDF návod je užitočný aj pre tých, ktorí predaj len zvažujú. Dozviete sa, ako pripraviť nehnuteľnosť na predaj, čo zvyšuje jej hodnotu a na čo si dať pozor. Tieto informácie môžete využiť kedykoľvek v budúcnosti.",
  },
  {
    question: "Koľko môže návod pridať k cene?",
    answer:
      "Podľa našich skúseností môžu správne uplatnené rady z návodu zvýšiť predajnú cenu o 5 – 20 000 € v závislosti od typu nehnuteľnosti a jej stavu. Kľúčové sú profesionálne fotografie, správna prezentácia a načasovanie predaja.",
  },
];

export function FaqSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      id="faq"
      className="section-padding bg-secondary/30"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div
        className={`section-container transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-16">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            Často kladené <span className="text-primary">otázky</span>
          </h2>
          <p className="text-sm sm:text-lg text-muted-foreground">
            Odpovede na najčastejšie otázky
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-2 sm:space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg sm:rounded-xl px-3 sm:px-6 overflow-hidden"
              >
                <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:text-primary py-3 sm:py-5 hover:no-underline text-sm sm:text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-3 sm:pb-5 text-xs sm:text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
