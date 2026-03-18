import { Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import logoRealfoto from "@/assets/logo-realfoto.svg";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-6">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logoRealfoto} alt="RealFoto" className="h-8 w-auto" />
            <span className="text-base font-bold text-background">RealFoto</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-background/60">
            <span>© {new Date().getFullYear()} RealFoto</span>
            <a href="#" className="hover:text-background transition-colors">Ochrana súkromia</a>
            <a href="#" className="hover:text-background transition-colors">Podmienky</a>
            <Link to="/install" className="hover:text-background transition-colors inline-flex items-center gap-1">
              <Smartphone className="h-3 w-3" />
              Appka
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
