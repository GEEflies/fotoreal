

## Plan: PWA Setup + Install Link + Mobile-Only App Mode

### Overview
Set up PWA capability, add "Download App" links in sidebar/header/footer, create an `/install` page, and restrict mobile users to only login + dashboard (no static website, no admin).

### 1. Install `vite-plugin-pwa` and configure PWA

**`vite.config.ts`**: Add `VitePWA` plugin with manifest (name: RealFoto, theme color, icons), `navigateFallbackDenylist: [/^\/~oauth/]`, and a service worker.

**`public/manifest.json`** or inline manifest via plugin config:
- `name`: "RealFoto"
- `short_name`: "RealFoto"  
- `start_url`: "/login"
- `display`: "standalone"
- `theme_color` / `background_color`
- Icons (use existing logo-realfoto.svg + generate PNG variants or use a simple 192/512 icon)

**`index.html`**: Add mobile meta tags (`apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, theme-color).

### 2. Create `/install` page (`src/pages/Install.tsx`)

- Detect platform (iOS vs Android/Chrome)
- On Android: listen for `beforeinstallprompt`, show "Install" button that triggers the native prompt
- On iOS: show manual instructions (Share → Add to Home Screen)
- Clean, simple UI with RealFoto branding

### 3. Add "Download App" link to sidebar, header, footer

**Sidebar (`UserLayout.tsx`)**: Add a `Download` / `Stiahnuť appku` link with a `Smartphone` icon above the profile section (line ~162), linking to `/install`.

**Mobile Sheet width**: Change `w-64` to `w-[85vw]` on the mobile `SheetContent` (line 218).

**Header (`Header.tsx`)**: Add a small "Stiahnuť appku" link in both desktop nav and mobile sheet menu.

**Footer (`Footer.tsx`)**: Add "Stiahnuť appku" link alongside existing links.

### 4. Mobile-only restriction: No static pages, no admin

**`src/App.tsx`**: Create a wrapper component or utility hook `useIsPWA()` that detects standalone mode (`window.matchMedia('(display-mode: standalone)').matches` or `navigator.standalone`).

Create a `<MobileAppGuard>` wrapper that:
- If app is running in standalone/PWA mode, redirect static pages (`/`, `/pre-fotografov`, `/bez-fotografa`) and admin routes (`/admin/*`) to `/login` (or `/dashboard` if authenticated)
- Normal browser access remains unchanged

Implementation: Wrap the affected routes with a check — if `isPWA`, redirect to `/login`. Keep `/login`, `/dashboard/*`, `/install`, `/platba-uspesna` accessible.

### 5. Route registration

Add `/install` route in `App.tsx`.

### Files changed
- `vite.config.ts` — PWA plugin
- `index.html` — meta tags
- `src/pages/Install.tsx` — new
- `src/App.tsx` — add route + PWA guard
- `src/components/dashboard/UserLayout.tsx` — install link in sidebar + wider mobile sheet
- `src/components/layout/Header.tsx` — install link
- `src/components/layout/Footer.tsx` — install link

