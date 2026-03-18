## Plan: Add Navigation Menu, Contact Page, and More Standalone Pages

### Context

Currently the Header has no navigation links — just Logo + "Stiahnuť appku" + "Prihlásiť sa" + CTA. The website needs a proper nav menu and additional standalone pages to feel more professional and nuanced.

### 1. Create standalone pages

**New pages:**

- `/kontakt` — Contact page with form (name, email, phone, message → saves to database) + phone/email/hours info
- `/ako-to-funguje` — How It Works standalone page (reuse existing `HowItWorksSection` + `FeaturesGrid`)
- `/cennik` — Pricing standalone page (reuse `PricingPackagesA` + `PricingComparisonA`)

Each page uses `<Header />` + content + `<Footer />`.

### 2. Update Header with proper nav menu

Add navigation links between logo and action buttons:

**Desktop**: Text links — `Ako to funguje` | `Cenník` | `Kontakt`
**Mobile sheet**: Same links added above the CTA buttons

### 3. Update Footer

Add nav links section: Ako to funguje, Cenník, O nás, Kontakt alongside existing links.

### 4. Contact form backend

Create a `contact_messages` table via migration:

- `id` (uuid, PK)
- `name` (text)
- `email` (text)
- `phone` (text, nullable)
- `message` (text)
- `created_at` (timestamptz)

RLS: Allow anonymous inserts (public contact form), admin-only select.

### 5. Route registration

Add routes in `App.tsx` for `/kontakt`, `/ako-to-funguje`, `/cennik` — all wrapped in `PWAGuard`.

### Files changed

- `src/components/layout/Header.tsx` — add nav links
- `src/components/layout/Footer.tsx` — add nav links
- `src/pages/Contact.tsx` — new
- `src/pages/HowItWorks.tsx` — new  
- `src/pages/Pricing.tsx` — new
- `src/App.tsx` — register routes
- Migration — `contact_messages` table