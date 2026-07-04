export const ESPECIALIDADES = [
  "UI Design",
  "UX Research",
  "Product Design",
  "Motion",
  "Branding",
  "Design Gráfico",
  "3D",
  "UX/UI",
] as const;

export const NIVEIS = ["Estágio", "Júnior", "Pleno", "Sênior"] as const;

export const TIPOS_VAGA = ["freela", "estagio", "clt"] as const;

export const USER_TIPOS = ["designer", "anunciante"] as const;

export const TIPO_VAGA_LABELS: Record<string, string> = {
  freela: "Freela",
  estagio: "Estágio",
  clt: "CLT",
};

export const USER_TIPO_LABELS: Record<string, string> = {
  designer: "Designer",
  anunciante: "Anunciante",
};

export const MAX_PORTFOLIO_LINKS = 4;

export const DEFAULT_TAGS = [
  "Figma",
  "Photoshop",
  "Illustrator",
  "After Effects",
  "Premiere",
  "Blender",
  "InDesign",
  "Sketch",
  "Framer",
  "Notion",
] as const;
