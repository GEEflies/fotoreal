import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WizardStepProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function WizardStep({ title, description, children, className }: WizardStepProps) {
  return (
    <div className={cn("space-y-6 animate-fade-in", className)}>
      <div className="space-y-1">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      
      <div className="min-h-[200px]">
        {children}
      </div>
    </div>
  );
}
