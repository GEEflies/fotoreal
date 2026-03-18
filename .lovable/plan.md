

## Problem

Fotky sa načítavajú pomaly kvôli dvom hlavným problémom:

### 1. Obrovské súbory (neoptimalizované JPG z GitHub Raw)

Z network requestov vidím tieto veľkosti:
- `religh-before.jpg` — **7.4 MB** (7 435 712 bytes)
- `cc-after.jpg` — **6.1 MB** (6 122 182 bytes)  
- `cc-before.jpg` — **2.1 MB** (2 189 067 bytes)

Na stránke `/funkcie` sa načítava **18 obrázkov naraz** (9 párov pred/po), všetky plnej veľkosti. Odhadom je celkový objem stránky **50-80 MB** len v obrázkoch.

### 2. GitHub Raw CDN nie je optimálny
- Cache len 5 minút (`max-age=300`)
- Žiadna kompresia, žiadny WebP/AVIF
- Žiadny responsive sizing

### Formát
Všetky sú `.jpg` / `.jpeg`, plné rozlíšenie (pravdepodobne 4000-6000px wide). Pre karty v grids kde sa zobrazujú max ~450px wide, stačí ~900px wide (2x pre retinu).

---

## Riešenie

### Krok 1: Skonvertovať obrázky do WebP a zmenšiť
- Stiahnuť všetkých 18+ obrázkov z GitHub
- Zmenšiť na max 1200px šírku (dostatočné pre 2x retinu)
- Skonvertovať do WebP formátu (80% kvalita)
- Výsledok: z ~5 MB → ~80-150 KB per obrázok
- Uložiť do `public/landing/` priečinka

### Krok 2: Aktualizovať `src/lib/images.ts`
- Zmeniť všetky URL z GitHub raw → lokálne `/landing/...` cesty

### Krok 3: Pridať lazy loading na `BeforeAfterSlider`
- Pridať `loading="lazy"` na `<img>` tagy
- Obrázky mimo viewportu sa nebudú načítavať hneď

### Očakávaný výsledok
- Celková veľkosť stránky: z ~60 MB → ~3-4 MB
- Načítanie: z 1-2s per obrázok → okamžité

### Zmenené súbory
- `public/landing/` — 18+ nových WebP súborov
- `src/lib/images.ts` — lokálne cesty
- `src/components/ui/BeforeAfterSlider.tsx` — lazy loading

