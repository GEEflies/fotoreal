import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWizardState } from "@/hooks/use-wizard-state";
import { WizardProgress } from "./WizardProgress";
import { WizardNavigation } from "./WizardNavigation";
import { getStepByVisibleIndex, getVisibleSteps } from "@/types/valuation";

// Step components
import { ContactStep, validateContactStep } from "./steps/ContactStep";
import { PropertyTypeStep, validatePropertyTypeStep } from "./steps/PropertyTypeStep";
import { AddressStep, validateAddressStep } from "./steps/AddressStep";
import { FloorAreaStep, validateFloorAreaStep } from "./steps/FloorAreaStep";
import { RoomsStep, validateRoomsStep } from "./steps/RoomsStep";
import { FloorElevatorStep, validateFloorElevatorStep } from "./steps/FloorElevatorStep";
import { ConditionStep, validateConditionStep } from "./steps/ConditionStep";
import { AccessoriesStep, validateAccessoriesStep } from "./steps/AccessoriesStep";
import { YearsStep, validateYearsStep } from "./steps/YearsStep";
import { HeatingStep, validateHeatingStep } from "./steps/HeatingStep";
import { PhotosStep, validatePhotosStep } from "./steps/PhotosStep";

interface ValuationWizardProps {
  onClose?: () => void;
}

export function ValuationWizard({ onClose }: ValuationWizardProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  
  const wizard = useWizardState({
    onComplete: (data, submissionId) => {
      console.log('Wizard completed:', { data, submissionId });
      setIsSuccess(true);
    },
    onPhoneCaptured: (phone, submissionId) => {
      console.log('Phone captured:', { phone, submissionId });
      // Here we would trigger the SMS notification via edge function
    },
  });

  const visibleSteps = getVisibleSteps(wizard.formData);
  const currentStepConfig = getStepByVisibleIndex(wizard.currentStep, wizard.formData);
  const currentStepNumber = currentStepConfig?.number || 1;

  // Validate current step
  const isCurrentStepValid = (): boolean => {
    switch (currentStepNumber) {
      case 1: return validateContactStep(wizard.formData);
      case 2: return validatePropertyTypeStep(wizard.formData);
      case 3: return validateAddressStep(wizard.formData);
      case 4: return validateFloorAreaStep(wizard.formData);
      case 5: return validateRoomsStep(wizard.formData);
      case 6: return validateFloorElevatorStep(wizard.formData);
      case 7: return validateConditionStep(wizard.formData);
      case 8: return validateAccessoriesStep(wizard.formData);
      case 9: return validateYearsStep(wizard.formData);
      case 10: return validateHeatingStep(wizard.formData);
      case 11: return validatePhotosStep(wizard.formData);
      default: return false;
    }
  };

  // Render current step
  const renderStep = () => {
    switch (currentStepNumber) {
      case 1:
        return <ContactStep formData={wizard.formData} onUpdate={wizard.updateFormData} />;
      case 2:
        return <PropertyTypeStep formData={wizard.formData} onUpdate={wizard.updateFormData} />;
      case 3:
        return <AddressStep formData={wizard.formData} onUpdate={wizard.updateFormData} />;
      case 4:
        return <FloorAreaStep formData={wizard.formData} onUpdate={wizard.updateFormData} />;
      case 5:
        return <RoomsStep formData={wizard.formData} onUpdate={wizard.updateFormData} />;
      case 6:
        return <FloorElevatorStep formData={wizard.formData} onUpdate={wizard.updateFormData} />;
      case 7:
        return <ConditionStep formData={wizard.formData} onUpdate={wizard.updateFormData} />;
      case 8:
        return <AccessoriesStep formData={wizard.formData} onUpdate={wizard.updateFormData} />;
      case 9:
        return <YearsStep formData={wizard.formData} onUpdate={wizard.updateFormData} />;
      case 10:
        return <HeatingStep formData={wizard.formData} onUpdate={wizard.updateFormData} />;
      case 11:
        return <PhotosStep formData={wizard.formData} onUpdate={wizard.updateFormData} sessionId={wizard.sessionId} />;
      default:
        return null;
    }
  };

  const handleClose = () => {
    if (isSuccess) {
      wizard.resetWizard();
    }
    setIsSuccess(false);
    onClose?.();
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success mx-auto mb-4">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Ďakujeme!</h3>
        <p className="text-muted-foreground mb-6">
          Váš dopyt bol úspešne odoslaný. Budeme vás kontaktovať s odhadom hodnoty vašej nehnuteľnosti.
        </p>
        <Button onClick={handleClose} className="w-full">
          Zavrieť
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <WizardProgress 
        currentStep={wizard.currentStep} 
        totalSteps={wizard.totalVisibleSteps} 
      />

      {/* Step content - fixed height container */}
      <div className="min-h-[350px]">
        {renderStep()}
      </div>

      {/* Navigation */}
      <WizardNavigation
        currentStep={wizard.currentStep}
        totalSteps={wizard.totalVisibleSteps}
        canGoBack={wizard.currentStep > 1}
        canGoForward={isCurrentStepValid()}
        isSubmitting={wizard.isSubmitting}
        isSaving={wizard.isSaving}
        onBack={wizard.prevStep}
        onNext={wizard.nextStep}
        onSubmit={wizard.submitWizard}
      />
    </div>
  );
}
