CREATE POLICY "Admins can view all ngo_reservations"
ON public.ngo_reservations
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));