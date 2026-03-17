import { WizardStep } from "../WizardStep";
import { ValuationFormData } from "@/types/valuation";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface FloorElevatorStepProps {
  formData: ValuationFormData;
  onUpdate: (updates: Partial<ValuationFormData>) => void;
}

const floorOptions = [
  { value: -1, label: 'Suterén' },
  { value: 0, label: 'Prízemie' },
  { value: 1, label: '1. poschodie' },
  { value: 2, label: '2. poschodie' },
  { value: 3, label: '3. poschodie' },
  { value: 4, label: '4. poschodie' },
  { value: 5, label: '5. poschodie' },
  { value: 6, label: '6. poschodie' },
  { value: 7, label: '7. poschodie' },
  { value: 8, label: '8+ poschodie' },
];

export function FloorElevatorStep({ formData, onUpdate }: FloorElevatorStepProps) {
  return (
    <WizardStep 
      title="Poschodie a výťah" 
      description="Vyberte poschodie a uveďte, či je v dome výťah."
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Poschodie</Label>
          <div className="grid grid-cols-2 gap-2">
            {floorOptions.map((option) => {
              const isSelected = formData.floor === option.value;
              
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onUpdate({ floor: option.value })}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all text-sm",
                    isSelected 
                      ? "border-primary bg-primary/5 text-primary font-semibold" 
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
          <div>
            <Label htmlFor="elevator" className="text-base font-medium">
              Výťah v dome
            </Label>
            <p className="text-sm text-muted-foreground">
              Je v bytovom dome funkčný výťah?
            </p>
          </div>
          <Switch
            id="elevator"
            checked={formData.hasElevator ?? false}
            onCheckedChange={(checked) => onUpdate({ hasElevator: checked })}
          />
        </div>
      </div>
    </WizardStep>
  );
}

export function validateFloorElevatorStep(formData: ValuationFormData): boolean {
  return formData.floor !== undefined;
}
