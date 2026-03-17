

## Optimize Sidebar UI/UX

### 1. Rewrite `src/components/dashboard/UserLayout.tsx`

**Nav items** — Remove "Dokúpiť kredity" from nav array (only keep Nehnuteľnosti + Nová nehnuteľnosť).

**NavItem active state** — Change from solid `bg-primary text-primary-foreground` to subtle:
```
bg-primary/10 text-primary font-semibold border-l-2 border-primary rounded-l-none
```
Remove the `highlight` prop entirely. Increase padding to `py-2.5`, use `rounded-lg`, `gap-2.5`.

**New CreditWidget component** — Replace the plain text credits display (lines 59-68) with a mini widget placed between header and nav:
- Shows credit count with Sparkles icon
- Thin `<Progress>` bar (h-1.5) colored by state (primary/warning/destructive)
- Full-width green "Dokúpiť kredity" button (`bg-success`)
- Wrapped in `rounded-xl border bg-muted/50 p-3`

**Footer** — Add user email (from `user.email`) as small muted text above "Späť na web" and "Odhlásiť sa". Use `rounded-lg` and `gap-2.5` on footer links for consistency.

### 2. Clean up `src/pages/dashboard/DashboardProperties.tsx`

Remove the `CreditsBanner` import and the `useCredits` hook usage (lines 6-7, 24, 64-67). Credits are now always visible in the sidebar — no need for the redundant banner on the properties page.

### Structure after changes
```text
┌──────────────────┐
│ RealFoto         │
│ Spracovanie      │
├──────────────────┤
│ ┌──────────────┐ │
│ │ ✦ 5 fotiek   │ │
│ │ ░░░░░░░░░░░░ │ │
│ │ [Dokúpiť]    │ │  ← green button
│ └──────────────┘ │
├──────────────────┤
│ ▎ Nehnuteľnosti  │  ← subtle active
│   Nová nehnut.   │
│                  │
├──────────────────┤
│ demo@realfoto.sk │
│   Späť na web    │
│   Odhlásiť sa    │
└──────────────────┘
```

