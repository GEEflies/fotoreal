CREATE OR REPLACE FUNCTION public.increment_total_used(_user_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.user_credits
  SET total_used = total_used + 1, updated_at = now()
  WHERE user_id = _user_id;
$$;