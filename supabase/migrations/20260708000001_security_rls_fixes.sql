-- Fix designer_tags: only owner can insert
DROP POLICY IF EXISTS "designer_tags_authenticated_insert" ON designer_tags;
CREATE POLICY "designer_tags_insert_own" ON designer_tags
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM designers d
      WHERE d.id = designer_id AND d.user_id = auth.uid()
    )
  );

-- Tags: validate name length and basic anti-spam
DROP POLICY IF EXISTS "tags_authenticated_insert" ON tags;
CREATE POLICY "tags_authenticated_insert" ON tags
  FOR INSERT TO authenticated
  WITH CHECK (
    char_length(trim(nome)) >= 1
    AND char_length(trim(nome)) <= 30
    AND trim(nome) ~ '^[^<>]+$'
  );

-- Storage DELETE for bucket owners
CREATE POLICY "avatars_auth_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "vagas_auth_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'vagas' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Remove legacy records without owner (pre-auth public inserts)
DELETE FROM designer_tags
WHERE designer_id IN (SELECT id FROM designers WHERE user_id IS NULL);

DELETE FROM designers WHERE user_id IS NULL;
DELETE FROM vagas WHERE user_id IS NULL;

-- Cascade delete user-owned content when auth account is removed
ALTER TABLE designers DROP CONSTRAINT IF EXISTS designers_user_id_fkey;
ALTER TABLE designers
  ADD CONSTRAINT designers_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE vagas DROP CONSTRAINT IF EXISTS vagas_user_id_fkey;
ALTER TABLE vagas
  ADD CONSTRAINT vagas_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE designers ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE vagas ALTER COLUMN user_id SET NOT NULL;

-- LGPD consent proof
ALTER TABLE designers ADD COLUMN IF NOT EXISTS consentimento_publicacao_at timestamptz;
ALTER TABLE vagas ADD COLUMN IF NOT EXISTS consentimento_publicacao_at timestamptz;

-- Activity tracking for retention policy
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_seen_at timestamptz DEFAULT now();
UPDATE profiles SET last_seen_at = created_at WHERE last_seen_at IS NULL;

-- Rate limiting (server/service role only — no client policies)
CREATE TABLE IF NOT EXISTS rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_user_action
  ON rate_limits (user_id, action, created_at DESC);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Retention: anonymize contact data 90 days after expiration
CREATE OR REPLACE FUNCTION public.anonymize_expired_vagas()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  affected integer;
BEGIN
  UPDATE vagas
  SET
    contato_email = 'removido@anonimo.local',
    contato_telefone = '00000000000',
    status = 'encerrada'
  WHERE expires_at < now() - interval '90 days'
    AND contato_email <> 'removido@anonimo.local';

  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$;

-- Users eligible for deletion: inactive 12+ months, no active jobs, hidden or no designer profile
CREATE OR REPLACE FUNCTION public.get_inactive_users_for_deletion()
RETURNS TABLE(user_id uuid)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id
  FROM profiles p
  LEFT JOIN designers d ON d.user_id = p.id
  LEFT JOIN vagas v ON v.user_id = p.id AND v.status = 'ativa'
  WHERE COALESCE(p.last_seen_at, p.created_at) < now() - interval '12 months'
    AND v.id IS NULL
    AND (d.id IS NULL OR d.status = 'oculto');
$$;

REVOKE ALL ON FUNCTION public.anonymize_expired_vagas() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_inactive_users_for_deletion() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.anonymize_expired_vagas() TO service_role;
GRANT EXECUTE ON FUNCTION public.get_inactive_users_for_deletion() TO service_role;
