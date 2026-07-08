export type Profile = {
  id: string;
  tipo: "designer" | "anunciante";
  nome: string | null;
  is_admin: boolean;
  created_at: string;
  last_seen_at: string | null;
};

export type SiteContentRow = {
  key: string;
  value: unknown;
  updated_at: string;
  updated_by: string | null;
};

export type Tag = {
  id: string;
  nome: string;
  created_at: string;
};

export type Designer = {
  id: string;
  user_id: string;
  nome: string;
  foto_url: string | null;
  especialidades: string[];
  nivel: string;
  bio: string | null;
  portfolio_urls: string[];
  linkedin_url: string | null;
  whatsapp: string;
  localizacao: string | null;
  status: "ativo" | "oculto";
  consentimento_publicacao_at: string | null;
  created_at: string;
  tags?: Tag[];
};

export type DesignerInsert = {
  id?: string;
  user_id: string;
  nome: string;
  foto_url?: string | null;
  especialidades: string[];
  nivel: string;
  bio?: string | null;
  portfolio_urls: string[];
  linkedin_url?: string | null;
  whatsapp: string;
  localizacao?: string | null;
  status?: "ativo" | "oculto";
  consentimento_publicacao_at?: string | null;
  created_at?: string;
};

export type Vaga = {
  id: string;
  user_id: string;
  titulo: string;
  tipo: "freela" | "estagio" | "clt";
  descricao: string;
  requisitos: string | null;
  contato_email: string;
  contato_telefone: string;
  imagem_url: string | null;
  status: "ativa" | "encerrada";
  consentimento_publicacao_at: string | null;
  created_at: string;
  expires_at: string;
};

export type VagaInsert = {
  id?: string;
  user_id: string;
  titulo: string;
  tipo: "freela" | "estagio" | "clt";
  descricao: string;
  requisitos?: string | null;
  contato_email: string;
  contato_telefone: string;
  imagem_url?: string | null;
  status?: "ativa" | "encerrada";
  consentimento_publicacao_at?: string | null;
  created_at?: string;
  expires_at?: string;
};

export type RateLimit = {
  id: string;
  user_id: string;
  action: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "last_seen_at" | "is_admin"> & {
          created_at?: string;
          last_seen_at?: string | null;
          is_admin?: boolean;
        };
        Update: Partial<Profile>;
        Relationships: [];
      };
      tags: {
        Row: Tag;
        Insert: Omit<Tag, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Tag>;
        Relationships: [];
      };
      designer_tags: {
        Row: { designer_id: string; tag_id: string };
        Insert: { designer_id: string; tag_id: string };
        Update: Partial<{ designer_id: string; tag_id: string }>;
        Relationships: [];
      };
      designers: {
        Row: Designer;
        Insert: DesignerInsert;
        Update: Partial<DesignerInsert>;
        Relationships: [];
      };
      vagas: {
        Row: Vaga;
        Insert: VagaInsert;
        Update: Partial<VagaInsert>;
        Relationships: [];
      };
      rate_limits: {
        Row: RateLimit;
        Insert: Omit<RateLimit, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<RateLimit>;
        Relationships: [];
      };
      site_content: {
        Row: SiteContentRow;
        Insert: Omit<SiteContentRow, "updated_at" | "updated_by"> & {
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: Partial<SiteContentRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      anonymize_expired_vagas: { Args: Record<string, never>; Returns: number };
      get_inactive_users_for_deletion: {
        Args: Record<string, never>;
        Returns: { user_id: string }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
