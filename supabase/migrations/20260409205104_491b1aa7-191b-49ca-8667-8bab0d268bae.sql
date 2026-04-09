
-- Fix audit_logs: only service role should insert
DROP POLICY "System can insert audit logs" ON public.audit_logs;
CREATE POLICY "Service role can insert audit logs" ON public.audit_logs FOR INSERT
  TO service_role WITH CHECK (true);

-- Fix enrollment inserts: restrict to authenticated users only  
DROP POLICY "Anyone can submit enrollment" ON public.provider_enrollments;
CREATE POLICY "Authenticated users can submit enrollment" ON public.provider_enrollments FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY "Anyone can submit pharmacy enrollment" ON public.pharmacy_enrollments;
CREATE POLICY "Authenticated users can submit pharmacy enrollment" ON public.pharmacy_enrollments FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY "Anyone can submit lab enrollment" ON public.lab_enrollments;
CREATE POLICY "Authenticated users can submit lab enrollment" ON public.lab_enrollments FOR INSERT
  TO authenticated WITH CHECK (true);

-- Fix offline requests: keep public but that's intentional for phone requests
DROP POLICY "Anyone can submit offline request" ON public.offline_requests;
CREATE POLICY "Anyone can submit offline request" ON public.offline_requests FOR INSERT
  TO anon, authenticated WITH CHECK (length(phone) > 0);
