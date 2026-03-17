# RealFoto — Claude Code Workflow Rules

## Git workflow (CRITICAL)

This repo is shared with a partner using **Lovable**, which auto-pushes to `main` on every change.

1. **Always `git pull --rebase origin main` before starting any work**
2. **Always `git pull --rebase origin main` before pushing**
3. If rebase has conflicts, resolve them and continue
4. Never force-push to `main`

## Environment variables

- `.env` is **git-ignored** — never commit it
- `.env.example` has the variable names (no secrets)
- Production env vars are set in the **Vercel dashboard**
- Local `.env` must point to the new Supabase project (`tvnvinawrzwutpmftqxi`)

## Tech stack

- **Frontend**: Vite + React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Edge Functions in Deno, PostgreSQL, Auth)
- **Payments**: Stripe Checkout (one-time payments)
- **Hosting**: Vercel (auto-deploys from `main`)
- **Language**: UI is in Slovak

## Supabase

- Project: `tvnvinawrzwutpmftqxi` (RealFoto App, Frankfurt / eu-central-1)
- Edge functions: `create-checkout`, `stripe-webhook`
- Use `SUPABASE_ACCESS_TOKEN` env var for CLI operations

## Stripe

- 5 packages: 20/40/80/160/320 photos
- Prices: 14/26/48/87/165 EUR
- Webhook endpoint configured at Supabase edge function
