import { useState } from "react";
import { Camera, DollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export type AvatarType = "photographer" | "no-photographer" | null;

const STORAGE_KEY = "fotoreal_avatar";

export function getStoredAvatar(): AvatarType {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "photographer" || v === "no-photographer") return v;
  } catch {}
  return null;
}

export function storeAvatar(avatar: AvatarType) {
  try {
    if (avatar) localStorage.setItem(STORAGE_KEY, avatar);
  } catch {}
}

interface AvatarSelectorProps {
  onSelect: (avatar: AvatarType) => void;
}

export function AvatarSelector({ onSelect }: AvatarSelectorProps) {
  const [hoveredOption, setHoveredOption] = useState<AvatarType>(null);

  const handleSelect = (avatar: AvatarType) => {
    storeAvatar(avatar);
    onSelect(avatar);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 backdrop-blur-sm animate-fade-in">
      <div className="mx-4 w-full max-w-2xl rounded-2xl bg-card border border-border shadow-xl p-6 sm:p-10 animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Personalizovaný zážitok
          </div>
          <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Používate fotografa na fotenie nehnuteľností?
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Prispôsobíme vám obsah na mieru, aby ste videli presne to, čo je pre vás relevantné.
          </p>
        </div>

        {/* Options */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Option A: Uses photographer */}
          <button
            onClick={() => handleSelect("photographer")}
            onMouseEnter={() => setHoveredOption("photographer")}
            onMouseLeave={() => setHoveredOption(null)}
            className={`group relative p-6 rounded-xl border-2 text-left transition-all duration-200 ${
              hoveredOption === "photographer"
                ? "border-primary bg-primary/5 shadow-lg"
                : "border-border bg-card hover:border-primary/40"
            }`}
          >
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Camera className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-foreground text-base sm:text-lg mb-2">
              Áno, používam fotografa
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Platím za profesionálne fotky a chcem znížiť náklady bez straty kvality.
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
              Pokračovať
              <ArrowRight className="h-4 w-4" />
            </span>
          </button>

          {/* Option B: No photographer */}
          <button
            onClick={() => handleSelect("no-photographer")}
            onMouseEnter={() => setHoveredOption("no-photographer")}
            onMouseLeave={() => setHoveredOption(null)}
            className={`group relative p-6 rounded-xl border-2 text-left transition-all duration-200 ${
              hoveredOption === "no-photographer"
                ? "border-primary bg-primary/5 shadow-lg"
                : "border-border bg-card hover:border-primary/40"
            }`}
          >
            <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center mb-4 group-hover:bg-warning/20 transition-colors">
              <DollarSign className="h-6 w-6 text-warning" />
            </div>
            <h3 className="font-heading font-bold text-foreground text-base sm:text-lg mb-2">
              Nie, fotím si sám
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Fotím na mobil/vlastný foťák a chcem lepšie výsledky bez veľkých nákladov.
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
              Pokračovať
              <ArrowRight className="h-4 w-4" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
