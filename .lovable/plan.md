

## Replace Dashboard Credits with LP-style Pricing Widget

The current `/dashboard/credits` page uses a grid of individual cards. The LP uses a single compact dropdown selector with a green CTA — much cleaner. We'll replace the packages grid with the same pattern.

### Changes

**`src/pages/dashboard/DashboardCredits.tsx`** — Replace the card grid (lines 61-103) with the LP-style dropdown selector component:
- Same `PACKAGES` data with `ppp`, `properties`, `discount` fields (matching `PricingPackagesA`)
- Dropdown button showing selected package with photo count, discount badge, property estimate, price, and per-photo cost
- Expandable options list on click
- Savings strip comparing to photographer cost
- Green CTA button calling `handlePurchase` (or Stripe checkout when ready)
- Keep the balance card at top and the footer text
- Remove the scroll animation (not needed in dashboard context), but keep all the visual styling (rounded-2xl border, dropdown, savings strip, green button)

This is essentially extracting the inner widget from `PricingPackagesA` and embedding it in the dashboard page, swapping `handleCheckout` for the existing `handlePurchase` logic.

