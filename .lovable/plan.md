

## Redesign PricingPackagesA — clean layout + photographer savings with price range

### What changes

Single file: `src/components/sections/lp-a/PricingPackagesA.tsx`

### New card layout (top to bottom)

1. **Dropdown selector** — keep as-is, works great
2. **Price hero** — Big `48 €` centered, subtitle `0.59 € za fotku · 80 kreditov`
3. **Savings strip** — Compact green box showing:
   - `~{properties} nehnuteľnosti` + crossed-out red range `{low}–{high} €` (photographer cost as range 100–300€ per photoshoot × properties)
   - Calculation: `photographerLow = properties * 100`, `photographerHigh = properties * 300`
   - e.g. for 80 photos (4 properties): ~~`400–1 200 €`~~ in red, then `→ FotoReal: 48 €`
4. **Green CTA** — `bg-success hover:bg-success/90 text-white` with green shadow
5. **Trust line** — `Kredity nevypršia · Bezpečná platba`
6. **Quick-select chips** — keep as-is

### What gets removed

- The entire invoice-style breakdown (lines 126–147: Počet kreditov, Cena za kus, Zľava, Celkom)
- The detailed savings comparison with per-photo math (lines 150–175)
- `TrendingDown` import (no longer needed)

### Savings calculation change

Instead of using `PHOTOGRAPHER_PPP = 11.5` per photo, use a **per-photoshoot range** of 100–300€:
- `photographerLow = pkg.properties * 100`
- `photographerHigh = pkg.properties * 300`

Display as: `~{properties} nehnuteľností · Fotograf: ~~{low}–{high} €~~` (red, struck through) then below `Ušetríte {savingsPercent}%` using midpoint for percentage.

