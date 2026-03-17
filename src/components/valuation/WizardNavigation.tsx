import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  canGoBack: boolean;
  canGoForward: boolean;
  isSubmitting: boolean;
  isSaving: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function WizardNavigation({
  currentStep,
  totalSteps,
  canGoBack,
  canGoForward,
  isSubmitting,
  isSaving,
  onBack,
  onNext,
  onSubmit,
}: WizardNavigationProps) {
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex items-center justify-between pt-6 border-t border-border">
      <div>
        {canGoBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Späť
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {isSaving && (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Ukladám...
          </span>
        )}
        
        {isLastStep ? (
          <Button
            type="button"
            onClick={onSubmit}
            disabled={!canGoForward || isSubmitting}
            className="min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Odosielam...
              </>
            ) : (
              <>
                Odoslať
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNext}
            disabled={!canGoForward}
            className="min-w-[140px]"
          >
            Ďalej
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
