

## Mobile Comparison Table Redesign

The current layout stacks two full cards vertically on mobile, making direct comparison impossible. The goal is a side-by-side layout on mobile that lets users compare row-by-row.

### Approach

**Mobile (below `sm`)**: Replace the two separate cards with a unified comparison table layout:
- **Header row**: Two columns — "FotoReal AI" (with price 0,70€) | "Fotograf" (with price 8–15€)
- **Feature rows**: Each row spans both columns with a check/x icon per side and shared feature label in the middle, or two compact columns showing the FotoReal pro vs Photographer con side by side
- Remove the BeforeAfterSlider and the grey placeholder image on mobile (they take too much space and don't aid comparison)
- Keep the "ODPORÚČANÉ" badge on the FotoReal column header

**Desktop (`sm+`)**: Keep the existing two-card layout unchanged using `hidden sm:grid` / `sm:hidden`.

### Structure (mobile only)

```text
┌─────────────┬─────────────┐
│ FotoReal AI │  Fotograf   │
│  0,70 €     │  8–15 €     │
├─────────────┼─────────────┤
│ ✓ 30 sekúnd │ ✗ 24-48 hod │
│ ✓ 24/7      │ ✗ Rozvrh    │
│ ✓ 9 úprav   │ ✗ Základné  │
│ ✓ Kvalita   │ ✗ Rôzna     │
│ ✓ GDPR      │ ✗ Žiadna    │
│ ✓ 50+ foto  │ ✗ Max 10-20 │
└─────────────┴─────────────┘
```

### Changes

**`src/components/sections/lp-a/PricingComparisonA.tsx`**:
1. Define paired comparison rows array (FotoReal pro + Photographer con per row)
2. Add a mobile-only (`sm:hidden`) comparison table with:
   - Two-column sticky header with names + prices
   - Compact rows with small text, check/x icons, minimal padding
   - FotoReal column gets subtle primary/5 background tint
3. Wrap existing card grid with `hidden sm:grid` so it only shows on desktop
4. Keep savings calculator as-is (already works well on mobile)

