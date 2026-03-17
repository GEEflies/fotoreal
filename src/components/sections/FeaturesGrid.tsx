import {
  Layers, Sun, Cloud, Palette, Move, Lightbulb, FileImage, Eye, Droplets,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";

const IMG = (path: string) =>
  `https://realfoto-adames.vercel.app/_next/image?url=%2Flanding%2F${encodeURIComponent(path)}&w=1200&q=85`;

const features = [
  {
    icon: Layers,
    title: "HDR Zlúčenie",
    desc: "Zlúčte viacero expozícií do jedného obrazu s vysokým dynamickým rozsahom. Vyvážený, prirodzený vzhľad.",
    before: IMG("hdr merging/hdr-before.jpg"),
    after: IMG("hdr merging/hdr-after.jpeg"),
  },
  {
    icon: Sun,
    title: "Zjasnenie Okien",
    desc: "Detekuje okná a odkryje jasný výhľad von. Interiéry aj exteriéry s dokonalou jasnosťou.",
    before: IMG("window pulling/wp-before.jpg"),
    after: IMG("window pulling/wp-after.jpeg"),
  },
  {
    icon: Cloud,
    title: "Výmena Oblohy",
    desc: "Premeňte zamračenú oblohu na jasnú pre príťažlivejší vzhľad. Prirodzene vyzerajúca obloha.",
    before: IMG("sky replacement/sky-before.jpeg"),
    after: IMG("sky replacement/sky-after.jpeg"),
  },
  {
    icon: Palette,
    title: "Vyváženie Bielej",
    desc: "Automaticky upraví farby aby dokonale odrážali prirodzené tóny v každom obraze.",
    before: IMG("white balance/wb-before.jpg"),
    after: IMG("white balance/wb-after.jpeg"),
  },
  {
    icon: Move,
    title: "Korekcia Perspektívy",
    desc: "Narovnajte obrazy pre vyvážený pohľad. Profesionálne zarovnané interiéry aj exteriéry.",
    before: IMG("perspective correction/prsp-before.jpeg"),
    after: IMG("perspective correction/prsp-after.jpeg"),
  },
  {
    icon: Lightbulb,
    title: "Nasvietenie Obrazu",
    desc: "Upraví jas, svetlá a tiene pre dobre osvetlený, dynamický a vizuálne pútavý obraz.",
    before: IMG("relighting/religh-before.jpg"),
    after: IMG("relighting/religh-after.jpg"),
  },
  {
    icon: FileImage,
    title: "RAW Podpora",
    desc: "Nahrajte RAW súbory priamo pre maximálne zachovanie kvality a detailov.",
    before: IMG("raw/raw-before.jpg"),
    after: IMG("raw/raw-after.jpg"),
  },
  {
    icon: Eye,
    title: "Auto Súkromie",
    desc: "Automaticky rozmaže ŠPZ, tváre a citlivé informácie. GDPR súlad na každej fotke.",
    before: IMG("privacy/privacy-before.jpeg"),
    after: IMG("privacy/privacy-after.jpeg"),
  },
  {
    icon: Droplets,
    title: "Korekcia Farieb",
    desc: "Vylepšite živosť a presnú reprodukciu farieb. Úžasné, verné fotografie.",
    before: IMG("color correction/cc-before.jpg"),
    after: IMG("color correction/cc-after.jpg"),
  },
];

export function FeaturesGrid() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.03 });

  return (
    <section
      id="funkcie"
      className="section-padding bg-accent/30"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div
        className={`section-container transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-16 max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            Funkcie
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-5xl font-bold text-foreground mb-3">
            Čo dokážete s naším <span className="text-primary">AI</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg">
            FotoReal upraví vaše realitné fotografie do najmenšieho detailu.
            Plne optimalizované pre realitný priemysel.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="group rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all overflow-hidden"
            >
              {/* Before/After image */}
              <BeforeAfterSlider
                beforeSrc={f.before}
                afterSrc={f.after}
                className="aspect-[16/10]"
              />
              {/* Text */}
              <div className="p-5">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <f.icon className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground text-base">
                    {f.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
