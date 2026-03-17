import { WizardStep } from "../WizardStep";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ValuationFormData } from "@/types/valuation";

interface AddressStepProps {
  formData: ValuationFormData;
  onUpdate: (updates: Partial<ValuationFormData>) => void;
}

export function AddressStep({ formData, onUpdate }: AddressStepProps) {
  return (
    <WizardStep 
      title="Adresa nehnuteľnosti" 
      description="Uveďte presnú adresu nehnuteľnosti."
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="street">Ulica a číslo *</Label>
          <Input
            id="street"
            placeholder="Hlavná 15"
            value={formData.street}
            onChange={(e) => onUpdate({ street: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Mesto *</Label>
            <Input
              id="city"
              placeholder="Bratislava"
              value={formData.city}
              onChange={(e) => onUpdate({ city: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">PSČ *</Label>
            <Input
              id="zipCode"
              placeholder="81101"
              value={formData.zipCode}
              onChange={(e) => {
                // Only allow digits, max 5
                const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                onUpdate({ zipCode: value });
              }}
              maxLength={5}
            />
          </div>
        </div>
      </div>
    </WizardStep>
  );
}

export function validateAddressStep(formData: ValuationFormData): boolean {
  return (
    formData.street.trim().length >= 3 &&
    formData.city.trim().length >= 2 &&
    /^\d{5}$/.test(formData.zipCode)
  );
}
