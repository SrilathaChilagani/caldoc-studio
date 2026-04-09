
-- Fix 1: Drop and recreate policies on campaigns to use {authenticated} instead of {public}
DROP POLICY IF EXISTS "Members can create campaigns" ON public.campaigns;
CREATE POLICY "Members can create campaigns" ON public.campaigns FOR INSERT TO authenticated WITH CHECK (ngo_id = get_user_ngo_id());

DROP POLICY IF EXISTS "Members can update their NGO campaigns" ON public.campaigns;
CREATE POLICY "Members can update their NGO campaigns" ON public.campaigns FOR UPDATE TO authenticated USING (ngo_id = get_user_ngo_id());

DROP POLICY IF EXISTS "Members can view their NGO campaigns" ON public.campaigns;
CREATE POLICY "Members can view their NGO campaigns" ON public.campaigns FOR SELECT TO authenticated USING (ngo_id = get_user_ngo_id());

-- Fix 2: Drop and recreate policies on volunteers to use {authenticated}
DROP POLICY IF EXISTS "Members can create volunteers" ON public.volunteers;
CREATE POLICY "Members can create volunteers" ON public.volunteers FOR INSERT TO authenticated WITH CHECK (ngo_id = get_user_ngo_id());

DROP POLICY IF EXISTS "Members can update their NGO volunteers" ON public.volunteers;
CREATE POLICY "Members can update their NGO volunteers" ON public.volunteers FOR UPDATE TO authenticated USING (ngo_id = get_user_ngo_id());

DROP POLICY IF EXISTS "Members can view their NGO volunteers" ON public.volunteers;
CREATE POLICY "Members can view their NGO volunteers" ON public.volunteers FOR SELECT TO authenticated USING (ngo_id = get_user_ngo_id());

-- Fix 3: Drop and recreate policies on ngo_reservations to use {authenticated}
DROP POLICY IF EXISTS "Members can create reservations" ON public.ngo_reservations;
CREATE POLICY "Members can create reservations" ON public.ngo_reservations FOR INSERT TO authenticated WITH CHECK (ngo_id = get_user_ngo_id());

DROP POLICY IF EXISTS "Members can update their NGO reservations" ON public.ngo_reservations;
CREATE POLICY "Members can update their NGO reservations" ON public.ngo_reservations FOR UPDATE TO authenticated USING (ngo_id = get_user_ngo_id());

DROP POLICY IF EXISTS "Members can view their NGO reservations" ON public.ngo_reservations;
CREATE POLICY "Members can view their NGO reservations" ON public.ngo_reservations FOR SELECT TO authenticated USING (ngo_id = get_user_ngo_id());

-- Fix 4: Drop and recreate policy on ngo_members to use {authenticated}
DROP POLICY IF EXISTS "Users can see their own memberships" ON public.ngo_members;
CREATE POLICY "Users can see their own memberships" ON public.ngo_members FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Fix 5: Drop and recreate policies on ngos to use {authenticated}
DROP POLICY IF EXISTS "Members can view their NGO" ON public.ngos;
CREATE POLICY "Members can view their NGO" ON public.ngos FOR SELECT TO authenticated USING (id = get_user_ngo_id());

-- Fix 6: Set search_path on functions missing it
CREATE OR REPLACE FUNCTION public.move_to_dlq(source_queue text, dlq_name text, message_id bigint, payload jsonb)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE new_id BIGINT;
BEGIN
  SELECT pgmq.send(dlq_name, payload) INTO new_id;
  PERFORM pgmq.delete(source_queue, message_id);
  RETURN new_id;
EXCEPTION WHEN undefined_table THEN
  BEGIN
    PERFORM pgmq.create(dlq_name);
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
  SELECT pgmq.send(dlq_name, payload) INTO new_id;
  BEGIN
    PERFORM pgmq.delete(source_queue, message_id);
  EXCEPTION WHEN undefined_table THEN
    NULL;
  END;
  RETURN new_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.enqueue_email(queue_name text, payload jsonb)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN pgmq.send(queue_name, payload);
EXCEPTION WHEN undefined_table THEN
  PERFORM pgmq.create(queue_name);
  RETURN pgmq.send(queue_name, payload);
END;
$$;

CREATE OR REPLACE FUNCTION public.read_email_batch(queue_name text, batch_size integer, vt integer)
RETURNS TABLE(msg_id bigint, read_ct integer, message jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY SELECT r.msg_id, r.read_ct, r.message FROM pgmq.read(queue_name, vt, batch_size) r;
EXCEPTION WHEN undefined_table THEN
  PERFORM pgmq.create(queue_name);
  RETURN;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_email(queue_name text, message_id bigint)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN pgmq.delete(queue_name, message_id);
EXCEPTION WHEN undefined_table THEN
  RETURN FALSE;
END;
$$;
