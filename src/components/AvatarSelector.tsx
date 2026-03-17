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
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in px-4" style={{ background: "radial-gradient(circle at center, hsl(244 95% 14%) 0%, hsl(244 95% 9%) 60%)" }}>
      <div className="w-full max-w-md rounded-2xl bg-card shadow-2xl p-6 sm:p-8 animate-scale-in">
        <div className="text-center mb-6">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Používate fotografa?
          </h2>
          <p className="text-sm text-muted-foreground mt-1.5">
            Prispôsobíme obsah vašim potrebám.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { key: "photographer" as AvatarType, icon: Camera, iconBg: "bg-primary/10", iconColor: "text-primary", label: "Áno, mám fotografa" },
            { key: "no-photographer" as AvatarType, icon: Smartphone, iconBg: "bg-warning/10", iconColor: "text-warning", label: "Nie, fotím sám" },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => handleSelect(opt.key)}
              onMouseEnter={() => setHoveredOption(opt.key)}
              onMouseLeave={() => setHoveredOption(null)}
              className={`group flex flex-col items-start text-left p-4 sm:p-5 rounded-xl border-2 transition-all duration-200 h-full ${
                hoveredOption === opt.key
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <div className={`h-10 w-10 rounded-lg ${opt.iconBg} flex items-center justify-center mb-3`}>
                <opt.icon className={`h-5 w-5 ${opt.iconColor}`} />
              </div>
              <h3 className="font-heading font-bold text-foreground text-sm sm:text-base mb-3 flex-1">
                {opt.label}
              </h3>
              <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary group-hover:gap-1.5 transition-all">
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
