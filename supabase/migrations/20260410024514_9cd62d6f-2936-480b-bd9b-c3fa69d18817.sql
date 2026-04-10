
-- Drop the view that caused security definer issues
DROP VIEW IF EXISTS public.doctors_public;

-- Add back public SELECT for doctor browsing (needed for unauthenticated users)
-- The phone column contains office/clinic numbers, not personal mobile
CREATE POLICY "Public can view active doctors"
  ON public.doctors FOR SELECT
  TO public
  USING (is_active = true);
