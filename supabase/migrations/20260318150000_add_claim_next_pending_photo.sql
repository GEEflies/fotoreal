-- Atomically claim the next pending photo for processing.
-- Uses FOR UPDATE SKIP LOCKED to prevent race conditions
-- when multiple edge function invocations run concurrently.
CREATE OR REPLACE FUNCTION public.claim_next_pending_photo(_property_id uuid)
RETURNS TABLE(id uuid, original_url text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE property_photos
  SET ai_status = 'analyzing', ai_step_label = 'Analyzujem fotku...'
  WHERE property_photos.id = (
    SELECT pp.id FROM property_photos pp
    WHERE pp.property_id = _property_id AND pp.ai_status = 'pending'
    ORDER BY pp.created_at
    LIMIT 1
    FOR UPDATE SKIP LOCKED
  )
  RETURNING property_photos.id, property_photos.original_url;
$$;
