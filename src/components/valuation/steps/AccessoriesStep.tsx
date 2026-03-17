import { WizardStep } from "../WizardStep";
import { ValuationFormData, ParkingType } from "@/types/valuation";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AccessoriesStepProps {
  formData: ValuationFormData;
  onUpdate: (updates: Partial<ValuationFormData>) => void;
}

const parkingOptions: { value: ParkingType; label: string }[] = [
  { value: 'none', label: 'Bez parkovania' },
  { value: 'street', label: 'Ulica' },
  { value: 'parking_spot', label: 'Parkovacie miesto' },
  { value: 'garage', label: 'Garáž' },
];

export function AccessoriesStep({ formData, onUpdate }: AccessoriesStepProps) {
  const updateAccessory = (key: keyof typeof formData.accessories, value: any) => {
    onUpdate({
      accessories: {
        ...formData.accessories,
        [key]: value,
      },
    });
  };

  return (
    <WizardStep 
      title="Príslušenstvo" 
      description="Označte dostupné príslušenstvo a vybavenie."
    >
      <div className="space-y-4">
        {/* Balcony */}
        <div className="p-4 rounded-lg border border-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Checkbox
                id="balcony"
                checked={formData.accessories.hasBalcony}
                onCheckedChange={(checked) => updateAccessory('hasBalcony', checked === true)}
              />
              <Label htmlFor="balcony" className="text-base font-medium cursor-pointer">
                Balkón
              </Label>
            </div>
            {formData.accessories.hasBalcony && (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.accessories.balconySize || ''}
                  onChange={(e) => updateAccessory('balconySize', parseInt(e.target.value) || undefined)}
                  className="w-20 text-right"
                  min={1}
                />
                <span className="text-sm text-muted-foreground">m²</span>
              </div>
            )}
          </div>
        </div>

        {/* Terrace */}
        <div className="p-4 rounded-lg border border-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Checkbox
                id="terrace"
                checked={formData.accessories.hasTerrace}
                onCheckedChange={(checked) => updateAccessory('hasTerrace', checked === true)}
              />
              <Label htmlFor="terrace" className="text-base font-medium cursor-pointer">
                Terasa
              </Label>
            </div>
            {formData.accessories.hasTerrace && (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.accessories.terraceSize || ''}
                  onChange={(e) => updateAccessory('terraceSize', parseInt(e.target.value) || undefined)}
                  className="w-20 text-right"
                  min={1}
                />
                <span className="text-sm text-muted-foreground">m²</span>
              </div>
            )}
          </div>
        </div>

        {/* Cellar */}
        <div className="p-4 rounded-lg border border-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Checkbox
                id="cellar"
                checked={formData.accessories.hasCellar}
                onCheckedChange={(checked) => updateAccessory('hasCellar', checked === true)}
              />
              <Label htmlFor="cellar" className="text-base font-medium cursor-pointer">
                Pivnica
              </Label>
            </div>
            {formData.accessories.hasCellar && (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.accessories.cellarSize || ''}
                  onChange={(e) => updateAccessory('cellarSize', parseInt(e.target.value) || undefined)}
                  className="w-20 text-right"
                  min={1}
                />
                <span className="text-sm text-muted-foreground">m²</span>
              </div>
            )}
          </div>
        </div>

        {/* Parking */}
        <div className="space-y-3">
          <Label className="text-base">Parkovanie</Label>
          <div className="grid grid-cols-2 gap-2">
            {parkingOptions.map((option) => {
              const isSelected = formData.accessories.parkingType === option.value;
              
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateAccessory('parkingType', option.value)}
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
          
          {(formData.accessories.parkingType === 'parking_spot' || 
            formData.accessories.parkingType === 'garage') && (
            <div className="flex items-center gap-2 pt-2">
              <Label className="text-sm text-muted-foreground">Počet miest:</Label>
              <Input
                type="number"
                value={formData.accessories.parkingCount || 1}
                onChange={(e) => updateAccessory('parkingCount', parseInt(e.target.value) || 1)}
                className="w-20"
                min={1}
                max={10}
              />
            </div>
          )}
        </div>
      </div>
    </WizardStep>
  );
}

export function validateAccessoriesStep(formData: ValuationFormData): boolean {
  // Always valid - accessories are optional
  return true;
}
