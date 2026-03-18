import LogoRealfoto from "@/components/LogoRealfoto";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-6">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <LogoRealfoto className="h-8 w-auto" />
            <span className="text-base font-bold text-background">RealFoto</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-background/60">
            <span>© {new Date().getFullYear()} RealFoto</span>
            <a href="#" className="hover:text-background transition-colors">Ochrana súkromia</a>
            <a href="#" className="hover:text-background transition-colors">Podmienky</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
