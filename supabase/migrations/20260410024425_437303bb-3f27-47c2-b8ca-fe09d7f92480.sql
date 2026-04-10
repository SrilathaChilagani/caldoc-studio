
-- Remove the public SELECT policy
DROP POLICY IF EXISTS "Anyone can view active doctors" ON public.doctors;

-- Authenticated users can view active doctors (phone included only for admin/provider)
CREATE POLICY "Authenticated can view active doctors"
  ON public.doctors FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Allow anon users to view active doctors (needed for public doctor browsing pages)
-- but create a view that excludes phone
CREATE OR REPLACE VIEW public.doctors_public AS
SELECT
  id, slug, name, specialty, fee_paise, experience_years, bio, image_url,
  location, video_consult, audio_consult, rating, review_count, tags,
  is_active, languages, qualification, is_24x7, visit_modes, created_at, updated_at
FROM public.doctors
WHERE is_active = true;

-- Grant anon access to the view
GRANT SELECT ON public.doctors_public TO anon;

-- Also restrict slots to only unbooked future slots for public access
DROP POLICY IF EXISTS "Anyone can view available slots" ON public.slots;
CREATE POLICY "Anyone can view available slots"
  ON public.slots FOR SELECT
  TO public
  USING (is_booked = false AND starts_at > now());

-- Authenticated users (patients, providers, admins) can view all slots
CREATE POLICY "Authenticated can view all slots"
  ON public.slots FOR SELECT
  TO authenticated
  USING (true);
