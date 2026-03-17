import {
  Layers, Sun, Cloud, Palette, Move, Lightbulb, FileImage, Eye, Droplets,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const features = [
  {
    icon: Layers,
    title: "HDR Zlúčenie",
    description: "Okamžite zoskupte a zlúčte viacero expozícií do jedného obrazu s vysokým dynamickým rozsahom.",
  },
  {
    icon: Sun,
    title: "Zjasnenie Okien",
    description: "Detekuje okná a aplikuje presnú masku na odkrytie jasného výhľadu von.",
  },
  {
    icon: Cloud,
    title: "Výmena Oblohy",
    description: "Automaticky premeňte zamračenú oblohu na jasnú oblohu pre príťažlivejší vzhľad.",
  },
  {
    icon: Palette,
    title: "Vyváženie Bielej",
    description: "Automaticky upraví tak, aby dokonale odrážalo prirodzené farby v každom obraze.",
  },
  {
    icon: Move,
    title: "Korekcia Perspektívy",
    description: "Dokonale narovnajte svoje obrazy pre vyvážený, reprezentatívny pohľad.",
  },
  {
    icon: Lightbulb,
    title: "Nasvietenie Obrazu",
    description: "Upravuje jas, svetlá a tiene pre dobre osvetlený, dynamický obraz.",
  },
  {
    icon: FileImage,
    title: "RAW Podpora",
    description: "Nahrajte RAW súbory priamo pre maximálne zachovanie kvality a detailov.",
  },
  {
    icon: Eye,
    title: "Auto Súkromie",
    description: "Automaticky detekuje a rozmaže ŠPZ, tváre a ďalšie citlivé informácie.",
  },
  {
    icon: Droplets,
    title: "Korekcia Farieb",
    description: "Vylepšite živosť a zabezpečte presnú reprodukciu farieb na všetkých obrázkoch.",
  },
];

export function FeaturesGrid() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.05 });

  return (
    <section
      id="funkcie"
      className="section-padding bg-accent/30"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div className={`section-container transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-5xl font-bold text-foreground mb-3">
            Čo dokážete s naším <span className="text-primary">AI</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto">
            Real Foto upraví vaše realitné fotografie do najmenšieho detailu. Plne optimalizované pre realitný priemysel.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="group p-5 sm:p-6 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-foreground text-base sm:text-lg mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
