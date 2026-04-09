-- Emergency bookings table
CREATE TABLE public.emergency_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  booking_id TEXT NOT NULL UNIQUE,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  symptoms TEXT,
  consultation_type TEXT NOT NULL DEFAULT 'VIDEO',
  status TEXT NOT NULL DEFAULT 'pending',
  assigned_doctor_id UUID,
  assigned_doctor_name TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.emergency_bookings ENABLE ROW LEVEL SECURITY;

-- Users can create their own emergency bookings
CREATE POLICY "Users can create own emergency bookings"
  ON public.emergency_bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own emergency bookings
CREATE POLICY "Users can view own emergency bookings"
  ON public.emergency_bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all emergency bookings
CREATE POLICY "Admins can view all emergency bookings"
  ON public.emergency_bookings
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update all emergency bookings (assign doctors, change status)
CREATE POLICY "Admins can update all emergency bookings"
  ON public.emergency_bookings
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_emergency_bookings_updated_at
  BEFORE UPDATE ON public.emergency_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index for quick lookups
CREATE INDEX idx_emergency_bookings_user_id ON public.emergency_bookings(user_id);
CREATE INDEX idx_emergency_bookings_status ON public.emergency_bookings(status);