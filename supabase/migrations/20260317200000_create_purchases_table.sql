-- Purchases table for Stripe payments
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique not null,
  email text,
  name text,
  photos integer not null,
  amount_cents integer not null,
  status text not null default 'paid',
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.purchases enable row level security;

-- Admin can read all purchases
create policy "Admin can read purchases"
  on public.purchases for select
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- Edge functions (service role) can insert
-- (service role bypasses RLS, so no insert policy needed)
