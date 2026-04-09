
-- Fix 1: Revoke direct RPC access to has_role (RLS policies still work internally)
REVOKE EXECUTE ON FUNCTION public.has_role FROM anon, authenticated;

-- Fix 2: Add DELETE policy on ngo_reservations scoped to user's NGO
CREATE POLICY "Members can delete their NGO reservations"
ON public.ngo_reservations FOR DELETE TO authenticated
USING (ngo_id = get_user_ngo_id());

-- Fix 3: Helper function to check if user is an NGO admin
CREATE OR REPLACE FUNCTION public.is_ngo_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.ngo_members
    WHERE user_id = auth.uid() AND role = 'admin'
  )
$$;

-- Fix 4: Create a secure view that hides patient PII from non-admin NGO members
CREATE VIEW public.ngo_reservations_safe
WITH (security_invoker = on) AS
SELECT
  id, ngo_id, friendly_id, provider_name, speciality, slot_time,
  amount_paise, fee_paise, status, notes, visit_mode,
  has_prescription, has_receipt, created_at, updated_at,
  CASE WHEN is_ngo_admin() THEN patient_name ELSE '***' END AS patient_name,
  CASE WHEN is_ngo_admin() THEN patient_phone ELSE '***' END AS patient_phone,
  CASE WHEN is_ngo_admin() THEN patient_email ELSE '***' END AS patient_email
FROM public.ngo_reservations;
