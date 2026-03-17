

## Problem

The dropdown menu has `z-50` but it still appears behind the next section ("RECENZIE"). This happens because the **parent `<section>` element** doesn't establish a stacking context with a z-index, so the dropdown's `z-50` only applies within the section's own stacking context. The next section's content naturally paints on top.

## Solution

Add `relative z-10` to the pricing `<section>` element (line 29). This elevates the entire section above subsequent sections in the document flow, allowing the `z-50` dropdown inside it to properly overlap content below.

**File:** `src/components/sections/lp-a/PricingPackagesA.tsx`  
**Line 29:** Change `className="section-padding bg-background"` → `className="section-padding bg-background relative z-10"`

Single line change — no other modifications needed.

