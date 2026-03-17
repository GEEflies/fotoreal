-- Add user_id and credits_granted columns to purchases
ALTER TABLE public.purchases
  ADD COLUMN user_id uuid REFERENCES auth.users(id),
  ADD COLUMN credits_granted boolean NOT NULL DEFAULT false;

-- Index for fast lookup of unclaimed purchases by email
CREATE INDEX idx_purchases_unclaimed_email
  ON public.purchases(email) WHERE credits_granted = false;

-- Allow users to read their own purchases
CREATE POLICY "Users can read own purchases"
  ON public.purchases FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Atomically grant credits for a single purchase
CREATE OR REPLACE FUNCTION public.grant_purchase_credits(_purchase_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _photos integer;
BEGIN
  -- Only grant if not already granted (idempotency guard)
  UPDATE public.purchases
  SET user_id = _user_id, credits_granted = true
  WHERE id = _purchase_id AND credits_granted = false
  RETURNING photos INTO _photos;

  IF _photos IS NULL THEN
    RETURN false;
  END IF;

  -- Upsert user_credits: create if missing, otherwise add to purchased_credits
  INSERT INTO public.user_credits (user_id, purchased_credits)
  VALUES (_user_id, _photos)
  ON CONFLICT (user_id)
  DO UPDATE SET
    purchased_credits = user_credits.purchased_credits + _photos,
    updated_at = now();

  RETURN true;
END;
$$;

-- Claim all unclaimed purchases matching an email for a given user
CREATE OR REPLACE FUNCTION public.claim_purchases_by_email(_user_id uuid, _email text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _purchase record;
  _claimed integer := 0;
BEGIN
  FOR _purchase IN
    SELECT id FROM public.purchases
    WHERE email = _email AND credits_granted = false
  LOOP
    IF public.grant_purchase_credits(_purchase.id, _user_id) THEN
      _claimed := _claimed + 1;
    END IF;
  END LOOP;
  RETURN _claimed;
END;
$$;
