
-- Make get_user_ngo_id deterministic
CREATE OR REPLACE FUNCTION public.get_user_ngo_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ngo_id FROM public.ngo_members WHERE user_id = auth.uid() ORDER BY created_at ASC LIMIT 1
$$;

-- Enforce single NGO membership per user
ALTER TABLE public.ngo_members ADD CONSTRAINT ngo_members_user_unique UNIQUE (user_id);
