"use server";

import { revalidatePath } from "next/cache";
import { requireAuth, uploadImage } from "@/lib/auth/session";
import { normalizePhone } from "@/lib/utils/phone";
import {
  parseVagaFormData,
  vagaFormSchema,
  zodFieldErrors,
} from "@/lib/validations/vaga";
import { checkRateLimit } from "@/lib/security/rate-limit";
import type { Vaga } from "@/types/database";

export type VagaFilters = {
  q?: string;
  tipo?: Vaga["tipo"];
};

export type VagaFormState = {
  success: boolean;
  id?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
  message?: string;
};

export async function getVagas(filters: VagaFilters = {}): Promise<Vaga[]> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  let query = supabase
    .from("vagas")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters.tipo) query = query.eq("tipo", filters.tipo);
  if (filters.q) {
    const term = `%${filters.q}%`;
    query = query.or(
      `titulo.ilike.${term},descricao.ilike.${term},requisitos.ilike.${term}`
    );
  }

  const { data, error } = await query;
  if (error) {
    console.error("getVagas error:", error);
    return [];
  }
  return data ?? [];
}

export async function getRecentVagas(limit = 5): Promise<Vaga[]> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vagas")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data ?? [];
}

export async function getVagaById(id: string): Promise<Vaga | null> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vagas")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function getMyVagas(): Promise<Vaga[]> {
  const auth = await requireAuth();
  if (auth.error || !auth.user) return [];

  const { data } = await auth.supabase
    .from("vagas")
    .select("*")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function createVagaAction(
  _prev: VagaFormState,
  formData: FormData
): Promise<VagaFormState> {
  const auth = await requireAuth();
  if (auth.error || !auth.user) {
    return { success: false, fieldErrors: { _form: auth.error ?? "Não autorizado" } };
  }

  const raw = parseVagaFormData(formData);
  const { consentimento_publicacao: _consent, ...valuesForState } = raw;
  const parsed = vagaFormSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: zodFieldErrors(parsed.error),
      values: valuesForState,
    };
  }

  const rateError = await checkRateLimit(auth.user.id, "create_vaga");
  if (rateError) {
    return { success: false, fieldErrors: { _form: rateError }, values: valuesForState };
  }

  let imagemUrl: string | null = null;
  const imagem = formData.get("imagem") as File | null;
  if (imagem && imagem.size > 0) {
    const upload = await uploadImage(auth.supabase, imagem, "vagas", auth.user.id, "vaga");
    if ("error" in upload) {
      return { success: false, fieldErrors: { imagem: upload.error }, values: valuesForState };
    }
    imagemUrl = upload.url;
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 45);

  const { data, error } = await auth.supabase
    .from("vagas")
    .insert({
      user_id: auth.user.id,
      titulo: parsed.data.titulo,
      tipo: parsed.data.tipo,
      descricao: parsed.data.descricao,
      requisitos: parsed.data.requisitos || null,
      contato_email: parsed.data.contato_email,
      contato_telefone: normalizePhone(parsed.data.contato_telefone),
      imagem_url: imagemUrl,
      status: "ativa",
      expires_at: expiresAt.toISOString(),
      consentimento_publicacao_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    console.error("createVaga error:", error);
    return { success: false, fieldErrors: { _form: "Erro ao publicar vaga." }, values: valuesForState };
  }

  revalidatePath("/vagas");
  revalidatePath("/");

  return { success: true, id: data.id };
}

export async function encerrarVagaAction(vagaId: string): Promise<{ success: boolean }> {
  const auth = await requireAuth();
  if (auth.error || !auth.user) return { success: false };

  const { error } = await auth.supabase
    .from("vagas")
    .update({ status: "encerrada" })
    .eq("id", vagaId)
    .eq("user_id", auth.user.id);

  if (error) return { success: false };

  revalidatePath("/vagas");
  revalidatePath("/vagas/minhas");
  return { success: true };
}
