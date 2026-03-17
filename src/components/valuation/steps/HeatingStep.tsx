import { WizardStep } from "../WizardStep";
import { ValuationFormData, HeatingType } from "@/types/valuation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Flame, Zap, Thermometer, TreePine, Fan, HelpCircle } from "lucide-react";

interface HeatingStepProps {
  formData: ValuationFormData;
  onUpdate: (updates: Partial<ValuationFormData>) => void;
}

const heatingOptions: { value: HeatingType; label: string; icon: React.ElementType }[] = [
  { value: 'central', label: 'Centrálne (CZT)', icon: Thermometer },
  { value: 'gas', label: 'Plynové', icon: Flame },
  { value: 'electric', label: 'Elektrické', icon: Zap },
  { value: 'solid_fuel', label: 'Tuhé palivo', icon: TreePine },
  { value: 'heat_pump', label: 'Tepelné čerpadlo', icon: Fan },
  { value: 'other', label: 'Iné', icon: HelpCircle },
];

export function HeatingStep({ formData, onUpdate }: HeatingStepProps) {
  return (
    <WizardStep 
      title="Typ kúrenia" 
      description="Vyberte prevažujúci typ vykurovania."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {heatingOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = formData.heatingType === option.value;
            
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onUpdate({ heatingType: option.value })}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left",
                  isSelected 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg shrink-0",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={cn(
                  "font-medium text-sm",
                  isSelected && "text-primary"
                )}>
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>

        {formData.heatingType === 'other' && (
          <div className="space-y-2 animate-fade-in">
            <Label htmlFor="heatingNote">Špecifikujte typ kúrenia</Label>
            <Input
              id="heatingNote"
              placeholder="Napr. kombinované, krb + elektrické..."
              value={formData.heatingNote || ''}
              onChange={(e) => onUpdate({ heatingNote: e.target.value })}
            />
          </div>
        )}
      </div>
    </WizardStep>
  );
}

export function validateHeatingStep(formData: ValuationFormData): boolean {
  if (!formData.heatingType) return false;
  
  // If "other" is selected, require a note
  if (formData.heatingType === 'other' && !formData.heatingNote?.trim()) {
    return false;
  }
  
  return true;
}
