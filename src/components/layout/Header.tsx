import { useState, useEffect } from "react";
import { Menu, ArrowRight, LogIn } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import LogoRealfoto from "@/components/LogoRealfoto";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { label: "Funkcie", href: "/funkcie" },
  { label: "Cenník", href: "/cennik" },
  { label: "Referencie", href: "/referencie" },
  { label: "Kontakt", href: "/kontakt" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2 group shrink-0"
          >
            <LogoRealfoto className="h-10 sm:h-12 w-auto" />
            <span className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">RealFoto</span>
          </a>

          {/* Desktop nav links — centered */}
          <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3.5 py-2 text-sm font-medium transition-colors rounded-md ${
                  location.pathname === link.href
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop buttons */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
              className="font-medium"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Prihlásiť sa
            </Button>
            <Button
              onClick={() => navigate('/login')}
              className="group font-bold"
            >
              Vyskúšať ZADARMO
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Otvoriť menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-1 mt-10">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                      location.pathname === link.href
                        ? "text-primary bg-primary/5"
                        : "text-foreground hover:bg-accent/50"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-border my-3" />
                <Button
                  onClick={() => { setIsOpen(false); navigate('/login'); }}
                  className="w-full group font-bold"
                >
                  Vyskúšať ZADARMO
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => { setIsOpen(false); navigate('/login'); }}
                  className="w-full font-medium"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Prihlásiť sa
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
