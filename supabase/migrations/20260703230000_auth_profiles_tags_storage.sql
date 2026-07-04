-- Profiles (linked to Supabase Auth)
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo text NOT NULL CHECK (tipo IN ('designer', 'anunciante')),
  nome text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Tags system
CREATE TABLE tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE designer_tags (
  designer_id uuid NOT NULL REFERENCES designers(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (designer_id, tag_id)
);

-- Drop old designer visibility policy before column changes
DROP POLICY IF EXISTS "public_select_active_designers" ON designers;

-- Designers: new columns
ALTER TABLE designers ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE designers ADD COLUMN especialidades text[] NOT NULL DEFAULT '{}';
ALTER TABLE designers ADD COLUMN portfolio_urls text[] NOT NULL DEFAULT '{}';
ALTER TABLE designers ADD COLUMN linkedin_url text;

-- Migrate existing data
UPDATE designers SET especialidades = ARRAY[area] WHERE area IS NOT NULL AND area <> '';
UPDATE designers SET portfolio_urls = ARRAY[portfolio_url]
  WHERE portfolio_url IS NOT NULL AND portfolio_url <> '';

-- Migrate ferramentas to tags
INSERT INTO tags (nome)
SELECT DISTINCT trim(unnest(ferramentas))
FROM designers
WHERE ferramentas IS NOT NULL AND array_length(ferramentas, 1) > 0
ON CONFLICT (nome) DO NOTHING;

INSERT INTO designer_tags (designer_id, tag_id)
SELECT d.id, t.id
FROM designers d
CROSS JOIN LATERAL unnest(d.ferramentas) AS f(nome)
JOIN tags t ON t.nome = trim(f.nome)
WHERE d.ferramentas IS NOT NULL
ON CONFLICT DO NOTHING;

-- Drop old designer columns
ALTER TABLE designers DROP COLUMN IF EXISTS area;
ALTER TABLE designers DROP COLUMN IF EXISTS ocupado;
ALTER TABLE designers DROP COLUMN IF EXISTS disponibilidade;
ALTER TABLE designers DROP COLUMN IF EXISTS ferramentas;
ALTER TABLE designers DROP COLUMN IF EXISTS portfolio_url;

-- Vagas: new columns
ALTER TABLE vagas ADD COLUMN contato_email text;
ALTER TABLE vagas ADD COLUMN contato_telefone text;
ALTER TABLE vagas ADD COLUMN imagem_url text;
ALTER TABLE vagas ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Migrate vagas contact data
UPDATE vagas SET contato_email = contato_valor WHERE contato_tipo = 'email';
UPDATE vagas SET contato_telefone = contato_valor WHERE contato_tipo = 'whatsapp';
UPDATE vagas SET contato_telefone = contato_valor WHERE contato_tipo = 'link' AND contato_telefone IS NULL;
UPDATE vagas SET contato_email = 'contato@exemplo.com' WHERE contato_email IS NULL;
UPDATE vagas SET contato_telefone = '00000000000' WHERE contato_telefone IS NULL;

ALTER TABLE vagas DROP COLUMN IF EXISTS contato_tipo;
ALTER TABLE vagas DROP COLUMN IF EXISTS contato_valor;

ALTER TABLE vagas ALTER COLUMN contato_email SET NOT NULL;
ALTER TABLE vagas ALTER COLUMN contato_telefone SET NOT NULL;

-- Indexes
CREATE INDEX idx_designers_user_id ON designers (user_id);
CREATE INDEX idx_designers_especialidades ON designers USING GIN (especialidades);
CREATE INDEX idx_designers_portfolio_urls ON designers USING GIN (portfolio_urls);
CREATE INDEX idx_vagas_user_id ON vagas (user_id);
CREATE INDEX idx_tags_nome ON tags (nome);
CREATE INDEX idx_designer_tags_designer ON designer_tags (designer_id);
CREATE INDEX idx_designer_tags_tag ON designer_tags (tag_id);

-- Update designer visibility policy (portfolio_urls instead of portfolio_url)
CREATE POLICY "public_select_active_designers" ON designers
  FOR SELECT TO anon, authenticated
  USING (
    status = 'ativo'
    AND portfolio_urls IS NOT NULL
    AND array_length(portfolio_urls, 1) > 0
  );

-- Designer insert/update with auth
DROP POLICY IF EXISTS "public_insert_designers" ON designers;
CREATE POLICY "designer_select_own" ON designers
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "designer_insert_own" ON designers
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "designer_update_own" ON designers
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Vaga insert/update with auth
DROP POLICY IF EXISTS "public_insert_vagas" ON vagas;
CREATE POLICY "anunciante_insert_vagas" ON vagas
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "anunciante_update_own_vagas" ON vagas
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "anunciante_select_own_vagas" ON vagas
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Profiles RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

-- Tags: public read, authenticated insert
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE designer_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tags_public_select" ON tags
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "tags_authenticated_insert" ON tags
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "designer_tags_public_select" ON designer_tags
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "designer_tags_authenticated_insert" ON designer_tags
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "designer_tags_authenticated_delete" ON designer_tags
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM designers d
      WHERE d.id = designer_tags.designer_id AND d.user_id = auth.uid()
    )
  );

-- Storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/webp', 'image/png']),
  ('vagas', 'vagas', true, 5242880, ARRAY['image/jpeg', 'image/webp', 'image/png'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "avatars_public_read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars_auth_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "avatars_auth_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "vagas_public_read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'vagas');

CREATE POLICY "vagas_auth_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'vagas' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, tipo, nome)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'tipo', 'designer'),
    NEW.raw_user_meta_data->>'nome'
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
