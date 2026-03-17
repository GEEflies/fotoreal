import { useState } from "react";

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
      <div className="w-full max-w-sm sm:max-w-md rounded-3xl bg-card/95 backdrop-blur-xl shadow-2xl border border-white/10 p-8 sm:p-10 animate-scale-in text-center">
        <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-foreground tracking-tight leading-snug mb-8">
          Používate realitného fotografa?
        </h2>

        <div className="flex gap-4">
          {[
            { key: "photographer" as AvatarType, label: "ÁNO" },
            { key: "no-photographer" as AvatarType, label: "NIE" },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => handleSelect(opt.key)}
              onMouseEnter={() => setHoveredOption(opt.key)}
              onMouseLeave={() => setHoveredOption(null)}
              className={`flex-1 py-4 sm:py-5 rounded-xl font-heading font-extrabold text-xl sm:text-2xl tracking-wide transition-all duration-200 ${
                hoveredOption === opt.key
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.03]"
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
