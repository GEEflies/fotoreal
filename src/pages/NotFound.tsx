import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search } from "lucide-react";
import logoRealfoto from "@/assets/logo-realfoto.svg";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404: User attempted to access:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="w-full border-b border-border bg-background/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); navigate("/"); }}
            className="flex items-center gap-2 group"
          >
            <img src={logoRealfoto} alt="RealFoto" className="h-10 w-auto" />
            <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              RealFoto
            </span>
          </a>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/40 via-background to-background" />

        <div className="relative z-10 text-center px-4 animate-fade-in">
          {/* Large 404 */}
          <div className="relative mb-6">
            <span className="text-[10rem] sm:text-[14rem] font-extrabold font-heading leading-none text-primary/10 select-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="h-16 w-16 sm:h-20 sm:w-20 text-primary/40" />
            </div>
          </div>

          {/* Message */}
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-3">
            Stránka sa nenašla
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto mb-8">
            Stránka <span className="font-medium text-foreground">{location.pathname}</span> neexistuje
            alebo bola presunutá.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              className="w-full sm:w-auto font-bold shadow-glow hover:shadow-lg"
              onClick={() => navigate("/")}
            >
              <Home className="h-4 w-4 mr-2" />
              Späť na úvod
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Predchádzajúca stránka
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
