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
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in px-4" style={{ background: "radial-gradient(circle at center, hsl(244 95% 10%) 0%, hsl(244 95% 5%) 60%)" }}>
      <div className="w-full max-w-md lg:max-w-xl rounded-2xl bg-card shadow-2xl p-6 sm:p-8 lg:p-10 animate-scale-in">
        <div className="text-center mb-6">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Používate realitného fotografa?
          </h2>
          <p className="text-sm text-muted-foreground mt-1.5 hidden sm:block">
            Prispôsobíme obsah vašim potrebám.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { key: "photographer" as AvatarType, icon: Camera, iconBg: "bg-primary/10", iconColor: "text-primary", label: "Áno, používam", mobileLabel: "ÁNO" },
            { key: "no-photographer" as AvatarType, icon: Smartphone, iconBg: "bg-[hsl(270,80%,96%)]", iconColor: "text-[hsl(270,60%,55%)]", label: "Nie, fotím sám", mobileLabel: "NIE" },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => handleSelect(opt.key)}
              onMouseEnter={() => setHoveredOption(opt.key)}
              onMouseLeave={() => setHoveredOption(null)}
              className={`group flex flex-col items-center sm:items-start text-center sm:text-left p-4 sm:p-5 rounded-xl border-2 transition-all duration-200 h-full ${
                hoveredOption === opt.key
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <div className={`h-10 w-10 rounded-lg ${opt.iconBg} items-center justify-center mb-3 hidden sm:flex`}>
                <opt.icon className={`h-5 w-5 ${opt.iconColor}`} />
              </div>
              <h3 className="font-heading font-bold text-foreground text-lg sm:text-base mb-0 sm:mb-3 flex-1 flex items-center">
                <span className="sm:hidden">{opt.mobileLabel}</span>
                <span className="hidden sm:inline">{opt.label}</span>
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary group-hover:gap-1.5 transition-all">
                Pokračovať
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
