import { WizardStep } from "../WizardStep";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ValuationFormData } from "@/types/valuation";
import { isValidPhone } from "@/hooks/use-wizard-state";

interface ContactStepProps {
  formData: ValuationFormData;
  onUpdate: (updates: Partial<ValuationFormData>) => void;
}

export function ContactStep({ formData, onUpdate }: ContactStepProps) {
  const phoneValid = formData.phone ? isValidPhone(formData.phone) : true;

  return (
    <WizardStep 
      title="Kontaktné údaje" 
      description="Vaše údaje použijeme len na zaslanie odhadu hodnoty."
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Meno a priezvisko *</Label>
          <Input
            id="name"
            placeholder="Ján Novák"
            value={formData.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefónne číslo *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="0911 123 456"
            value={formData.phone}
            onChange={(e) => onUpdate({ phone: e.target.value })}
            className={!phoneValid ? "border-destructive" : ""}
          />
          {!phoneValid && (
            <p className="text-xs text-destructive">
              Zadajte platné slovenské telefónne číslo
            </p>
          )}
        </div>

        <div className="flex items-start space-x-3 pt-2">
          <Checkbox
            id="gdpr"
            checked={formData.gdprConsent}
            onCheckedChange={(checked) => onUpdate({ gdprConsent: checked === true })}
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="gdpr"
              className="text-sm font-normal text-muted-foreground cursor-pointer"
            >
              Súhlasím so spracovaním osobných údajov za účelom poskytnutia odhadu hodnoty nehnuteľnosti. *
            </Label>
          </div>
        </div>
      </div>
    </WizardStep>
  );
}

export function validateContactStep(formData: ValuationFormData): boolean {
  return (
    formData.name.trim().length >= 2 &&
    isValidPhone(formData.phone) &&
    formData.gdprConsent
  );
}
