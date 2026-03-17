-- Fix INSERT policy - it's RESTRICTIVE which blocks anonymous inserts
-- Drop and recreate as PERMISSIVE (default)

DROP POLICY IF EXISTS "Anyone can create submissions" ON public.submissions;

CREATE POLICY "Anyone can create submissions"
ON public.submissions
FOR INSERT
WITH CHECK (true);