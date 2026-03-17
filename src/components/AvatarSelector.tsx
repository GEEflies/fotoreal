import { useState } from "react";
import { Camera, Smartphone, ArrowRight } from "lucide-react";

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-[hsl(244,95%,9%)] via-[hsl(217,97%,20%)] to-[hsl(244,95%,9%)] animate-fade-in px-4">
      <div className="w-full max-w-lg rounded-2xl bg-card border border-border shadow-xl p-5 sm:p-8 animate-scale-in">
        {/* Header */}
        <div className="text-center mb-5 sm:mb-7">
          <h2 className="font-heading text-lg sm:text-2xl font-bold text-foreground mb-1">
            Používate fotografa?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Prispôsobíme obsah vašim potrebám.
          </p>
        </div>

        {/* Options — always side by side */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleSelect("photographer")}
            onMouseEnter={() => setHoveredOption("photographer")}
            onMouseLeave={() => setHoveredOption(null)}
            className={`group relative p-4 sm:p-5 rounded-xl border-2 text-left transition-all duration-200 ${
              hoveredOption === "photographer"
                ? "border-primary bg-primary/5 shadow-lg"
                : "border-border bg-card hover:border-primary/40"
            }`}
          >
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
              <Camera className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-foreground text-sm sm:text-base mb-1">
              Áno, mám fotografa
            </h3>
            <p className="text-xs text-muted-foreground leading-snug mb-3 hidden sm:block">
              Chcem znížiť náklady.
            </p>
            <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary group-hover:gap-1.5 transition-all">
              Pokračovať
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </button>

          <button
            onClick={() => handleSelect("no-photographer")}
            onMouseEnter={() => setHoveredOption("no-photographer")}
            onMouseLeave={() => setHoveredOption(null)}
            className={`group relative p-4 sm:p-5 rounded-xl border-2 text-left transition-all duration-200 ${
              hoveredOption === "no-photographer"
                ? "border-primary bg-primary/5 shadow-lg"
                : "border-border bg-card hover:border-primary/40"
            }`}
          >
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center mb-3 group-hover:bg-warning/20 transition-colors">
              <Smartphone className="h-5 w-5 text-warning" />
            </div>
            <h3 className="font-heading font-bold text-foreground text-sm sm:text-base mb-1">
              Nie, fotím sám
            </h3>
            <p className="text-xs text-muted-foreground leading-snug mb-3 hidden sm:block">
              Chcem lepšie fotky z mobilu.
            </p>
            <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary group-hover:gap-1.5 transition-all">
              Pokračovať
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
