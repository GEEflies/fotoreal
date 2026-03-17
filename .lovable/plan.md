

## Optimize Header for Landing Pages

Currently the header has only one action button ("Prihlásiť sa" / outline). For a landing page, the primary CTA should be prominent and conversion-focused, with login as a secondary action.

### Changes to `src/components/layout/Header.tsx`

**Desktop (right side):**
- **Secondary button** (ghost/text style): "Prihlásiť sa" with LogIn icon — navigates to `/login`
- **Primary CTA button** (filled, default variant): "Vyskúšať ZADARMO" with ArrowRight icon — navigates to `/login` (or scrolls to signup)

**Mobile sheet:**
- Same two buttons at bottom of nav: primary CTA full-width on top, login outline below

**Other cleanup:**
- Remove the `onOpenForm` prop (currently unused on landing pages — all CTAs navigate to `/login`)
- Add `useNavigate` for routing
- Remove nav links that don't exist on the landing pages (the `#vylepsit` and `#odstranit` anchors don't have matching sections on LP-A/LP-B) — simplify to just logo + right-side buttons

### Result
```text
[Logo RealFoto]                    [Prihlásiť sa]  [Vyskúšať ZADARMO →]
                                    ghost/text         filled primary
```

