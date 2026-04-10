
-- First, add a user_id column to doctors so we can link providers to their doctor records
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS user_id uuid;

-- Fix the overly permissive provider SELECT policy on appointments
DROP POLICY IF EXISTS "Providers can view assigned appointments" ON public.appointments;
CREATE POLICY "Providers can view assigned appointments"
  ON public.appointments FOR SELECT
  TO authenticated
  USING (
    doctor_id IN (
      SELECT id FROM public.doctors WHERE doctors.user_id = auth.uid()
    )
  );

-- Also fix the provider UPDATE policy to be scoped to their own appointments
DROP POLICY IF EXISTS "Providers can update appointments" ON public.appointments;
CREATE POLICY "Providers can update appointments"
  ON public.appointments FOR UPDATE
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role)
    OR doctor_id IN (
      SELECT id FROM public.doctors WHERE doctors.user_id = auth.uid()
    )
  );
