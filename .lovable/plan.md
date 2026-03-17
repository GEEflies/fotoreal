

## Mobile Pricing Section Optimization Plan

### Current Issues
- The blue (primary) info box has a large `text-3xl` price that competes with the green CTA button
- Savings strip has `·` separator between photographer price and property count
- "Ušetríte X%" is inline text, not a badge
- Savings strip text is left-aligned

### Changes (all in `PricingPackagesA.tsx`)

**1. Blue info box (mobile) — De-emphasize price, keep as metadata**
- Remove the large `text-3xl` price and `€` symbol from the left side
- Instead, show all info in the grid as equal-weight metadata: Cena/fotka, Fotiek, Cca nehnuteľnosti
- Price is already clearly visible on the green CTA button, so no need to repeat it prominently

**2. Savings strip — Remove `·`, center text, badge for savings**
- Remove the `·` between photographer price and property count (replace with line break or space)
- Center-align the entire savings strip text
- Move "Ušetríte X%" to bottom-right as a styled badge (`bg-success text-white rounded-full px-2 py-0.5`)
- Use `relative` positioning on the strip container with the badge `absolute bottom-right`

### Specific Code Changes

**Lines 148-173** (mobile blue box): Replace the price-dominant layout with a simple centered grid showing only Cena/fotka, Fotiek, and Cca properties — no large price number.

**Lines 176-190** (savings strip): 
- Change to `relative text-center` layout
- Remove `·` from the photographer line, put property count on same line without dot
- Position "Ušetríte X%" as an absolute-positioned badge in bottom-right corner with `bg-success text-white text-[10px] font-bold rounded-full px-2 py-0.5`

