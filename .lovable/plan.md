# Plan: Remake Landing Page to FotoReal AI Photo Editor

## Overview

Complete transformation from a real estate valuation landing page to **FotoReal** — an AI photo editor for real estate photography. The design follows the reference at realfoto-adames.vercel.app.

## Build Error Fix

- `**use-wizard-state.ts` line 91**: Replace `NodeJS.Timeout` with `ReturnType<typeof setTimeout>` to fix the TS2503 error.

## Structural Changes

### 1. Update branding and metadata

- Rename app to **FotoReal** in `index.html` (title, meta tags, OG tags)
- Update logo text in Header from "NehnuteľnostiBratislava" to "FotoReal"
- Update nav links: Domov, Vylepšiť, Odstrániť, Prihlásiť sa

### 2. Rewrite Hero Section

Replace the current property valuation hero with:

- "AI editor fotiek" badge (green dot + text)
- Headline: "Realitné fotografie s **dokonalou oblohou**" (blue animated text)
- Subtext about saving 90% costs
- Two CTAs: "Vyskúšať ZADARMO" (primary) + "Pozrieť funkcie" (outline)
- "*Bez nutnosti kreditnej karty" note
- Before/after image comparison slider on the right
- Trust indicators: "Hotovo do 30s", "GDPR Súlad", "10x Lacnejšie"
- Star rating bar with avatar group + "Spoľahlivá kvalita pre profesionálne výsledky"

### 3. New Features Section ("Čo dokážete s naším AI")

Replace BenefitsSection with a grid of 9 feature cards, each with:

- Icon, title, description
- Before/after image comparison
- Features: HDR Merging, Window Pulling, Sky Replacement, White Balance, Perspective Correction, Relighting, RAW Support, Auto Privacy, Color Correction

### 4. New Pricing Comparison Section

Replace ResultsSection + HowItWorksSection with:

- "Rýchlejšie a lacnejšie ako manuálna úprava"
- Side-by-side: FotoReal (0.70€/photo) vs Photographer (5€/photo)
- Each with before/after comparison images

### 5. New CTA Section ("Pripravení začať?")

- "Pridajte sa k tisíckam realitných profesionálov"
- "Vyskúšať ZADARMO" button

### 6. Remove unused sections

- Remove: SocialProofStrip, PdfGuideSection, FaqSection, AboutSection, ContactSection
- Remove: ValuationModal, FloatingCTA (wizard flow stays in codebase for admin but removed from Index)
- Remove old real estate hero/benefits assets

### 7. Update Header

- Nav: Domov, Vylepšiť, Odstrániť (with icons)
- Right side: "Prihlásiť sa" button (login icon)
- Clean white background style

### 8. Update Footer

- Minimal footer with FotoReal branding

## New Components to Create

- `src/components/sections/FeaturesGrid.tsx` — 9 AI feature cards with before/after
- `src/components/sections/PricingComparison.tsx` — cost comparison section
- `src/components/sections/CTASection.tsx` — final call-to-action
- `src/components/ui/BeforeAfterSlider.tsx` — image comparison slider component

## Images

For the before/after images, we'll reference the source images from the reference site directly as placeholder URLs initially. The user can replace them with their own assets later.

## Technical Notes

- Keep existing admin panel, database, and edge functions untouched
- Keep existing UI component library (shadcn)
- Reuse existing color system (primary blue already matches the reference)
- The App.css `#root` max-width constraint needs to be removed (it limits layout to 1280px)