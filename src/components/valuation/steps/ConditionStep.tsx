import { WizardStep } from "../WizardStep";
import { ValuationFormData, PropertyCondition } from "@/types/valuation";
import { cn } from "@/lib/utils";
import { Wrench, Sparkles, Home } from "lucide-react";

interface ConditionStepProps {
  formData: ValuationFormData;
  onUpdate: (updates: Partial<ValuationFormData>) => void;
}

const conditionOptions: { value: PropertyCondition; label: string; icon: React.ElementType; description: string }[] = [
  { 
    value: 'original', 
    label: 'Pôvodný stav', 
    icon: Wrench,
    description: 'Nehnuteľnosť vyžaduje rekonštrukciu alebo modernizáciu' 
  },
  { 
    value: 'renovated', 
    label: 'Po rekonštrukcii', 
    icon: Sparkles,
    description: 'Čiastočná alebo kompletná rekonštrukcia' 
  },
  { 
    value: 'new_build', 
    label: 'Novostavba', 
    icon: Home,
    description: 'Nová nehnuteľnosť, menej ako 5 rokov' 
  },
];

export function ConditionStep({ formData, onUpdate }: ConditionStepProps) {
  return (
    <WizardStep 
      title="Stav nehnuteľnosti" 
      description="Vyberte aktuálny stav nehnuteľnosti."
    >
      <div className="grid gap-3">
        {conditionOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = formData.condition === option.value;
          
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onUpdate({ condition: option.value })}
              className={cn(
                "flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left",
                isSelected 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              )}
            >
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-lg",
                isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
              )}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <div className={cn(
                  "font-semibold",
                  isSelected && "text-primary"
                )}>
                  {option.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {option.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </WizardStep>
  );
}

export function validateConditionStep(formData: ValuationFormData): boolean {
  return formData.condition !== null;
}
