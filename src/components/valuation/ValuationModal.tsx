import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ValuationWizard } from "@/components/valuation/ValuationWizard";

interface ValuationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ValuationModal({ isOpen, onClose }: ValuationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="pb-2 sm:pb-4">
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            Získajte odhad hodnoty
          </DialogTitle>
          <p className="text-sm sm:text-base text-muted-foreground">
            100% zdarma. Bez záväzkov.
          </p>
        </DialogHeader>

        <ValuationWizard onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
