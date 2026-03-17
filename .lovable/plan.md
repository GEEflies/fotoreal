

## Problem

The breakdown section looks like an invoice for 800€ because the photographer's crossed-out price (920€) dominates visually. The savings message gets lost. The CTA button is blue (default primary) instead of green which converts better.

## Plan

### 1. Redesign the breakdown section to feel lightweight, not like a bill

- **Remove the detailed "Počet kreditov / Cena za kus / Zľava / Celkom" invoice-style breakdown** — it's redundant since the dropdown already shows all that info. Replace with a clean, prominent price display: big price + small per-photo cost underneath.
- **Restructure the savings comparison** to be a compact single-line or badge-style element rather than a full itemized receipt. Something like a horizontal bar: `Fotograf: ~~920€~~ → FotoReal: 48€ — Ušetríte 872€`
- **Make the total price the hero** of the card, not the savings math.

### 2. Green CTA button

- Change the "Kúpiť za X €" button from `bg-primary` (blue) to a green color using the existing `--success` token (`hsl(142 71% 45%)`).
- Apply inline className override: `bg-success hover:bg-success/90 text-white` with a green glow shadow.

### 3. Revised card layout (top to bottom)

1. **Dropdown selector** (keep as-is — it's great)
2. **Price hero block** — Large price (e.g. "48 €"), small subtitle "0.59 € za fotku · 80 kreditov"
3. **Savings badge** — Compact green-bordered strip: "Ušetríte 95% oproti fotografovi (872 €)"
4. **Green CTA button** — "Kúpiť za 48 €"
5. **Trust line** — "Kredity nevypršia · Bezpečná platba"

### 4. Keep the quick-select chips at bottom

No changes needed there.

### Technical scope

- Single file edit: `src/components/sections/lp-a/PricingPackagesA.tsx`
- No new dependencies, just restructured JSX and Tailwind classes

