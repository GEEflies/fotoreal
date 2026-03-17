import { Users, TrendingUp, ThumbsUp } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const stats = [
  {
    icon: Users,
    value: "847+",
    label: "majiteľov tento rok",
  },
  {
    icon: TrendingUp,
    value: "+15 000 €",
    label: "priemerné navýšenie",
  },
  {
    icon: ThumbsUp,
    value: "100%",
    label: "spokojnosť klientov",
  },
];

export function SocialProofStrip() {
  return (
    <section className="py-4 sm:py-6 lg:py-8 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-y border-slate-100">
      <div className="section-container">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-8 items-center justify-items-center">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 text-center"
            >
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <stat.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <p className="font-heading text-base sm:text-xl lg:text-2xl font-bold text-primary">
                  <AnimatedCounter value={stat.value} duration={2000} />
                </p>
                <p className="text-[10px] sm:text-sm text-muted-foreground leading-tight">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
