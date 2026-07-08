export const SITE_CONTENT_DEFAULTS: Record<string, string> = {
  "site.name": "Freelas e Vagas de Design",
  "site.description":
    "Encontre designers disponíveis e vagas de design de forma simples e rápida.",
  "footer.tagline":
    "Projeto comunitário para conectar designers e oportunidades.",

  "home.hero.title": "Freelas e Vagas de Design",
  "home.hero.subtitle":
    "Encontre designers disponíveis de forma simples e rápida",
  "home.featured.title": "Designers em destaque",
  "home.vagas.title": "Vagas recentes",
  "home.empty.designers": "Nenhum designer cadastrado ainda.",
  "home.empty.vagas": "Nenhuma vaga publicada ainda.",

  "home.block1.title": "Precisa de um designer?",
  "home.block1.text":
    "Encontre alguém disponível ou publique uma oportunidade e receba contatos direto",
  "home.block2.title": "Você é designer?",
  "home.block2.text":
    "Crie seu perfil para ser encontrado ou explore vagas abertas na comunidade",

  "home.how.title": "Como funciona",
  "home.how.step1.title": "Crie seu perfil ou publique uma vaga",
  "home.how.step1.text": "Sem cadastro complicado. Preencha o básico e pronto.",
  "home.how.step2.title": "Encontre oportunidades ou profissionais",
  "home.how.step2.text": "Busque por área, nível e disponibilidade.",
  "home.how.step3.title": "Converse direto pelo canal informado",
  "home.how.step3.text": "WhatsApp, email ou link externo. Sem intermediários.",

  "home.community.title": "Comunidade",
  "home.community.text":
    "Esse projeto nasceu de um grupo de designers que compartilham oportunidades todos os dias. A ideia é deixar isso mais organizado, aberto e fácil para todo mundo.",
  "home.community.button": "Entrar na comunidade",
  "comunidade.url": "",
  "comunidade.title": "Comunidade",
  "comunidade.lead": "Esse projeto existe por causa da comunidade.",
  "comunidade.body":
    "Aqui você encontra gente de verdade, disponível e aberta a trabalhar. O site é só uma forma de organizar e facilitar essas conexões.",
  "comunidade.button": "Entrar no grupo",

  "apoiar.title": "Apoiar",
  "apoiar.lead":
    "Se esse projeto te ajudou, você pode apoiar para manter tudo funcionando.",
  "apoiar.body": "Os custos são básicos e qualquer contribuição já ajuda.",
  "apoiar.note": "Em breve disponibilizaremos formas de apoio.",
  "apoiar.link_url": "",
  "apoiar.link_label": "",
};

export const SITE_CONTENT_GROUPS = [
  {
    id: "geral",
    label: "Geral",
    keys: ["site.name", "site.description", "footer.tagline", "comunidade.url"],
  },
  {
    id: "home",
    label: "Página inicial",
    keys: [
      "home.hero.title",
      "home.hero.subtitle",
      "home.featured.title",
      "home.vagas.title",
      "home.empty.designers",
      "home.empty.vagas",
      "home.block1.title",
      "home.block1.text",
      "home.block2.title",
      "home.block2.text",
      "home.how.title",
      "home.how.step1.title",
      "home.how.step1.text",
      "home.how.step2.title",
      "home.how.step2.text",
      "home.how.step3.title",
      "home.how.step3.text",
      "home.community.title",
      "home.community.text",
      "home.community.button",
    ],
  },
  {
    id: "comunidade",
    label: "Comunidade",
    keys: [
      "comunidade.title",
      "comunidade.lead",
      "comunidade.body",
      "comunidade.button",
    ],
  },
  {
    id: "apoiar",
    label: "Apoiar",
    keys: [
      "apoiar.title",
      "apoiar.lead",
      "apoiar.body",
      "apoiar.note",
      "apoiar.link_url",
      "apoiar.link_label",
    ],
  },
] as const;

export const SITE_CONTENT_LABELS: Record<string, string> = {
  "site.name": "Nome do site",
  "site.description": "Descrição (SEO)",
  "footer.tagline": "Texto do rodapé",
  "comunidade.url": "URL do grupo (WhatsApp etc.)",
  "home.hero.title": "Título principal",
  "home.hero.subtitle": "Subtítulo",
  "home.featured.title": "Título — designers em destaque",
  "home.vagas.title": "Título — vagas recentes",
  "home.empty.designers": "Mensagem — sem designers",
  "home.empty.vagas": "Mensagem — sem vagas",
  "home.block1.title": "Bloco 1 — título",
  "home.block1.text": "Bloco 1 — texto",
  "home.block2.title": "Bloco 2 — título",
  "home.block2.text": "Bloco 2 — texto",
  "home.how.title": "Como funciona — título",
  "home.how.step1.title": "Passo 1 — título",
  "home.how.step1.text": "Passo 1 — texto",
  "home.how.step2.title": "Passo 2 — título",
  "home.how.step2.text": "Passo 2 — texto",
  "home.how.step3.title": "Passo 3 — título",
  "home.how.step3.text": "Passo 3 — texto",
  "home.community.title": "Seção comunidade — título",
  "home.community.text": "Seção comunidade — texto",
  "home.community.button": "Seção comunidade — botão",
  "comunidade.title": "Página comunidade — título",
  "comunidade.lead": "Página comunidade — lead",
  "comunidade.body": "Página comunidade — corpo",
  "comunidade.button": "Página comunidade — botão",
  "apoiar.title": "Página apoiar — título",
  "apoiar.lead": "Página apoiar — lead",
  "apoiar.body": "Página apoiar — corpo",
  "apoiar.note": "Página apoiar — nota",
  "apoiar.link_url": "Link de apoio (URL)",
  "apoiar.link_label": "Link de apoio (texto do botão)",
};

export type SiteContentMap = Record<string, string>;

export function resolveComunidadeUrl(content: SiteContentMap): string {
  return (
    content["comunidade.url"]?.trim() ||
    process.env.NEXT_PUBLIC_COMUNIDADE_URL ||
    "/comunidade"
  );
}
