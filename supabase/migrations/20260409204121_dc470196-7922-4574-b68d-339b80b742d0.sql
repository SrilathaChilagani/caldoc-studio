
-- =============================================
-- 1. DOCTORS
-- =============================================
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  fee_paise INTEGER NOT NULL DEFAULT 49900,
  experience_years INTEGER NOT NULL DEFAULT 0,
  bio TEXT,
  image_url TEXT,
  location TEXT,
  video_consult BOOLEAN NOT NULL DEFAULT true,
  audio_consult BOOLEAN NOT NULL DEFAULT false,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0.0,
  review_count INTEGER NOT NULL DEFAULT 0,
  tags TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active doctors"
  ON public.doctors FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage doctors"
  ON public.doctors FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 2. APPOINTMENTS
-- =============================================
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  patient_phone TEXT,
  slot_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  consultation_type TEXT NOT NULL DEFAULT 'VIDEO',
  video_room_url TEXT,
  symptoms TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT,
  fee_paise INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view own appointments"
  ON public.appointments FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id);

CREATE POLICY "Patients can create own appointments"
  ON public.appointments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Providers can view assigned appointments"
  ON public.appointments FOR SELECT
  TO authenticated
  USING (
    doctor_id IN (SELECT id FROM public.doctors WHERE slug = ANY(
      SELECT unnest(ARRAY[]::text[]) -- placeholder; providers see via admin for now
    ))
    OR public.has_role(auth.uid(), 'provider')
  );

CREATE POLICY "Providers can update appointments"
  ON public.appointments FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'provider') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all appointments"
  ON public.appointments FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all appointments"
  ON public.appointments FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 3. PATIENT DOCUMENTS
-- =============================================
CREATE TABLE public.patient_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  document_type TEXT NOT NULL DEFAULT 'Other',
  file_url TEXT,
  provider_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.patient_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view own documents"
  ON public.patient_documents FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id);

CREATE POLICY "Patients can upload own documents"
  ON public.patient_documents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can delete own documents"
  ON public.patient_documents FOR DELETE
  TO authenticated
  USING (auth.uid() = patient_id);

CREATE POLICY "Providers can view patient documents"
  ON public.patient_documents FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'provider'));

CREATE POLICY "Providers can upload documents"
  ON public.patient_documents FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'provider'));

CREATE POLICY "Admins can view all documents"
  ON public.patient_documents FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- 4. PHARMACY ORDERS
-- =============================================
CREATE TABLE public.pharmacy_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  patient_name TEXT NOT NULL,
  patient_phone TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  delivery_address TEXT,
  delivery_mode TEXT NOT NULL DEFAULT 'Delivery',
  tracking_number TEXT,
  courier_name TEXT,
  amount_paise INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'AWAITING_PAYMENT',
  fulfillment_label TEXT DEFAULT 'Ready',
  has_prescription BOOLEAN NOT NULL DEFAULT false,
  provider_name TEXT,
  provider_speciality TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pharmacy_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view own pharmacy orders"
  ON public.pharmacy_orders FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id);

CREATE POLICY "Pharmacy staff can view all orders"
  ON public.pharmacy_orders FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'pharmacy'));

CREATE POLICY "Pharmacy staff can update orders"
  ON public.pharmacy_orders FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'pharmacy'));

CREATE POLICY "Pharmacy staff can create orders"
  ON public.pharmacy_orders FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'pharmacy'));

CREATE POLICY "Admins can view all pharmacy orders"
  ON public.pharmacy_orders FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_pharmacy_orders_updated_at
  BEFORE UPDATE ON public.pharmacy_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 5. PHARMACY INVENTORY
-- =============================================
CREATE TABLE public.pharmacy_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  reorder_level INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'units',
  status TEXT NOT NULL DEFAULT 'In stock',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pharmacy_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pharmacy staff can manage inventory"
  ON public.pharmacy_inventory FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'pharmacy'))
  WITH CHECK (public.has_role(auth.uid(), 'pharmacy'));

CREATE POLICY "Admins can view inventory"
  ON public.pharmacy_inventory FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_pharmacy_inventory_updated_at
  BEFORE UPDATE ON public.pharmacy_inventory
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 6. LAB ORDERS
-- =============================================
CREATE TABLE public.lab_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  patient_name TEXT NOT NULL,
  patient_phone TEXT,
  patient_email TEXT,
  tests JSONB NOT NULL DEFAULT '[]',
  delivery_mode TEXT NOT NULL DEFAULT 'HOME',
  delivery_address TEXT,
  collection_agent_name TEXT,
  collection_agent_phone TEXT,
  provider_name TEXT,
  provider_speciality TEXT,
  amount_paise INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'PENDING',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.lab_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view own lab orders"
  ON public.lab_orders FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id);

CREATE POLICY "Patients can create lab orders"
  ON public.lab_orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Labs staff can view all lab orders"
  ON public.lab_orders FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'labs'));

CREATE POLICY "Labs staff can update lab orders"
  ON public.lab_orders FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'labs'));

CREATE POLICY "Admins can view all lab orders"
  ON public.lab_orders FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_lab_orders_updated_at
  BEFORE UPDATE ON public.lab_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 7. LAB AGENTS
-- =============================================
CREATE TABLE public.lab_agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  coverage_area TEXT,
  active_orders INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Available',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.lab_agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Labs staff can manage agents"
  ON public.lab_agents FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'labs'))
  WITH CHECK (public.has_role(auth.uid(), 'labs'));

CREATE POLICY "Admins can view agents"
  ON public.lab_agents FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_lab_agents_updated_at
  BEFORE UPDATE ON public.lab_agents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
