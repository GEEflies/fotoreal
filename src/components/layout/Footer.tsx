import logoFotoreal from "@/assets/logo-fotoreal.svg";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-6">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logoFotoreal} alt="FotoReal" className="h-6 w-auto" />
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
