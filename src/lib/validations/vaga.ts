import { z } from "zod";
import { TIPOS_VAGA } from "@/lib/constants";
import { brazilianPhoneSchema } from "@/lib/validations/phone";

const emailSchema = z.string().email("Informe um email válido");

export const vagaFormSchema = z.object({
  titulo: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  tipo: z.enum(TIPOS_VAGA, { message: "Selecione um tipo" }),
  descricao: z.string().min(20, "Descrição deve ter pelo menos 20 caracteres"),
  requisitos: z.string().optional(),
  contato_email: emailSchema,
  contato_telefone: brazilianPhoneSchema,
  consentimento_publicacao: z.literal(true, {
    message: "É necessário autorizar a exibição pública dos dados de contato",
  }),
});

export type VagaFormValues = z.infer<typeof vagaFormSchema>;

export function parseVagaFormData(formData: FormData) {
  return {
    titulo: (formData.get("titulo") as string) ?? "",
    tipo: (formData.get("tipo") as string) ?? "",
    descricao: (formData.get("descricao") as string) ?? "",
    requisitos: (formData.get("requisitos") as string) ?? "",
    contato_email: (formData.get("contato_email") as string) ?? "",
    contato_telefone: (formData.get("contato_telefone") as string) ?? "",
    consentimento_publicacao: formData.get("consentimento_publicacao") === "on",
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
