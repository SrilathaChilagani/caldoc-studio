
-- =====================================================
-- 1. NEW TABLES
-- =====================================================

-- Slots (provider availability)
CREATE TABLE public.slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  is_booked BOOLEAN NOT NULL DEFAULT false,
  fee_paise INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider_id, starts_at)
);
CREATE INDEX idx_slots_provider_booked ON public.slots(provider_id, is_booked, starts_at);
ALTER TABLE public.slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available slots" ON public.slots FOR SELECT USING (true);
CREATE POLICY "Providers can manage their slots" ON public.slots FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'provider'::app_role)) WITH CHECK (has_role(auth.uid(), 'provider'::app_role));
CREATE POLICY "Admins can manage all slots" ON public.slots FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Payments
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gateway TEXT NOT NULL,
  order_id TEXT NOT NULL UNIQUE,
  payment_ref TEXT,
  amount INT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL,
  appointment_id UUID UNIQUE REFERENCES public.appointments(id),
  rx_order_id UUID UNIQUE,
  lab_order_id UUID UNIQUE REFERENCES public.lab_orders(id),
  receipt_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_payments_status ON public.payments(status);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all payments" ON public.payments FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Providers can view payments" ON public.payments FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'provider'::app_role));
CREATE POLICY "Patients can view own payments" ON public.payments FOR SELECT TO authenticated
  USING (appointment_id IN (SELECT id FROM public.appointments WHERE patient_id = auth.uid())
    OR lab_order_id IN (SELECT id FROM public.lab_orders WHERE patient_id = auth.uid()));

-- Prescriptions
CREATE TABLE public.prescriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID NOT NULL UNIQUE REFERENCES public.appointments(id) ON DELETE CASCADE,
  pdf_key TEXT NOT NULL,
  meds JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can create prescriptions" ON public.prescriptions FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'provider'::app_role));
CREATE POLICY "Providers can view prescriptions" ON public.prescriptions FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'provider'::app_role));
CREATE POLICY "Patients can view own prescriptions" ON public.prescriptions FOR SELECT TO authenticated
  USING (appointment_id IN (SELECT id FROM public.appointments WHERE patient_id = auth.uid()));
CREATE POLICY "Admins can view all prescriptions" ON public.prescriptions FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Visit Notes
CREATE TABLE public.visit_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID NOT NULL UNIQUE REFERENCES public.appointments(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.visit_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can manage visit notes" ON public.visit_notes FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'provider'::app_role)) WITH CHECK (has_role(auth.uid(), 'provider'::app_role));
CREATE POLICY "Patients can view own visit notes" ON public.visit_notes FOR SELECT TO authenticated
  USING (appointment_id IN (SELECT id FROM public.appointments WHERE patient_id = auth.uid()));
CREATE POLICY "Admins can view all visit notes" ON public.visit_notes FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Appointment Status History
CREATE TABLE public.appointment_status_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  from_status TEXT NOT NULL,
  to_status TEXT NOT NULL,
  actor_type TEXT NOT NULL,
  actor_id TEXT,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_appt_status_history ON public.appointment_status_history(appointment_id, created_at);
ALTER TABLE public.appointment_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can view status history" ON public.appointment_status_history FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'provider'::app_role));
CREATE POLICY "Admins can view status history" ON public.appointment_status_history FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Patients can view own status history" ON public.appointment_status_history FOR SELECT TO authenticated
  USING (appointment_id IN (SELECT id FROM public.appointments WHERE patient_id = auth.uid()));

-- Outbound Messages
CREATE TABLE public.outbound_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  to_phone TEXT,
  to_email TEXT,
  template TEXT,
  body TEXT,
  message_id TEXT UNIQUE,
  status TEXT NOT NULL,
  error TEXT,
  kind TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_outbound_appt ON public.outbound_messages(appointment_id, created_at);
ALTER TABLE public.outbound_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all messages" ON public.outbound_messages FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Providers can view messages" ON public.outbound_messages FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'provider'::app_role));

-- Pharmacy Fulfillments
CREATE TABLE public.pharmacy_fulfillments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID UNIQUE REFERENCES public.appointments(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'READY',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.pharmacy_fulfillments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pharmacy staff can manage fulfillments" ON public.pharmacy_fulfillments FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'pharmacy'::app_role)) WITH CHECK (has_role(auth.uid(), 'pharmacy'::app_role));
CREATE POLICY "Providers can view fulfillments" ON public.pharmacy_fulfillments FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'provider'::app_role));
CREATE POLICY "Admins can view fulfillments" ON public.pharmacy_fulfillments FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Lab Order Events
CREATE TABLE public.lab_order_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lab_order_id UUID NOT NULL REFERENCES public.lab_orders(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  note TEXT,
  collection_agent_name TEXT,
  collection_agent_phone TEXT,
  actor_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_lab_order_events ON public.lab_order_events(lab_order_id, created_at);
ALTER TABLE public.lab_order_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Labs staff can manage events" ON public.lab_order_events FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'labs'::app_role)) WITH CHECK (has_role(auth.uid(), 'labs'::app_role));
CREATE POLICY "Admins can view lab events" ON public.lab_order_events FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Rx Order Events (pharmacy order events)
CREATE TABLE public.rx_order_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rx_order_id UUID NOT NULL REFERENCES public.pharmacy_orders(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  note TEXT,
  tracking_number TEXT,
  courier_name TEXT,
  actor_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_rx_order_events ON public.rx_order_events(rx_order_id, created_at);
ALTER TABLE public.rx_order_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pharmacy staff can manage rx events" ON public.rx_order_events FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'pharmacy'::app_role)) WITH CHECK (has_role(auth.uid(), 'pharmacy'::app_role));
CREATE POLICY "Admins can view rx events" ON public.rx_order_events FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Medications catalog
CREATE TABLE public.medications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  generic TEXT,
  form TEXT,
  strength TEXT,
  category TEXT DEFAULT 'OTC',
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_medications_name ON public.medications(name);
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view medications" ON public.medications FOR SELECT USING (true);
CREATE POLICY "Admins can manage medications" ON public.medications FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Provider Clinics
CREATE TABLE public.provider_clinics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  clinic_name TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_provider_clinics_provider ON public.provider_clinics(provider_id);
CREATE INDEX idx_provider_clinics_city ON public.provider_clinics(city);
ALTER TABLE public.provider_clinics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active clinics" ON public.provider_clinics FOR SELECT USING (is_active = true);
CREATE POLICY "Providers can manage their clinics" ON public.provider_clinics FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'provider'::app_role)) WITH CHECK (has_role(auth.uid(), 'provider'::app_role));
CREATE POLICY "Admins can manage all clinics" ON public.provider_clinics FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Patient Addresses
CREATE TABLE public.patient_addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  label TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  instructions TEXT,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_at TIMESTAMPTZ
);
CREATE INDEX idx_patient_addresses_patient ON public.patient_addresses(patient_id);
ALTER TABLE public.patient_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can manage own addresses" ON public.patient_addresses FOR ALL TO authenticated
  USING (auth.uid() = patient_id) WITH CHECK (auth.uid() = patient_id);

-- Lab Partners
CREATE TABLE public.lab_partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  nabl_certified BOOLEAN NOT NULL DEFAULT false,
  nabl_cert_number TEXT,
  test_categories TEXT[] NOT NULL DEFAULT '{}',
  home_collection BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_lab_partners_active ON public.lab_partners(is_active);
ALTER TABLE public.lab_partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active lab partners" ON public.lab_partners FOR SELECT USING (is_active = true);
CREATE POLICY "Labs staff can manage partners" ON public.lab_partners FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'labs'::app_role)) WITH CHECK (has_role(auth.uid(), 'labs'::app_role));
CREATE POLICY "Admins can manage lab partners" ON public.lab_partners FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Pharmacy Partners
CREATE TABLE public.pharmacy_partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  drug_license_number TEXT NOT NULL,
  gst_number TEXT,
  service_areas TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_pharmacy_partners_active ON public.pharmacy_partners(is_active);
ALTER TABLE public.pharmacy_partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active pharmacy partners" ON public.pharmacy_partners FOR SELECT USING (is_active = true);
CREATE POLICY "Pharmacy staff can manage partners" ON public.pharmacy_partners FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'pharmacy'::app_role)) WITH CHECK (has_role(auth.uid(), 'pharmacy'::app_role));
CREATE POLICY "Admins can manage pharmacy partners" ON public.pharmacy_partners FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Provider Enrollments
CREATE TABLE public.provider_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  dob DATE,
  gender TEXT,
  qualification TEXT NOT NULL,
  university TEXT,
  qualification_year INT,
  registration_number TEXT NOT NULL,
  registration_council TEXT NOT NULL,
  registration_year INT,
  speciality TEXT NOT NULL,
  sub_speciality TEXT,
  experience_years INT,
  current_hospital TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  languages TEXT[] NOT NULL DEFAULT '{}',
  visit_modes TEXT[] NOT NULL DEFAULT '{}',
  fee_paise INT,
  bio TEXT,
  consent_telemedicine BOOLEAN NOT NULL DEFAULT false,
  profile_photo_key TEXT,
  qualification_doc_key TEXT,
  registration_doc_key TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by_email TEXT,
  rejection_reason TEXT,
  provider_id TEXT,
  admin_notified_at TIMESTAMPTZ
);
CREATE INDEX idx_provider_enrollments_status ON public.provider_enrollments(status, created_at);
ALTER TABLE public.provider_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit enrollment" ON public.provider_enrollments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view enrollments" ON public.provider_enrollments FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update enrollments" ON public.provider_enrollments FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Pharmacy Enrollments
CREATE TABLE public.pharmacy_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pharmacy_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  drug_license_number TEXT NOT NULL,
  gst_number TEXT,
  service_areas TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  admin_notified_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  reviewed_by_email TEXT,
  rejection_reason TEXT,
  pharmacy_partner_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.pharmacy_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit pharmacy enrollment" ON public.pharmacy_enrollments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view pharmacy enrollments" ON public.pharmacy_enrollments FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update pharmacy enrollments" ON public.pharmacy_enrollments FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Lab Enrollments
CREATE TABLE public.lab_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lab_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  nabl_certified BOOLEAN NOT NULL DEFAULT false,
  nabl_cert_number TEXT,
  test_categories TEXT[] NOT NULL DEFAULT '{}',
  home_collection BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  admin_notified_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  reviewed_by_email TEXT,
  rejection_reason TEXT,
  lab_partner_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.lab_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit lab enrollment" ON public.lab_enrollments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view lab enrollments" ON public.lab_enrollments FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update lab enrollments" ON public.lab_enrollments FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Check-in Forms
CREATE TABLE public.check_in_forms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID NOT NULL UNIQUE REFERENCES public.appointments(id) ON DELETE CASCADE,
  s3_key TEXT,
  chief_complaint TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_check_in_completed ON public.check_in_forms(completed_at);
ALTER TABLE public.check_in_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can manage own check-ins" ON public.check_in_forms FOR ALL TO authenticated
  USING (appointment_id IN (SELECT id FROM public.appointments WHERE patient_id = auth.uid()))
  WITH CHECK (appointment_id IN (SELECT id FROM public.appointments WHERE patient_id = auth.uid()));
CREATE POLICY "Providers can view check-ins" ON public.check_in_forms FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'provider'::app_role));

-- Offline Requests
CREATE TABLE public.offline_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  speciality TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'RECEIVED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);
ALTER TABLE public.offline_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit offline request" ON public.offline_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage offline requests" ON public.offline_requests FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Payment Receipts
CREATE TABLE public.payment_receipts (
  appointment_id UUID PRIMARY KEY REFERENCES public.appointments(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payment_receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can manage receipts" ON public.payment_receipts FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'provider'::app_role)) WITH CHECK (has_role(auth.uid(), 'provider'::app_role));
CREATE POLICY "Patients can view own receipts" ON public.payment_receipts FOR SELECT TO authenticated
  USING (appointment_id IN (SELECT id FROM public.appointments WHERE patient_id = auth.uid()));
CREATE POLICY "Admins can view receipts" ON public.payment_receipts FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Audit Logs
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id TEXT,
  actor_type TEXT NOT NULL,
  action TEXT NOT NULL,
  meta JSONB NOT NULL DEFAULT '{}',
  at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "System can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

-- =====================================================
-- 2. ADD MISSING COLUMNS TO EXISTING TABLES
-- =====================================================

-- doctors: add missing fields from Provider model
ALTER TABLE public.doctors
  ADD COLUMN IF NOT EXISTS languages TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS license_no TEXT,
  ADD COLUMN IF NOT EXISTS council_name TEXT,
  ADD COLUMN IF NOT EXISTS qualification TEXT,
  ADD COLUMN IF NOT EXISTS registration_number TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS visit_modes TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS is_24x7 BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS license_doc_key TEXT,
  ADD COLUMN IF NOT EXISTS profile_photo_key TEXT,
  ADD COLUMN IF NOT EXISTS registration_doc_key TEXT;

-- appointments: add missing fields
ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS slot_id UUID REFERENCES public.slots(id),
  ADD COLUMN IF NOT EXISTS recording_key TEXT,
  ADD COLUMN IF NOT EXISTS delivery_opt TEXT,
  ADD COLUMN IF NOT EXISTS wa_error TEXT,
  ADD COLUMN IF NOT EXISTS wa_status TEXT,
  ADD COLUMN IF NOT EXISTS consent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS consent_mode TEXT,
  ADD COLUMN IF NOT EXISTS consent_text TEXT,
  ADD COLUMN IF NOT EXISTS consent_type TEXT,
  ADD COLUMN IF NOT EXISTS delivery_address_id UUID REFERENCES public.patient_addresses(id),
  ADD COLUMN IF NOT EXISTS upload_link_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS visit_mode TEXT DEFAULT 'VIDEO',
  ADD COLUMN IF NOT EXISTS fee_currency TEXT DEFAULT 'INR',
  ADD COLUMN IF NOT EXISTS booker_phone TEXT;

CREATE INDEX IF NOT EXISTS idx_appointments_provider ON public.appointments(doctor_id, created_at);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON public.appointments(patient_id, created_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);

-- ngo_reservations: add missing fields
ALTER TABLE public.ngo_reservations
  ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES public.doctors(id),
  ADD COLUMN IF NOT EXISTS slot_id UUID REFERENCES public.slots(id),
  ADD COLUMN IF NOT EXISTS appointment_id UUID UNIQUE REFERENCES public.appointments(id),
  ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ;

-- ngos: add missing fields
ALTER TABLE public.ngos
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS billing_notes TEXT;

-- patient_documents: add missing fields
ALTER TABLE public.patient_documents
  ADD COLUMN IF NOT EXISTS key TEXT,
  ADD COLUMN IF NOT EXISTS file_name TEXT,
  ADD COLUMN IF NOT EXISTS content_type TEXT;

-- lab_orders: add missing fields
ALTER TABLE public.lab_orders
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'APPOINTMENT',
  ADD COLUMN IF NOT EXISTS lab_partner_id UUID REFERENCES public.lab_partners(id),
  ADD COLUMN IF NOT EXISTS address JSONB;

CREATE INDEX IF NOT EXISTS idx_lab_orders_status ON public.lab_orders(status, created_at);
CREATE INDEX IF NOT EXISTS idx_lab_orders_partner ON public.lab_orders(lab_partner_id, status);

-- profiles: add missing fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS dob DATE,
  ADD COLUMN IF NOT EXISTS sex TEXT,
  ADD COLUMN IF NOT EXISTS consent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS profile_photo_key TEXT;

-- pharmacy_orders: add rx_order FK for payments
-- (payments.rx_order_id references pharmacy_orders)
ALTER TABLE public.payments
  ADD CONSTRAINT payments_rx_order_id_fkey FOREIGN KEY (rx_order_id) REFERENCES public.pharmacy_orders(id);

-- =====================================================
-- 3. TRIGGERS for updated_at on new tables
-- =====================================================
CREATE TRIGGER update_slots_updated_at BEFORE UPDATE ON public.slots
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_visit_notes_updated_at BEFORE UPDATE ON public.visit_notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pharmacy_fulfillments_updated_at BEFORE UPDATE ON public.pharmacy_fulfillments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_provider_clinics_updated_at BEFORE UPDATE ON public.provider_clinics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_patient_addresses_updated_at BEFORE UPDATE ON public.patient_addresses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lab_partners_updated_at BEFORE UPDATE ON public.lab_partners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pharmacy_partners_updated_at BEFORE UPDATE ON public.pharmacy_partners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pharmacy_enrollments_updated_at BEFORE UPDATE ON public.pharmacy_enrollments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lab_enrollments_updated_at BEFORE UPDATE ON public.lab_enrollments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_check_in_forms_updated_at BEFORE UPDATE ON public.check_in_forms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
