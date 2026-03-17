import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FloatingCTAProps {
  onClick?: () => void;
  isVisible?: boolean;
}

export function FloatingCTA({ onClick, isVisible = true }: FloatingCTAProps) {
  const navigate = useNavigate();
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-gradient-to-t from-background via-background to-transparent lg:hidden">
      <Button
        size="lg"
        onClick={onClick || (() => navigate('/login'))}
        className="w-full group font-bold shadow-glow hover:shadow-lg transition-all py-4"
      >
        Vyskúšať 5 fotiek ZADARMO
        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
