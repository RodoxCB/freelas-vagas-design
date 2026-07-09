export const ESPECIALIDADES_GRUPOS = [
  {
    categoria: "UX, Produto e Estratégia",
    itens: [
      "UI Design",
      "UX Research",
      "Product Design",
      "UX/UI",
      "Design System",
      "Service Design",
      "UX Writing",
      "Content Design",
      "Interaction Design",
      "Information Architecture",
      "UX Strategy",
      "Design Ops",
      "Acessibilidade (A11y)",
    ],
  },
  {
    categoria: "Digital e Interfaces",
    itens: [
      "Web Design",
      "App Design",
      "Mobile Design",
      "Dashboard Design",
      "SaaS Design",
      "E-commerce Design",
      "Landing Page",
      "No-code Design",
      "Frontend Design",
      "Design de Conversão",
      "Prototipagem",
    ],
  },
  {
    categoria: "Marketing e Comunicação",
    itens: [
      "Social Media",
      "Marketing Design",
      "Growth Design",
      "Email Design",
      "Apresentações",
      "Infográficos",
    ],
  },
  {
    categoria: "Branding e Identidade Visual",
    itens: [
      "Branding",
      "Design Gráfico",
      "Identidade Visual",
      "Logo Design",
      "Tipografia",
      "Iconografia",
      "Ilustração",
      "Direção de Arte",
      "Design de Embalagem",
      "Merchandising",
    ],
  },
  {
    categoria: "Motion e Audiovisual",
    itens: [
      "Motion",
      "Motion Graphics",
      "Animação 2D",
      "Vídeo Design",
      "Edição de Vídeo",
    ],
  },
  {
    categoria: "3D, Games e Imersivo",
    itens: [
      "3D",
      "Modelagem 3D",
      "Render 3D",
      "Game UI",
      "Game Art",
      "Concept Art",
      "AR/VR Design",
      "Spatial Design",
    ],
  },
  {
    categoria: "Editorial e Impresso",
    itens: ["Editorial Design", "Design Impresso", "Sinalização"],
  },
  {
    categoria: "IA e Emergentes",
    itens: ["AI Designer", "AI Builder", "Design Generativo", "Prompt Design"],
  },
  {
    categoria: "Outros nichos",
    itens: ["Design de Produto Físico", "Design de Exposição"],
  },
] as const;

export const ESPECIALIDADES: readonly string[] = ESPECIALIDADES_GRUPOS.flatMap(
  (grupo) => grupo.itens
);

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
