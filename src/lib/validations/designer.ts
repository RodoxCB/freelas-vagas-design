import { z } from "zod";
import { MAX_PORTFOLIO_LINKS, NIVEIS } from "@/lib/constants";

const urlSchema = z.string().url("Informe uma URL válida");

export const designerFormSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  especialidades: z
    .array(z.string())
    .min(1, "Selecione pelo menos uma especialidade"),
  nivel: z.enum(NIVEIS, { message: "Selecione um nível" }),
  portfolio_urls: z
    .array(urlSchema)
    .min(1, "Informe pelo menos um link de portfólio")
    .max(MAX_PORTFOLIO_LINKS, `Máximo de ${MAX_PORTFOLIO_LINKS} links`),
  whatsapp: z.string().min(10, "Informe um WhatsApp válido"),
  linkedin_url: z.union([urlSchema, z.literal("")]).optional(),
  bio: z.string().max(500).optional(),
  tags: z.array(z.string()).optional(),
  localizacao: z.string().optional(),
});

export type DesignerFormValues = z.infer<typeof designerFormSchema>;

export function parseDesignerFormData(formData: FormData) {
  const portfolioUrls = [
    formData.get("portfolio_url_1"),
    formData.get("portfolio_url_2"),
    formData.get("portfolio_url_3"),
    formData.get("portfolio_url_4"),
  ]
    .filter((v): v is string => typeof v === "string" && v.trim() !== "");

  const tagsRaw = formData.get("tags") as string;
  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return {
    nome: (formData.get("nome") as string) ?? "",
    especialidades: formData.getAll("especialidades") as string[],
    nivel: (formData.get("nivel") as string) ?? "",
    portfolio_urls: portfolioUrls,
    whatsapp: (formData.get("whatsapp") as string) ?? "",
    linkedin_url: (formData.get("linkedin_url") as string) ?? "",
    bio: (formData.get("bio") as string) ?? "",
    tags,
    localizacao: (formData.get("localizacao") as string) ?? "",
  };
}

export function formValuesToState(values: ReturnType<typeof parseDesignerFormData>) {
  return {
    nome: values.nome,
    especialidades: values.especialidades,
    nivel: values.nivel,
    portfolio_urls: values.portfolio_urls,
    whatsapp: values.whatsapp,
    linkedin_url: values.linkedin_url,
    bio: values.bio,
    tags: values.tags,
    localizacao: values.localizacao,
  };
}

export function zodFieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0]?.toString() ?? "_form";
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}
