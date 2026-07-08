-- Avoid infinite RLS recursion: policies must not SELECT from profiles directly.
-- Use a SECURITY DEFINER helper that bypasses RLS when checking is_admin.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(
    (SELECT p.is_admin FROM public.profiles p WHERE p.id = auth.uid()),
    false
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

DROP POLICY IF EXISTS "profiles_admin_select_all" ON profiles;
CREATE POLICY "profiles_admin_select_all" ON profiles
  FOR SELECT TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "site_content_admin_insert" ON site_content;
CREATE POLICY "site_content_admin_insert" ON site_content
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "site_content_admin_update" ON site_content;
CREATE POLICY "site_content_admin_update" ON site_content
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "site_content_admin_delete" ON site_content;
CREATE POLICY "site_content_admin_delete" ON site_content
  FOR DELETE TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "designers_admin_select" ON designers;
CREATE POLICY "designers_admin_select" ON designers
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "designers_admin_delete" ON designers;
CREATE POLICY "designers_admin_delete" ON designers
  FOR DELETE TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "designers_admin_update" ON designers;
CREATE POLICY "designers_admin_update" ON designers
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "vagas_admin_select" ON vagas;
CREATE POLICY "vagas_admin_select" ON vagas
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "vagas_admin_delete" ON vagas;
CREATE POLICY "vagas_admin_delete" ON vagas
  FOR DELETE TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "vagas_admin_update" ON vagas;
CREATE POLICY "vagas_admin_update" ON vagas
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());
