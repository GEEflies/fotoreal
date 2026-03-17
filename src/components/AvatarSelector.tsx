import { useState } from "react";
import { Camera, Smartphone } from "lucide-react";

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
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in px-4"
      style={{
        background:
          "radial-gradient(circle at center, hsl(244 95% 10%) 0%, hsl(244 95% 5%) 60%)",
      }}
    >
      <div className="w-full max-w-md lg:max-w-xl rounded-2xl bg-card shadow-2xl p-6 sm:p-8 lg:p-10 animate-scale-in">
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight text-center mb-6 sm:mb-8">
          Používate realitného fotografa?
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {[
            { key: "photographer" as AvatarType, icon: Camera, iconBg: "bg-primary/10", iconColor: "text-primary", label: "ÁNO" },
            { key: "no-photographer" as AvatarType, icon: Smartphone, iconBg: "bg-[hsl(270,80%,96%)]", iconColor: "text-[hsl(270,60%,55%)]", label: "NIE" },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => handleSelect(opt.key)}
              onMouseEnter={() => setHoveredOption(opt.key)}
              onMouseLeave={() => setHoveredOption(null)}
              className={`group flex flex-col items-center justify-center p-5 sm:p-6 rounded-xl border-2 transition-all duration-200 ${
                hoveredOption === opt.key
                  ? "border-primary bg-primary/5 shadow-lg scale-[1.02]"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-xl ${opt.iconBg} flex items-center justify-center mb-4`}>
                <opt.icon className={`h-6 w-6 sm:h-7 sm:w-7 ${opt.iconColor}`} />
              </div>
              <h3 className="font-heading font-extrabold text-foreground text-xl sm:text-2xl">
                {opt.label}
              </h3>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
