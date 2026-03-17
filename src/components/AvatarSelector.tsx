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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/95 animate-fade-in px-4">
      <div className="w-full max-w-md rounded-2xl bg-card shadow-2xl p-6 sm:p-8 animate-scale-in">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Používate fotografa?
          </h2>
          <p className="text-sm text-muted-foreground mt-1.5">
            Prispôsobíme obsah vašim potrebám.
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleSelect("photographer")}
            onMouseEnter={() => setHoveredOption("photographer")}
            onMouseLeave={() => setHoveredOption(null)}
            className={`group p-4 sm:p-5 rounded-xl border-2 text-left transition-all duration-200 ${
              hoveredOption === "photographer"
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border hover:border-primary/30"
            }`}
          >
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <Camera className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-foreground text-sm sm:text-base mb-2.5">
              Áno, mám fotografa
            </h3>
            <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary group-hover:gap-1.5 transition-all">
              Pokračovať
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </button>

          <button
            onClick={() => handleSelect("no-photographer")}
            onMouseEnter={() => setHoveredOption("no-photographer")}
            onMouseLeave={() => setHoveredOption(null)}
            className={`group p-4 sm:p-5 rounded-xl border-2 text-left transition-all duration-200 ${
              hoveredOption === "no-photographer"
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border hover:border-primary/30"
            }`}
          >
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center mb-3">
              <Smartphone className="h-5 w-5 text-warning" />
            </div>
            <h3 className="font-heading font-bold text-foreground text-sm sm:text-base mb-2.5">
              Nie, fotím sám
            </h3>
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
