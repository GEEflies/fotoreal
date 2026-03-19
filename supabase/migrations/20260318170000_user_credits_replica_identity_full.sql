-- Fix realtime subscription for user_credits: Supabase requires REPLICA IDENTITY FULL
-- for tables with RLS so that realtime filters (e.g. user_id=eq.X) work correctly.
ALTER TABLE public.user_credits REPLICA IDENTITY FULL;
