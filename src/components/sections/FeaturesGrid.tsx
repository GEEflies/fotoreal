import { useState } from "react";
import {
  Layers, Sun, Cloud, Palette, Move, Lightbulb, FileImage, Eye, Droplets, ChevronDown,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { FEATURE_IMAGES } from "@/lib/images";

const features = [
  {
    icon: Layers,
    title: "HDR Zlúčenie",
    desc: "Zlúčte viacero expozícií do jedného obrazu s vysokým dynamickým rozsahom. Vyvážený, prirodzený vzhľad.",
    before: FEATURE_IMAGES.hdr.before,
    after: FEATURE_IMAGES.hdr.after,
  },
  {
    icon: Sun,
    title: "Zjasnenie Okien",
    desc: "Detekuje okná a odkryje jasný výhľad von. Interiéry aj exteriéry s dokonalou jasnosťou.",
    before: FEATURE_IMAGES.windows.before,
    after: FEATURE_IMAGES.windows.after,
  },
  {
    icon: Cloud,
    title: "Výmena Oblohy",
    desc: "Premeňte zamračenú oblohu na jasnú pre príťažlivejší vzhľad. Prirodzene vyzerajúca obloha.",
    before: FEATURE_IMAGES.sky.before,
    after: FEATURE_IMAGES.sky.after,
  },
  {
    icon: Palette,
    title: "Vyváženie Bielej",
    desc: "Automaticky upraví farby aby dokonale odrážali prirodzené tóny v každom obraze.",
    before: FEATURE_IMAGES.whiteBalance.before,
    after: FEATURE_IMAGES.whiteBalance.after,
  },
  {
    icon: Move,
    title: "Korekcia Perspektívy",
    desc: "Narovnajte obrazy pre vyvážený pohľad. Profesionálne zarovnané interiéry aj exteriéry.",
    before: FEATURE_IMAGES.perspective.before,
    after: FEATURE_IMAGES.perspective.after,
  },
  {
    icon: Lightbulb,
    title: "Nasvietenie Obrazu",
    desc: "Upraví jas, svetlá a tiene pre dobre osvetlený, dynamický a vizuálne pútavý obraz.",
    before: FEATURE_IMAGES.relighting.before,
    after: FEATURE_IMAGES.relighting.after,
  },
  {
    icon: FileImage,
    title: "RAW Podpora",
    desc: "Nahrajte RAW súbory priamo pre maximálne zachovanie kvality a detailov.",
    before: FEATURE_IMAGES.raw.before,
    after: FEATURE_IMAGES.raw.after,
  },
  {
    icon: Eye,
    title: "Auto Súkromie",
    desc: "Automaticky rozmaže ŠPZ, tváre a citlivé informácie. GDPR súlad na každej fotke.",
    before: FEATURE_IMAGES.privacy.before,
    after: FEATURE_IMAGES.privacy.after,
  },
  {
    icon: Droplets,
    title: "Korekcia Farieb",
    desc: "Vylepšite živosť a presnú reprodukciu farieb. Úžasné, verné fotografie.",
    before: FEATURE_IMAGES.colorCorrection.before,
    after: FEATURE_IMAGES.colorCorrection.after,
  },
];

const MOBILE_VISIBLE = 3;

export function FeaturesGrid() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.03 });
  const [showAll, setShowAll] = useState(false);

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
        <div className="relative">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className={`group rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all overflow-hidden ${
                  !showAll && i >= MOBILE_VISIBLE ? "hidden sm:block" : ""
                } ${!showAll && i === MOBILE_VISIBLE ? "sm:block" : ""}`}
              >
                <BeforeAfterSlider
                  beforeSrc={f.before}
                  afterSrc={f.after}
                  className="aspect-[16/10]"
                />
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

          {/* Mobile: blurred peek + show more */}
          {!showAll && (
            <div className="sm:hidden relative -mt-4">
              {/* Blurred 4th card peek */}
              <div className="h-32 overflow-hidden rounded-xl pointer-events-none" style={{ filter: "blur(6px)", opacity: 0.5 }}>
                <div className="rounded-xl bg-card border border-border overflow-hidden">
                  <BeforeAfterSlider
                    beforeSrc={features[MOBILE_VISIBLE].before}
                    afterSrc={features[MOBILE_VISIBLE].after}
                    className="aspect-[16/10]"
                  />
                </div>
              </div>
              {/* Gradient overlay + button */}
              <div className="absolute inset-0 bg-gradient-to-t from-accent/90 via-accent/60 to-transparent flex items-end justify-center pb-3">
                <button
                  onClick={() => setShowAll(true)}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-lg hover:bg-primary/90 transition-colors"
                >
                  Zobraziť všetkých {features.length} funkcií
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
