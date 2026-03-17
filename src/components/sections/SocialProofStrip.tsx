import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const stats = [
  { value: "50 000+", label: "Spracovaných fotiek" },
  { value: "90%", label: "Úspora nákladov" },
  { value: "30s", label: "Priemerný čas úpravy" },
  { value: "4.9", label: "Hodnotenie kvality" },
];

export function SocialProofStrip() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-8 sm:py-12 border-y border-border bg-muted/40"
    >
      <div
        className={`section-container transition-[opacity,transform] duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary">
                <AnimatedCounter value={stat.value} />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
