import { Wand2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-6">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <Wand2 className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-sm">
              Foto<span className="text-primary">Real</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-background/60">
            <span>© {new Date().getFullYear()} FotoReal</span>
            <a href="#" className="hover:text-background transition-colors">Ochrana súkromia</a>
            <a href="#" className="hover:text-background transition-colors">Podmienky</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
