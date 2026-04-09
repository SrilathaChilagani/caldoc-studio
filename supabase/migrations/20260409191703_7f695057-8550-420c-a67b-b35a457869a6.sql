CREATE OR REPLACE FUNCTION public.assign_default_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _portal text;
BEGIN
  _portal := NEW.raw_user_meta_data->>'portal';

  IF _portal IS NOT NULL AND _portal IN ('admin', 'provider', 'pharmacy', 'labs', 'patient') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, _portal::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_assign_role
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.assign_default_role();