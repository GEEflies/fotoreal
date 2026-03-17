import { useEffect, useState } from "react";
import { CheckCircle2, ArrowRight, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserAuth } from "@/hooks/use-user-auth";
import { useClaimPurchases } from "@/hooks/use-claim-purchases";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { user, isLoading: authLoading } = useUserAuth();
  const { claimPurchases } = useClaimPurchases();
  const [hasClaimed, setHasClaimed] = useState(false);

  // Auto-claim purchases when user is authenticated
  useEffect(() => {
    if (user && !hasClaimed) {
      setHasClaimed(true);
      claimPurchases();
    }
  }, [user, hasClaimed, claimPurchases]);

  const isLoggedIn = !!user;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(circle at center, hsl(244 95% 10%) 0%, hsl(244 95% 5%) 60%)",
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-card shadow-2xl p-8 sm:p-10 text-center animate-scale-in">
        <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
          <CheckCircle2 className="h-9 w-9 text-success" />
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
          Platba úspešná!
        </h1>

        {isLoggedIn ? (
          <>
            <p className="text-muted-foreground text-sm sm:text-base mb-8">
              Ďakujeme za nákup. Vaše kredity boli pripísané na váš účet.
              Na email vám príde potvrdenie objednávky.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/dashboard/credits")}
              className="w-full font-bold"
            >
              Pokračovať do aplikácie
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <p className="text-muted-foreground text-sm sm:text-base mb-8">
              Ďakujeme za nákup! Prihláste sa alebo sa zaregistrujte
              pre pripísanie kreditov na váš účet.
            </p>
            <Button
              size="lg"
              onClick={() => navigate(`/login?redirect=/platba-uspesna${sessionId ? `&session_id=${sessionId}` : ""}`)}
              className="w-full font-bold"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Prihlásiť sa
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
