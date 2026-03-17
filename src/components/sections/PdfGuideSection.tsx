import { FileText, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

interface PdfGuideSectionProps {
  onOpenForm: () => void;
}

const guideContents = [
  "Predaj nehnuteľností za najvyššiu cenu",
  "Ako správne predávať nehnuteľnosť",
  "12 krokov prípravy pred fotením",
  "Homestaging s nízkym rozpočtom",
  "Načasovanie predaja podľa sezóny a dopytu",
  "Texty a fotky, ktoré fungujú v inzercii",
  "Vyjednávanie s kupujúcimi",
];

export function PdfGuideSection({ onOpenForm }: PdfGuideSectionProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      id="pdf-navod"
      className="section-padding"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div
        className={`section-container transition-[opacity,transform] duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>PDF návod zdarma</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Čo nájdete v{" "}
              <span className="text-primary">PDF návode</span>?
            </h2>

            <p className="text-sm sm:text-lg text-muted-foreground mb-4 sm:mb-8">
              Praktický sprievodca na prípravu nehnuteľnosti na predaj.
            </p>

            <ul className="space-y-2 sm:space-y-4 mb-6 sm:mb-8">
              {guideContents.map((item, index) => (
                <li key={index} className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-foreground text-sm sm:text-base">{item}</span>
                </li>
              ))}
            </ul>

            <Button
              size="lg"
              onClick={onOpenForm}
              className="w-full sm:w-auto group font-bold shadow-glow hover:shadow-lg transition-all px-4 sm:px-6"
            >
              <span className="sm:hidden">Získať ocenenie ZDARMA</span>
              <span className="hidden sm:inline">Získať ocenenie + PDF návod ZDARMA</span>
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Visual */}
          <div className="order-1 lg:order-2 relative hidden sm:block overflow-hidden">
            <div className="relative bg-gradient-to-br from-primary/10 to-accent rounded-xl sm:rounded-2xl p-4 sm:p-8 lg:p-12 overflow-hidden">
              {/* PDF mockup */}
              <div className="relative bg-card rounded-lg shadow-xl overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="bg-primary text-primary-foreground px-4 sm:px-6 py-3 sm:py-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <FileText className="h-6 w-6 sm:h-8 sm:w-8" />
                    <div>
                      <p className="font-semibold text-sm sm:text-base">PDF NÁVOD</p>
                      <p className="text-xs sm:text-sm text-primary-foreground/80">
                        Ako predať nehnuteľnosť drahšie
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-1 sm:space-y-2">
                      <div
                        className="h-2 sm:h-3 bg-muted rounded"
                        style={{ width: `${90 - i * 10}%` }}
                      />
                      <div
                        className="h-1.5 sm:h-2 bg-muted/60 rounded"
                        style={{ width: `${70 - i * 5}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative elements - contained within parent */}
              <div className="absolute top-0 right-0 h-16 w-16 sm:h-20 sm:w-20 bg-primary/20 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 h-12 w-12 sm:h-16 sm:w-16 bg-accent/40 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
