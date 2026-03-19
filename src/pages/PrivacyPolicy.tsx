import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SEO } from "@/components/SEO";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Ochrana osobných údajov"
        description="Zásady ochrany osobných údajov služby RealFoto. GDPR súlad a ochrana súkromia."
        path="/ochrana-sukromia"
        breadcrumbs={[
          { name: "Domov", path: "/" },
          { name: "Ochrana súkromia", path: "/ochrana-sukromia" },
        ]}
      />
      <Header />
      <main className="flex-1 pt-20 sm:pt-24">
        <div className="section-container py-12 sm:py-20 max-w-3xl mx-auto">
          <div className="mb-10">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Právne dokumenty</p>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Ochrana osobných údajov
            </h1>
            <p className="text-sm text-muted-foreground">Platné od 19. marca 2026</p>
          </div>

          <div className="prose prose-neutral max-w-none space-y-8 text-foreground">

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">1. Prevádzkovateľ</h2>
              <p className="text-muted-foreground leading-relaxed">
                Prevádzkovateľom vašich osobných údajov je spoločnosť <strong>RealFoto</strong>, so sídlom v Bratislave, Slovensko.
              </p>
              <ul className="mt-3 space-y-1 text-muted-foreground">
                <li>Email: <a href="mailto:info@realfoto.sk" className="text-primary hover:underline">info@realfoto.sk</a></li>
                <li>Telefón: <a href="tel:+421911911288" className="text-primary hover:underline">0911 911 288</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">2. Aké údaje zbierame</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <div>
                  <p className="font-medium text-foreground mb-1">Registrácia a prihlásenie</p>
                  <p>Emailová adresa, heslo (uložené výhradne vo forme hashu cez Supabase Auth). Pri prihlásení cez Google získame meno, emailovú adresu a profilovú fotografiu z vášho Google účtu.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Firemný profil</p>
                  <p>Názov firmy, IČO, DIČ, IČ DPH, adresa sídla, firemné logo (všetko voliteľné — vypĺňate len ak chcete vodoznak na fotografiách).</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Fotografie nehnuteľností</p>
                  <p>Nahrané originálne fotografie a spracované verzie sú uložené v zabezpečenom úložisku. Fotografie sú prístupné len vám a sú nevyhnutné na poskytnutie služby.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Platobné údaje</p>
                  <p>Ukladáme ID platobnej relácie Stripe, emailovú adresu, počet zakúpených fotiek, sumu a stav platby. Číslo platobnej karty nezískavame ani neukladáme — spracúva ho výhradne Stripe.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Kontaktný formulár</p>
                  <p>Meno, emailová adresa, telefónne číslo (voliteľné) a text správy.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Technické údaje</p>
                  <p>Autentifikačné tokeny (uložené v localStorage vášho prehliadača) potrebné na udržanie prihlásenia.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">3. Na aký účel spracúvame údaje</h2>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Poskytovanie služby — spracovanie fotografií, správa kreditov, realizácia platieb</li>
                <li>Komunikácia so zákazníkom — odpovede na otázky, notifikácie o stave objednávky</li>
                <li>Ochrana pred podvodom a zneužitím služby</li>
                <li>Plnenie zákonných povinností (uchovávanie účtovných dokladov)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">4. Tretie strany — sprostredkovatelia</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <div>
                  <p className="font-medium text-foreground mb-1">Supabase (supabase.com)</p>
                  <p>Databáza, autentifikácia a úložisko súborov. Servery sa nachádzajú v regióne eu-central-1 (Frankfurt, Nemecko) v rámci EÚ.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Stripe (stripe.com)</p>
                  <p>Spracovanie platieb. Stripe disponuje certifikáciou PCI DSS úrovne 1. Platobné údaje karty nikdy neopustia infraštruktúru Stripe.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Google (google.com)</p>
                  <p>Spracovanie fotografií pomocou Gemini AI (analýza a úprava). Fotografie sú odosielané na servery Google len na dobu nevyhnutnú na spracovanie a nie sú uchovávané ani použité na trénovanie modelov v rámci API. Ďalej Google Identity Services pre prihlásenie cez Google účet.</p>
                </div>
                <p className="text-sm bg-muted rounded-lg px-4 py-3">
                  <strong>Nevyužívame</strong> žiadne analytické nástroje (Google Analytics, Facebook Pixel a pod.), sledovacie cookies ani remarketing.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">5. Uchovávanie údajov</h2>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc list-inside">
                <li><strong>Účet a fotografie:</strong> po celú dobu existencie účtu; po zrušení účtu do 30 dní</li>
                <li><strong>Platobné záznamy:</strong> minimálne 5 rokov v súlade so zákonom o účtovníctve</li>
                <li><strong>Správy z kontaktného formulára:</strong> maximálne 2 roky</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">6. Vaše práva (GDPR)</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">Ako dotknutá osoba máte právo:</p>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc list-inside">
                <li><strong>Prístupu</strong> — vedieť, aké údaje o vás spracúvame</li>
                <li><strong>Opravy</strong> — opraviť nepresné alebo neúplné údaje</li>
                <li><strong>Vymazania</strong> — požiadať o zmazanie účtu a všetkých dát (právo byť zabudnutý)</li>
                <li><strong>Prenositeľnosti</strong> — získať kópiu svojich dát v strojovo čitateľnom formáte</li>
                <li><strong>Namietania</strong> — namietať spracúvanie na základe oprávneného záujmu</li>
                <li><strong>Sťažnosti</strong> — podať podnet na <a href="https://dataprotection.gov.sk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Úrad na ochranu osobných údajov SR</a></li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Na uplatnenie práv nás kontaktujte na <a href="mailto:info@realfoto.sk" className="text-primary hover:underline">info@realfoto.sk</a>. Žiadosti vybavujeme do 30 dní.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">7. Cookies a lokálne úložisko</h2>
              <p className="text-muted-foreground leading-relaxed">
                Nevyužívame sledovacie cookies. Supabase Auth ukladá autentifikačné tokeny do <code className="text-sm bg-muted px-1 py-0.5 rounded">localStorage</code> vášho prehliadača — tieto sú nevyhnutné na fungovanie prihlásenia a nie sú zdieľané s tretími stranami.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">8. Zmeny tohto dokumentu</h2>
              <p className="text-muted-foreground leading-relaxed">
                O podstatných zmenách vás informujeme emailom alebo upozornením v aplikácii najmenej 14 dní vopred. Aktuálna verzia je vždy dostupná na tejto stránke.
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
