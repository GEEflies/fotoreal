import { Users, Target, Heart, Award } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const values = [
  {
    icon: Target,
    title: "Transparentnosť",
    description: "Jasné a zrozumiteľné informácie bez skrytých poplatkov či záväzkov.",
  },
  {
    icon: Heart,
    title: "Osobný prístup",
    description: "Každú nehnuteľnosť posudzujeme individuálne s ohľadom na jej jedinečnosť.",
  },
  {
    icon: Award,
    title: "Odbornosť",
    description: "Roky skúseností na slovenskom realitnom trhu a stovky úspešných predajov.",
  },
];

export function AboutSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      id="o-nas"
      className="section-padding"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div
        className={`section-container transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>O nás</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6">
              Pomáhame predávať <span className="text-primary">nehnuteľnosti</span> za ich skutočnú hodnotu
            </h2>

            <div className="space-y-3 sm:space-y-4 text-muted-foreground leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">
              <p>
                Sme tím realitných odborníkov z Bratislavy. Za roky pôsobenia na trhu sme pomohli stovkám 
                klientov predať ich nehnuteľnosti za ceny, ktoré často prekročili ich očakávania.
              </p>
              <p className="hidden sm:block">
                Vytvorili sme tento nástroj na ocenenie a PDF návod preto, aby mal každý majiteľ 
                nehnuteľnosti prístup k informáciám pre úspešný predaj.
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Tím realitných expertov"
              className="rounded-xl sm:rounded-2xl shadow-xl object-cover aspect-[4/3]"
            />
            {/* Stats overlay */}
            <div className="absolute -bottom-4 sm:-bottom-6 left-2 right-2 sm:left-6 sm:right-6 bg-card/95 backdrop-blur-sm border border-border rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-lg">
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-primary">500+</p>
                  <p className="text-[9px] sm:text-xs text-muted-foreground">Klientov</p>
                </div>
                <div className="border-x border-border">
                  <p className="text-lg sm:text-2xl font-bold text-primary">10+</p>
                  <p className="text-[9px] sm:text-xs text-muted-foreground">Rokov</p>
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-primary">4.9</p>
                  <p className="text-[9px] sm:text-xs text-muted-foreground">Hodnotenie</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6 mt-12 sm:mt-20">
          {values.map((value, index) => (
            <div
              key={index}
              className="text-center p-2 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="inline-flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-lg sm:rounded-xl bg-primary/10 text-primary mb-2 sm:mb-4">
                <value.icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
              </div>
              <h3 className="font-heading text-xs sm:text-base lg:text-lg font-semibold text-foreground mb-1 sm:mb-2">
                {value.title}
              </h3>
              <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground hidden sm:block">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
