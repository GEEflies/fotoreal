

## Mobile Optimization: PricingPackagesA

### Changes in `src/components/sections/lp-a/PricingPackagesA.tsx`

**1. Dropdown rows** — Restructure to two-line layout on mobile:
- Line 1: `{photos} fotiek` + discount badge … `{price} €` (right-aligned)
- Line 2: `~{properties} nehnuteľností` … `({ppp} € / ks)` (right-aligned, smaller muted text)
- Slightly increase row padding

**2. Savings strip** — Stack vertically on mobile:
- Use `flex-col sm:flex-row` so photographer price and savings % don't squeeze together
- Keep horizontal on desktop

**3. Quick-select chips** — Tighter gap on mobile: `gap-2 sm:gap-4`

**4. Price hero mobile block** — Reduce padding from `p-4` to `p-3` for tighter fit

