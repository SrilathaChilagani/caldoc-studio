
-- Fix lab_partners: restrict to admin and labs roles only
DROP POLICY IF EXISTS "Authenticated can view active lab partners" ON public.lab_partners;
CREATE POLICY "Admin and labs can view active lab partners"
  ON public.lab_partners FOR SELECT
  TO authenticated
  USING (is_active = true AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'labs'::app_role)));

-- Fix pharmacy_partners: restrict to admin and pharmacy roles only
DROP POLICY IF EXISTS "Authenticated can view active pharmacy partners" ON public.pharmacy_partners;
CREATE POLICY "Admin and pharmacy can view active pharmacy partners"
  ON public.pharmacy_partners FOR SELECT
  TO authenticated
  USING (is_active = true AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pharmacy'::app_role)));
