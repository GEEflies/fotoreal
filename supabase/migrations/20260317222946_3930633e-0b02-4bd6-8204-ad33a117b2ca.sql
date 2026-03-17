
CREATE OR REPLACE FUNCTION public.get_admin_user_list()
RETURNS TABLE (
  user_id uuid,
  email text,
  user_created_at timestamptz,
  company_name text,
  ico text,
  address text,
  logo_url text,
  free_credits int,
  purchased_credits int,
  total_used int,
  properties_count bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    u.id AS user_id,
    u.email::text AS email,
    u.created_at AS user_created_at,
    p.company_name,
    p.ico,
    p.address,
    p.logo_url,
    COALESCE(uc.free_credits, 5) AS free_credits,
    COALESCE(uc.purchased_credits, 0) AS purchased_credits,
    COALESCE(uc.total_used, 0) AS total_used,
    COALESCE(prop.cnt, 0) AS properties_count
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.user_id = u.id
  LEFT JOIN public.user_credits uc ON uc.user_id = u.id
  LEFT JOIN LATERAL (
    SELECT COUNT(*) AS cnt FROM public.properties pr WHERE pr.user_id = u.id
  ) prop ON true
  WHERE public.has_role(auth.uid(), 'admin')
  ORDER BY u.created_at DESC;
$$;
