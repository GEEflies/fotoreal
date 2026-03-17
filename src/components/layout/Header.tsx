import { useState, useEffect } from "react";
import { Menu, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logo from "@/assets/logo.svg";

const navLinks = [
  { href: "#co-dostanete", label: "Čo dostanete" },
  { href: "#ako-to-funguje", label: "Ako to funguje" },
  { href: "#faq", label: "FAQ" },
  { href: "#kontakt", label: "Kontakt" },
];

interface HeaderProps {
  onOpenForm: () => void;
}

export function Header({ onOpenForm }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
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
        <div className="flex h-[72px] sm:h-20 lg:h-20 items-center justify-between">
          {/* Logo */}
          <a
            href="#domov"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#domov");
            }}
            className="flex items-center gap-3 group"
          >
            <img
              src={logo}
              alt="NehnuteľnostiBratislava"
              className="h-11 w-11 sm:h-12 sm:w-12"
            />

            <span className="font-heading font-bold leading-[1.05] text-foreground group-hover:text-primary transition-colors">
              <span className="sm:hidden text-sm">Nehnuteľnosti</span>
              <span className="sm:hidden text-sm text-primary">Bratislava</span>

              <span className="hidden sm:inline text-base">
                Nehnuteľnosti<span className="text-primary">Bratislava</span>
              </span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="flex items-center gap-3">
            <Button
              onClick={onOpenForm}
              className="hidden lg:flex group font-bold shadow-glow hover:shadow-lg transition-all px-4"
            >
              <span className="hidden xl:inline">Získať ocenenie + PDF návod ZDARMA</span>
              <span className="xl:hidden">Získať ocenenie ZDARMA</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="h-16 w-16">
                  <Menu className="h-10 w-10" />
                  <span className="sr-only">Otvoriť menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[360px]">
                <nav className="flex flex-col gap-3 mt-10">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(link.href);
                      }}
                      className="px-4 py-4 text-lg font-semibold text-foreground hover:text-primary hover:bg-muted rounded-xl transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                  <Button
                    size="lg"
                    onClick={() => {
                      setIsOpen(false);
                      onOpenForm();
                    }}
                    className="mt-6 w-full group font-bold shadow-glow hover:shadow-lg transition-all px-4"
                  >
                    Získať ocenenie ZDARMA
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
