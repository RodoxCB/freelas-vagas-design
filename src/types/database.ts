export type Profile = {
  id: string;
  tipo: "designer" | "anunciante";
  nome: string | null;
  created_at: string;
};

export type Tag = {
  id: string;
  nome: string;
  created_at: string;
};

export type Designer = {
  id: string;
  user_id: string | null;
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
  created_at: string;
  tags?: Tag[];
};

export type DesignerInsert = {
  id?: string;
  user_id?: string | null;
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
  created_at?: string;
};

export type Vaga = {
  id: string;
  user_id: string | null;
  titulo: string;
  tipo: "freela" | "estagio" | "clt";
  descricao: string;
  requisitos: string | null;
  contato_email: string;
  contato_telefone: string;
  imagem_url: string | null;
  status: "ativa" | "encerrada";
  created_at: string;
  expires_at: string;
};

export type VagaInsert = {
  id?: string;
  user_id?: string | null;
  titulo: string;
  tipo: "freela" | "estagio" | "clt";
  descricao: string;
  requisitos?: string | null;
  contato_email: string;
  contato_telefone: string;
  imagem_url?: string | null;
  status?: "ativa" | "encerrada";
  created_at?: string;
  expires_at?: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at"> & { created_at?: string };
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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
