import { useState, useEffect } from "react";
import { Menu, ArrowRight, Wand2, Eraser, LogIn } from "lucide-react";
import logoFotoreal from "@/assets/logo-fotoreal.svg";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { href: "#domov", label: "Domov" },
  { href: "#vylepsit", label: "Vylepšiť", icon: Wand2 },
  { href: "#odstranit", label: "Odstrániť", icon: Eraser },
];

interface HeaderProps {
  onOpenForm?: () => void;
}

export function Header({ onOpenForm }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-card border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="section-container">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo */}
          <a
            href="#domov"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#domov");
            }}
            className="flex items-center gap-2 group"
          >
            <img src={logoFotoreal} alt="FotoReal" className="h-8 w-auto" />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted flex items-center gap-1.5"
              >
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onOpenForm}
              className="hidden lg:flex items-center gap-2 font-medium"
            >
              <LogIn className="h-4 w-4" />
              Prihlásiť sa
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Otvoriť menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <nav className="flex flex-col gap-2 mt-10">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(link.href);
                      }}
                      className="px-4 py-3 text-base font-semibold text-foreground hover:text-primary hover:bg-muted rounded-xl transition-colors flex items-center gap-2"
                    >
                      {link.icon && <link.icon className="h-5 w-5" />}
                      {link.label}
                    </a>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false);
                      onOpenForm?.();
                    }}
                    className="mt-4 w-full font-medium"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Prihlásiť sa
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
