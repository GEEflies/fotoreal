import { Link } from "react-router-dom";
import logoRealfoto from "@/assets/logo-realfoto.svg";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      <div className="section-container py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logoRealfoto} alt="RealFoto" className="h-9 w-auto" />
              <span className="text-lg font-bold text-background">RealFoto</span>
            </Link>
            <p className="text-sm text-background/60 leading-relaxed mb-5 max-w-xs">
              AI úprava fotografií nehnuteľností. Profesionálne fotky za 30 sekúnd bez fotografa.
            </p>
            {/* App download badges */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-background/40 uppercase tracking-wider">Stiahnuť appku</p>
              <div className="flex gap-2">
                <Link
                  to="/install"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-background/10 hover:bg-background/15 border border-background/10 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-background" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-[9px] text-background/50 leading-none">Dostupné na</p>
                    <p className="text-xs font-semibold text-background leading-tight">App Store</p>
                  </div>
                </Link>
                <Link
                  to="/install"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-background/10 hover:bg-background/15 border border-background/10 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-background" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 010 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-[9px] text-background/50 leading-none">Získať na</p>
                    <p className="text-xs font-semibold text-background leading-tight">Google Play</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Produkt */}
          <div>
            <h3 className="text-sm font-bold text-background mb-4">Produkt</h3>
            <ul className="space-y-2.5">
              <li><Link to="/funkcie" className="text-sm text-background/60 hover:text-background transition-colors">Funkcie</Link></li>
              <li><Link to="/cennik" className="text-sm text-background/60 hover:text-background transition-colors">Cenník</Link></li>
              <li><Link to="/referencie" className="text-sm text-background/60 hover:text-background transition-colors">Referencie</Link></li>
              <li><Link to="/blog" className="text-sm text-background/60 hover:text-background transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Firma */}
          <div>
            <h3 className="text-sm font-bold text-background mb-4">Firma</h3>
            <ul className="space-y-2.5">
              <li><Link to="/o-nas" className="text-sm text-background/60 hover:text-background transition-colors">O nás</Link></li>
              <li><Link to="/kontakt" className="text-sm text-background/60 hover:text-background transition-colors">Kontakt</Link></li>
              <li><a href="#" className="text-sm text-background/60 hover:text-background transition-colors">Ochrana súkromia</a></li>
              <li><a href="#" className="text-sm text-background/60 hover:text-background transition-colors">Obchodné podmienky</a></li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="text-sm font-bold text-background mb-4">Kontakt</h3>
            <ul className="space-y-3">
              <li>
                <a href="tel:+421911911288" className="flex items-center gap-2 text-sm text-background/60 hover:text-background transition-colors">
                  <Phone className="h-4 w-4 shrink-0" />
                  0911 911 288
                </a>
              </li>
              <li>
                <a href="mailto:info@realfoto.sk" className="flex items-center gap-2 text-sm text-background/60 hover:text-background transition-colors">
                  <Mail className="h-4 w-4 shrink-0" />
                  info@realfoto.sk
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2 text-sm text-background/60">
                  <MapPin className="h-4 w-4 shrink-0" />
                  Bratislava, Slovensko
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/10">
        <div className="section-container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-background/40">
          <span>© {currentYear} RealFoto. Všetky práva vyhradené.</span>
          <span>Vyrobené s ❤️ na Slovensku</span>
        </div>
      </div>
    </footer>
  );
}
