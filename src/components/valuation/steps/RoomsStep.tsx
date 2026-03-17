import { WizardStep } from "../WizardStep";
import { ValuationFormData } from "@/types/valuation";
import { cn } from "@/lib/utils";

interface RoomsStepProps {
  formData: ValuationFormData;
  onUpdate: (updates: Partial<ValuationFormData>) => void;
}

const roomOptions = [1, 2, 3, 4, 5, 6];

export function RoomsStep({ formData, onUpdate }: RoomsStepProps) {
  return (
    <WizardStep 
      title="Počet izieb" 
      description="Vyberte počet obytných izieb (bez kuchyne a kúpeľne)."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {roomOptions.map((rooms) => {
            const isSelected = formData.rooms === rooms;
            const label = rooms === 6 ? '6+' : rooms.toString();
            
            return (
              <button
                key={rooms}
                type="button"
                onClick={() => onUpdate({ rooms })}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all text-center font-semibold text-lg",
                  isSelected 
                    ? "border-primary bg-primary/5 text-primary" 
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        <p className="text-sm text-muted-foreground text-center">
          {formData.rooms === 1 && "1-izbový byt / 1 obytná miestnosť"}
          {formData.rooms === 2 && "2-izbový byt / 2 obytné miestnosti"}
          {formData.rooms === 3 && "3-izbový byt / 3 obytné miestnosti"}
          {formData.rooms === 4 && "4-izbový byt / 4 obytné miestnosti"}
          {formData.rooms === 5 && "5-izbový byt / 5 obytných miestností"}
          {formData.rooms === 6 && "6 a viac obytných miestností"}
        </p>
      </div>
    </WizardStep>
  );
}

export function validateRoomsStep(formData: ValuationFormData): boolean {
  return formData.rooms >= 1 && formData.rooms <= 6;
}
