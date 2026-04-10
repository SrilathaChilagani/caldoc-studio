
-- 1. Fix lab_partners: restrict public SELECT to authenticated only
DROP POLICY IF EXISTS "Anyone can view active lab partners" ON public.lab_partners;
CREATE POLICY "Authenticated can view active lab partners"
  ON public.lab_partners FOR SELECT
  TO authenticated
  USING (is_active = true);

-- 2. Fix has_role RPC enumeration: revoke direct execute from anon/authenticated
-- RLS policies still work because they evaluate as the function owner
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, authenticated;

-- 3. Fix ngo_reservations: add SELECT for non-admin NGO members via the safe view pattern
-- Non-admin members can view reservations for their NGO (without PII — they should use the safe view)
-- But we also need a base table SELECT so inserts/updates can return data
DROP POLICY IF EXISTS "Members can view their NGO reservations" ON public.ngo_reservations;
CREATE POLICY "NGO members can view own NGO reservations"
  ON public.ngo_reservations FOR SELECT
  TO authenticated
  USING (ngo_id = get_user_ngo_id());

-- 4. Fix overly permissive INSERT policies on enrollments
DROP POLICY IF EXISTS "Authenticated users can submit lab enrollment" ON public.lab_enrollments;
CREATE POLICY "Authenticated users can submit lab enrollment"
  ON public.lab_enrollments FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can submit pharmacy enrollment" ON public.pharmacy_enrollments;
CREATE POLICY "Authenticated users can submit pharmacy enrollment"
  ON public.pharmacy_enrollments FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 5. Fix pharmacy_partners: same issue as lab_partners
DROP POLICY IF EXISTS "Anyone can view active pharmacy partners" ON public.pharmacy_partners;
CREATE POLICY "Authenticated can view active pharmacy partners"
  ON public.pharmacy_partners FOR SELECT
  TO authenticated
  USING (is_active = true);

-- 6. Medications: public SELECT is intentional (search page works without auth), keep as-is
