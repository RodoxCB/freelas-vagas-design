import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

const designers = [
  {
    nome: "Ana Silva",
    especialidades: ["UI Design", "UX Research"],
    nivel: "Pleno",
    bio: "Designer de produto com foco em apps mobile e web.",
    portfolio_urls: ["https://behance.net"],
    whatsapp: "5511999990001",
    localizacao: "São Paulo, SP",
    status: "ativo",
  },
  {
    nome: "Bruno Costa",
    especialidades: ["Branding", "Design Gráfico"],
    nivel: "Sênior",
    bio: "Especialista em branding e identidade visual.",
    portfolio_urls: ["https://dribbble.com"],
    whatsapp: "5511999990002",
    localizacao: "Rio de Janeiro, RJ",
    status: "ativo",
  },
];

const tagNames = ["Figma", "Photoshop", "Illustrator", "After Effects"];
const tagIds: string[] = [];

for (const nome of tagNames) {
  const { data } = await supabase.from("tags").upsert({ nome }, { onConflict: "nome" }).select("id").single();
  if (data) tagIds.push(data.id);
}

for (const d of designers) {
  const { data, error } = await supabase.from("designers").insert(d).select("id").single();
  if (error) { console.error(error.message); continue; }
  await supabase.from("designer_tags").insert(
    tagIds.slice(0, 2).map((tag_id) => ({ designer_id: data.id, tag_id }))
  );
  console.log("designer:", d.nome);
}

const { error: vagaError } = await supabase.from("vagas").insert({
  titulo: "Designer UX/UI para app de saúde",
  tipo: "freela",
  descricao: "Buscamos designer para criar fluxos e telas de um app de telemedicina.",
  requisitos: "Experiência com apps mobile, Figma.",
  contato_email: "vagas@agencia.com.br",
  contato_telefone: "5511999990001",
  status: "ativa",
});

if (vagaError) console.error(vagaError.message);
else console.log("vaga seeded");
