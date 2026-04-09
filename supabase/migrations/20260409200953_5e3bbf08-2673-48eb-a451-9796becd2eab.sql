
-- Fix 1: Remove the non-admin SELECT policy that leaks PII via permissive union
DROP POLICY IF EXISTS "NGO members can view reservations without PII" ON public.ngo_reservations;

-- Fix 2: Add write protection on user_roles
CREATE POLICY "Only service role can insert roles"
ON public.user_roles FOR INSERT TO service_role
WITH CHECK (true);

CREATE POLICY "Only service role can update roles"
ON public.user_roles FOR UPDATE TO service_role
USING (true);

CREATE POLICY "Only service role can delete roles"
ON public.user_roles FOR DELETE TO service_role
USING (true);

-- Fix 3: Re-revoke has_role RPC access
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, authenticated;
