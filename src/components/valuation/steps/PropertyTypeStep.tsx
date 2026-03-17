import { WizardStep } from "../WizardStep";
import { ValuationFormData, PropertyType } from "@/types/valuation";
import { Home, Building2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyTypeStepProps {
  formData: ValuationFormData;
  onUpdate: (updates: Partial<ValuationFormData>) => void;
}

const propertyTypes: { value: PropertyType; label: string; icon: React.ElementType; description: string }[] = [
  { value: 'byt', label: 'Byt', icon: Building2, description: 'Bytová jednotka v bytovom dome' },
  { value: 'dom', label: 'Dom', icon: Home, description: 'Rodinný dom alebo vila' },
  { value: 'pozemok', label: 'Pozemok', icon: MapPin, description: 'Stavebný alebo iný pozemok' },
];

export function PropertyTypeStep({ formData, onUpdate }: PropertyTypeStepProps) {
  return (
    <WizardStep 
      title="Typ nehnuteľnosti" 
      description="Vyberte typ nehnuteľnosti, ktorú chcete oceniť."
    >
      <div className="grid gap-3">
        {propertyTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = formData.propertyType === type.value;
          
          return (
            <button
              key={type.value}
              type="button"
              onClick={() => onUpdate({ propertyType: type.value })}
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
                  {type.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {type.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </WizardStep>
  );
}

export function validatePropertyTypeStep(formData: ValuationFormData): boolean {
  return formData.propertyType !== null;
}
