import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Blog() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20 sm:pt-24">
        <div className="section-container py-20 sm:py-32 text-center max-w-2xl mx-auto">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Blog
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mb-8 max-w-md mx-auto">
            Čoskoro tu nájdete články o fotografovaní nehnuteľností, tipy na lepší predaj a novinky z RealFoto.
          </p>
          <Button onClick={() => navigate("/")} variant="outline" className="font-medium">
            Späť na hlavnú stránku
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
