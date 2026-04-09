
-- NGOs table
CREATE TABLE public.ngos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ngos ENABLE ROW LEVEL SECURITY;

-- NGO Members (links auth users to NGOs)
CREATE TABLE public.ngo_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ngo_id UUID NOT NULL REFERENCES public.ngos(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, ngo_id)
);
ALTER TABLE public.ngo_members ENABLE ROW LEVEL SECURITY;

-- Campaigns table
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ngo_id UUID NOT NULL REFERENCES public.ngos(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'UPCOMING' CHECK (status IN ('ACTIVE', 'UPCOMING', 'COMPLETED')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  target_beneficiaries INTEGER NOT NULL DEFAULT 0,
  beneficiaries_served INTEGER NOT NULL DEFAULT 0,
  districts TEXT[] NOT NULL DEFAULT '{}',
  volunteer_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Volunteers table
CREATE TABLE public.volunteers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ngo_id UUID NOT NULL REFERENCES public.ngos(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  district TEXT,
  role TEXT NOT NULL DEFAULT 'Health Worker',
  campaign_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;

-- NGO Reservations table
CREATE TABLE public.ngo_reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ngo_id UUID NOT NULL REFERENCES public.ngos(id) ON DELETE CASCADE,
  friendly_id TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  speciality TEXT,
  slot_time TIMESTAMPTZ,
  amount_paise INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'HELD' CHECK (status IN ('HELD', 'CONFIRMED', 'CANCELLED')),
  notes TEXT,
  patient_name TEXT,
  patient_phone TEXT,
  patient_email TEXT,
  visit_mode TEXT DEFAULT 'VIDEO' CHECK (visit_mode IN ('VIDEO', 'AUDIO')),
  fee_paise INTEGER,
  has_prescription BOOLEAN NOT NULL DEFAULT false,
  has_receipt BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ngo_reservations ENABLE ROW LEVEL SECURITY;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_ngos_updated_at BEFORE UPDATE ON public.ngos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_volunteers_updated_at BEFORE UPDATE ON public.volunteers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ngo_reservations_updated_at BEFORE UPDATE ON public.ngo_reservations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Helper function to get user's NGO id (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.get_user_ngo_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ngo_id FROM public.ngo_members WHERE user_id = auth.uid() LIMIT 1
$$;

-- RLS Policies for ngo_members
CREATE POLICY "Users can see their own memberships" ON public.ngo_members
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for ngos
CREATE POLICY "Members can view their NGO" ON public.ngos
  FOR SELECT USING (id = public.get_user_ngo_id());

-- RLS Policies for campaigns
CREATE POLICY "Members can view their NGO campaigns" ON public.campaigns
  FOR SELECT USING (ngo_id = public.get_user_ngo_id());
CREATE POLICY "Members can create campaigns" ON public.campaigns
  FOR INSERT WITH CHECK (ngo_id = public.get_user_ngo_id());
CREATE POLICY "Members can update their NGO campaigns" ON public.campaigns
  FOR UPDATE USING (ngo_id = public.get_user_ngo_id());

-- RLS Policies for volunteers
CREATE POLICY "Members can view their NGO volunteers" ON public.volunteers
  FOR SELECT USING (ngo_id = public.get_user_ngo_id());
CREATE POLICY "Members can create volunteers" ON public.volunteers
  FOR INSERT WITH CHECK (ngo_id = public.get_user_ngo_id());
CREATE POLICY "Members can update their NGO volunteers" ON public.volunteers
  FOR UPDATE USING (ngo_id = public.get_user_ngo_id());

-- RLS Policies for ngo_reservations
CREATE POLICY "Members can view their NGO reservations" ON public.ngo_reservations
  FOR SELECT USING (ngo_id = public.get_user_ngo_id());
CREATE POLICY "Members can create reservations" ON public.ngo_reservations
  FOR INSERT WITH CHECK (ngo_id = public.get_user_ngo_id());
CREATE POLICY "Members can update their NGO reservations" ON public.ngo_reservations
  FOR UPDATE USING (ngo_id = public.get_user_ngo_id());
