import { WizardStep } from "../WizardStep";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ValuationFormData } from "@/types/valuation";

interface FloorAreaStepProps {
  formData: ValuationFormData;
  onUpdate: (updates: Partial<ValuationFormData>) => void;
}

const MIN_AREA = 10;
const MAX_AREA = 500;

export function FloorAreaStep({ formData, onUpdate }: FloorAreaStepProps) {
  const handleSliderChange = (value: number[]) => {
    onUpdate({ floorArea: value[0] });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || MIN_AREA;
    const clampedValue = Math.max(MIN_AREA, Math.min(MAX_AREA, value));
    onUpdate({ floorArea: clampedValue });
  };

  return (
    <WizardStep 
      title="Podlahová plocha" 
      description="Uveďte celkovú úžitkovú plochu nehnuteľnosti."
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Plocha v m²</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={formData.floorArea}
                onChange={handleInputChange}
                min={MIN_AREA}
                max={MAX_AREA}
                className="w-24 text-right"
              />
              <span className="text-muted-foreground">m²</span>
            </div>
          </div>
          
          <Slider
            value={[formData.floorArea]}
            onValueChange={handleSliderChange}
            min={MIN_AREA}
            max={MAX_AREA}
            step={1}
            className="py-4"
          />
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{MIN_AREA} m²</span>
            <span>{MAX_AREA} m²</span>
          </div>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Tip:</strong> Uveďte úžitkovú plochu bez spoločných priestorov (chodba, schodisko). 
            Pri byte uveďte plochu bytu, nie podiel na spoločných častiach.
          </p>
        </div>
      </div>
    </WizardStep>
  );
}

export function validateFloorAreaStep(formData: ValuationFormData): boolean {
  return formData.floorArea >= MIN_AREA && formData.floorArea <= MAX_AREA;
}
