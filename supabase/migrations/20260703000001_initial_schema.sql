-- Designers
CREATE TABLE designers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  foto_url text,
  area text NOT NULL,
  nivel text NOT NULL,
  bio text,
  ferramentas text[] DEFAULT '{}',
  portfolio_url text NOT NULL,
  whatsapp text NOT NULL,
  disponibilidade text[] NOT NULL DEFAULT '{}',
  ocupado boolean NOT NULL DEFAULT false,
  localizacao text,
  status text NOT NULL DEFAULT 'oculto'
    CHECK (status IN ('ativo', 'oculto')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Vagas
CREATE TABLE vagas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('freela', 'estagio', 'clt')),
  descricao text NOT NULL,
  requisitos text,
  contato_tipo text NOT NULL CHECK (contato_tipo IN ('whatsapp', 'email', 'link')),
  contato_valor text NOT NULL,
  status text NOT NULL DEFAULT 'ativa' CHECK (status IN ('ativa', 'encerrada')),
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '45 days')
);

-- Indexes
CREATE INDEX idx_designers_area ON designers (area);
CREATE INDEX idx_designers_nivel ON designers (nivel);
CREATE INDEX idx_designers_status ON designers (status);
CREATE INDEX idx_designers_created_at ON designers (created_at DESC);
CREATE INDEX idx_designers_ferramentas ON designers USING GIN (ferramentas);
CREATE INDEX idx_designers_disponibilidade ON designers USING GIN (disponibilidade);

CREATE INDEX idx_vagas_status ON vagas (status);
CREATE INDEX idx_vagas_expires_at ON vagas (expires_at);
CREATE INDEX idx_vagas_created_at ON vagas (created_at DESC);
CREATE INDEX idx_vagas_tipo ON vagas (tipo);

-- RLS
ALTER TABLE designers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vagas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_select_active_designers" ON designers
  FOR SELECT TO anon, authenticated
  USING (
    status = 'ativo'
    AND portfolio_url IS NOT NULL
    AND portfolio_url <> ''
  );

CREATE POLICY "public_insert_designers" ON designers
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "public_select_active_vagas" ON vagas
  FOR SELECT TO anon, authenticated
  USING (status = 'ativa' AND expires_at > now());

CREATE POLICY "public_insert_vagas" ON vagas
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);
