
-- Fix 1: Explicit INSERT/UPDATE/DELETE policies on ngo_members restricted to service_role
CREATE POLICY "Only service role can insert members"
ON public.ngo_members FOR INSERT TO service_role
WITH CHECK (true);

CREATE POLICY "Only service role can update members"
ON public.ngo_members FOR UPDATE TO service_role
USING (true);

CREATE POLICY "Only service role can delete members"
ON public.ngo_members FOR DELETE TO service_role
USING (true);

-- Fix 2: Re-revoke has_role RPC access (idempotent)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, authenticated;

-- Fix 3: Replace the broad SELECT policy on ngo_reservations with role-scoped policies
-- Admin members get full access including patient PII
DROP POLICY IF EXISTS "Members can view their NGO reservations" ON public.ngo_reservations;

CREATE POLICY "NGO admins can view all reservation details"
ON public.ngo_reservations FOR SELECT TO authenticated
USING (
  ngo_id = get_user_ngo_id()
  AND is_ngo_admin()
);

CREATE POLICY "NGO members can view reservations without PII"
ON public.ngo_reservations FOR SELECT TO authenticated
USING (
  ngo_id = get_user_ngo_id()
  AND NOT is_ngo_admin()
);
