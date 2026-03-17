import { useEffect, useState } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

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

        <p className="text-muted-foreground text-sm sm:text-base mb-8">
          Ďakujeme za nákup. Vaše kredity boli pripísané na váš účet.
          Na email vám príde potvrdenie objednávky.
        </p>

        <Button
          size="lg"
          onClick={() => navigate("/pre-fotografov")}
          className="w-full font-bold"
        >
          Pokračovať
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
