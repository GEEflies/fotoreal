import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20 sm:pt-24">
        <div className="section-container py-12 sm:py-20 max-w-3xl mx-auto">
          <div className="mb-10">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Právne dokumenty</p>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Všeobecné obchodné podmienky
            </h1>
            <p className="text-sm text-muted-foreground">Platné od 19. marca 2026</p>
          </div>

          <div className="prose prose-neutral max-w-none space-y-8 text-foreground">

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">1. Prevádzkovateľ služby</h2>
              <p className="text-muted-foreground leading-relaxed">
                Službu RealFoto prevádzkuje spoločnosť <strong>RealFoto</strong>, Bratislava, Slovensko.
              </p>
              <ul className="mt-3 space-y-1 text-muted-foreground">
                <li>Email: <a href="mailto:info@realfoto.sk" className="text-primary hover:underline">info@realfoto.sk</a></li>
                <li>Telefón: <a href="tel:+421911911288" className="text-primary hover:underline">0911 911 288</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">2. Predmet služby</h2>
              <p className="text-muted-foreground leading-relaxed">
                RealFoto je online nástroj na profesionálnu AI úpravu fotografií nehnuteľností. Služba je dostupná prostredníctvom webového prehliadača a PWA aplikácie (inštalovateľná na mobilné zariadenie).
              </p>
              <p className="text-muted-foreground leading-relaxed mt-2">
                Každý nový registrovaný používateľ získa <strong>5 kreditov zadarmo</strong>. Ďalšie kredity je možné zakúpiť podľa aktuálneho cenníka.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">3. Kreditový systém</h2>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc list-inside">
                <li><strong>1 kredit = 1 spracovaná fotografia</strong></li>
                <li>Kredity sa odpočítajú pri zahájení spracovania, nie až po jeho dokončení</li>
                <li>Kredity <strong>nemajú dátum expirácie</strong> — zostatok zostáva na účte neobmedzene</li>
                <li>Kredity sú <strong>neprenositeľné</strong> medzi účtami</li>
                <li>V prípade technickej chyby na strane RealFoto vrátime kredity po individuálnom posúdení</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">4. Platby a cenník</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Platby spracúva <strong>Stripe</strong>. Čísla platobných kariet RealFoto nezískava ani neukladá. Všetky ceny sú v eurách (EUR).
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-muted-foreground border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-4 font-semibold text-foreground">Fotografie</th>
                      <th className="text-left py-2 pr-4 font-semibold text-foreground">Cena</th>
                      <th className="text-left py-2 font-semibold text-foreground">Cena / fotka</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr><td className="py-2 pr-4">20 fotiek</td><td className="py-2 pr-4">14 €</td><td className="py-2">0,70 €</td></tr>
                    <tr><td className="py-2 pr-4">40 fotiek</td><td className="py-2 pr-4">26 €</td><td className="py-2">0,65 €</td></tr>
                    <tr><td className="py-2 pr-4">80 fotiek</td><td className="py-2 pr-4">48 €</td><td className="py-2">0,60 €</td></tr>
                    <tr><td className="py-2 pr-4">160 fotiek</td><td className="py-2 pr-4">87 €</td><td className="py-2">0,54 €</td></tr>
                    <tr><td className="py-2 pr-4">320 fotiek</td><td className="py-2 pr-4">165 €</td><td className="py-2">0,52 €</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Platba je <strong>jednorazová</strong> (nie predplatné). Kredity sú pripísané automaticky po úspešnej platbe. Ak ste neboli prihlásení v čase platby, kredity sa pripíšu pri najbližšom prihlásení tým istým emailom.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">5. Vrátenie platby</h2>
              <p className="text-muted-foreground leading-relaxed">
                Nevyužité kredity je možné vrátiť do <strong>14 dní</strong> od dátumu nákupu. Na vrátenie nás kontaktujte na <a href="mailto:info@realfoto.sk" className="text-primary hover:underline">info@realfoto.sk</a> s číslom platobnej relácie (nájdete ho v potvrdzovacom emaili od Stripe).
              </p>
              <p className="text-muted-foreground leading-relaxed mt-2">
                Čiastočné vrátenie za zostatok kreditov (po čiastočnom využití balíka) nie je možné. Po uplynutí 14-dňovej lehoty vrátenie neposkytujeme.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">6. Vlastníctvo fotografií a autorské práva</h2>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Nahraté fotografie zostávajú <strong>výhradným majetkom používateľa</strong></li>
                <li>Spracované (AI upravené) fotografie patria používateľovi</li>
                <li>RealFoto nevyužíva vaše fotografie na reklamné ani iné účely</li>
                <li>Fotografie sú odovzdané sprostredkovateľom (Supabase, Google Gemini) výhradne za účelom poskytnutia služby</li>
                <li>Používateľ zodpovedá za to, že disponuje právom nahrávať a spracovávať dané fotografie</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">7. Prijateľné použitie</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">Zakazuje sa:</p>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Nahrávať obsah porušujúci autorské práva alebo práva tretích osôb</li>
                <li>Nahrávať fotografie identifikovateľných osôb bez ich súhlasu</li>
                <li>Používať službu na vytváranie zavádzajúceho alebo podvodného obsahu</li>
                <li>Automatizovane zneužívať API alebo obchádzať kreditový systém</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-2">
                Porušenie týchto pravidiel môže viesť k okamžitému zrušeniu účtu bez náhrady.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">8. Dostupnosť služby</h2>
              <p className="text-muted-foreground leading-relaxed">
                Snažíme sa zabezpečiť nepretržitú dostupnosť služby, avšak negarantujeme 100 % dostupnosť. Výpadky súvisiace s infraštruktúrou Supabase, Google Gemini API alebo Stripe sú mimo nášho priameho vplyvu. V prípade dlhšieho výpadku spôsobeného na našej strane posúdime vrátenie kreditov individuálne na základe žiadosti.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">9. Zánik účtu</h2>
              <p className="text-muted-foreground leading-relaxed">
                Účet môžete kedykoľvek zrušiť zaslaním žiadosti na <a href="mailto:info@realfoto.sk" className="text-primary hover:underline">info@realfoto.sk</a>. Po zrušení budú vaše dáta vymazané do 30 dní, s výnimkou platobných záznamov uchovávaných zo zákonných dôvodov.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-2">
                Vyhrazujeme si právo zrušiť účty, ktoré porušujú tieto podmienky, bez predchádzajúceho upozornenia.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">10. Obmedzenie zodpovednosti</h2>
              <p className="text-muted-foreground leading-relaxed">
                RealFoto nezodpovedá za škody vzniknuté v dôsledku výpadku služby, nedostatočnej kvality AI spracovania alebo straty dát zavinenými tretími stranami (Supabase, Google, Stripe). Maximálna zodpovednosť RealFoto voči jednému používateľovi je obmedzená na výšku posledného nákupu kreditov.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">11. Rozhodné právo</h2>
              <p className="text-muted-foreground leading-relaxed">
                Tieto podmienky sa riadia právom Slovenskej republiky. Prípadné spory budú riešené príslušným súdom v Slovenskej republike.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">12. Zmeny podmienok</h2>
              <p className="text-muted-foreground leading-relaxed">
                O podstatných zmenách podmienok vás informujeme emailom alebo upozornením v aplikácii aspoň <strong>14 dní vopred</strong>. Pokračovaním v používaní služby po nadobudnutí účinnosti zmien vyjadrujete súhlas s novými podmienkami.
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
