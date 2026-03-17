import { WizardStep } from "../WizardStep";
import { ValuationFormData } from "@/types/valuation";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface YearsStepProps {
  formData: ValuationFormData;
  onUpdate: (updates: Partial<ValuationFormData>) => void;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 125 }, (_, i) => currentYear - i);

export function YearsStep({ formData, onUpdate }: YearsStepProps) {
  const renovationYears = formData.yearBuilt 
    ? years.filter(y => y >= formData.yearBuilt!) 
    : years;

  return (
    <WizardStep 
      title="Rok výstavby a rekonštrukcie" 
      description="Uveďte rok výstavby a prípadnej rekonštrukcie."
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Rok výstavby *</Label>
          <Select
            value={formData.yearBuilt?.toString() || ''}
            onValueChange={(value) => {
              const year = parseInt(value);
              onUpdate({ 
                yearBuilt: year,
                // Reset renovation year if it's before the new build year
                yearRenovated: formData.yearRenovated && formData.yearRenovated < year 
                  ? null 
                  : formData.yearRenovated
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Vyberte rok" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData.condition === 'renovated' && (
          <div className="space-y-2">
            <Label>Rok rekonštrukcie</Label>
            <Select
              value={formData.yearRenovated?.toString() || 'none'}
              onValueChange={(value) => onUpdate({ yearRenovated: value === 'none' ? null : parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Vyberte rok (voliteľné)" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="none">Neuvedené</SelectItem>
                {renovationYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.yearBuilt && (
              <p className="text-xs text-muted-foreground">
                Rok rekonštrukcie môže byť od {formData.yearBuilt} do {currentYear}
              </p>
            )}
          </div>
        )}

        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Tip:</strong> Rok výstavby nájdete v liste vlastníctva alebo v projektovej dokumentácii.
          </p>
        </div>
      </div>
    </WizardStep>
  );
}

export function validateYearsStep(formData: ValuationFormData): boolean {
  if (!formData.yearBuilt) return false;
  
  // If renovated and renovation year provided, it must be >= build year
  if (formData.yearRenovated && formData.yearRenovated < formData.yearBuilt) {
    return false;
  }
  
  return true;
}
