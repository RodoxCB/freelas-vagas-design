"use server";

import { revalidatePath } from "next/cache";
import {
  linkDesignerTags,
  requireAuth,
  uploadImage,
  upsertTags,
} from "@/lib/auth/session";
import { normalizeWhatsapp } from "@/lib/utils/whatsapp";
import {
  designerFormSchema,
  formValuesToState,
  parseDesignerFormData,
  zodFieldErrors,
} from "@/lib/validations/designer";
import type { Designer, Tag } from "@/types/database";

export type DesignerFilters = {
  q?: string;
  especialidade?: string;
  nivel?: string;
  tag?: string;
};

export type DesignerFormState = {
  success: boolean;
  id?: string;
  hidden?: boolean;
  fieldErrors?: Record<string, string>;
  values?: Record<string, unknown>;
  message?: string;
};

async function attachTags(
  designers: Designer[],
  supabase: Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>
): Promise<Designer[]> {
  if (designers.length === 0) return designers;

  const ids = designers.map((d) => d.id);
  const { data: links } = await supabase
    .from("designer_tags")
    .select("designer_id, tag_id")
    .in("designer_id", ids);

  if (!links || links.length === 0) {
    return designers.map((d) => ({ ...d, tags: [] }));
  }

  const tagIds = [...new Set(links.map((l) => l.tag_id))];
  const { data: tags } = await supabase
    .from("tags")
    .select("*")
    .in("id", tagIds);

  const tagById = new Map((tags ?? []).map((t) => [t.id, t]));
  const tagMap = new Map<string, Tag[]>();

  for (const link of links) {
    const tag = tagById.get(link.tag_id);
    if (!tag) continue;
    const existing = tagMap.get(link.designer_id) ?? [];
    existing.push(tag);
    tagMap.set(link.designer_id, existing);
  }

  return designers.map((d) => ({ ...d, tags: tagMap.get(d.id) ?? [] }));
}

export async function getDesigners(
  filters: DesignerFilters = {}
): Promise<Designer[]> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  let query = supabase
    .from("designers")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters.nivel) query = query.eq("nivel", filters.nivel);
  if (filters.especialidade) {
    query = query.contains("especialidades", [filters.especialidade]);
  }
  if (filters.q) {
    const term = `%${filters.q}%`;
    query = query.or(`nome.ilike.${term},bio.ilike.${term}`);
  }

  const { data, error } = await query;
  if (error) {
    console.error("getDesigners error:", error);
    return [];
  }

  let designers = data ?? [];

  if (filters.tag) {
    const withTags = await attachTags(designers, supabase);
    designers = withTags.filter((d) =>
      d.tags?.some((t) => t.nome.toLowerCase() === filters.tag!.toLowerCase())
    );
    return designers;
  }

  return attachTags(designers, supabase);
}

export async function getFeaturedDesigners(limit = 6): Promise<Designer[]> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("designers")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return attachTags(data ?? [], supabase);
}

export async function getDesignerById(id: string): Promise<Designer | null> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("designers")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  const [withTags] = await attachTags([data], supabase);
  return withTags;
}

export async function getDesignerByUserId(userId: string): Promise<Designer | null> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("designers")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) return null;
  const [withTags] = await attachTags([data], supabase);
  return withTags;
}

export async function getTags(): Promise<Tag[]> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase.from("tags").select("*").order("nome");
  return data ?? [];
}

export async function createDesignerAction(
  _prev: DesignerFormState,
  formData: FormData
): Promise<DesignerFormState> {
  const auth = await requireAuth("designer");
  if (auth.error || !auth.user) {
    return { success: false, fieldErrors: { _form: auth.error ?? "Não autorizado" } };
  }

  const raw = parseDesignerFormData(formData);
  const values = formValuesToState(raw);
  const parsed = designerFormSchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, fieldErrors: zodFieldErrors(parsed.error), values };
  }

  let fotoUrl: string | null = null;
  const foto = formData.get("foto") as File | null;
  if (foto && foto.size > 0) {
    const upload = await uploadImage(auth.supabase, foto, "avatars", auth.user.id, "avatar");
    if ("error" in upload) {
      return { success: false, fieldErrors: { foto: upload.error }, values };
    }
    fotoUrl = upload.url;
  }

  const portfolioUrls = parsed.data.portfolio_urls.map((u) => u.trim());
  const status = portfolioUrls.length > 0 ? "ativo" : "oculto";

  const { data, error } = await auth.supabase
    .from("designers")
    .insert({
      user_id: auth.user.id,
      nome: parsed.data.nome,
      especialidades: parsed.data.especialidades,
      nivel: parsed.data.nivel,
      portfolio_urls: portfolioUrls,
      whatsapp: normalizeWhatsapp(parsed.data.whatsapp),
      linkedin_url: parsed.data.linkedin_url || null,
      foto_url: fotoUrl,
      bio: parsed.data.bio || null,
      localizacao: parsed.data.localizacao || null,
      status,
    })
    .select("id")
    .single();

  if (error) {
    console.error("createDesigner error:", error);
    return { success: false, fieldErrors: { _form: "Erro ao criar perfil. Tente novamente." }, values };
  }

  const tagIds = await upsertTags(auth.supabase, parsed.data.tags ?? []);
  await linkDesignerTags(auth.supabase, data.id, tagIds);

  revalidatePath("/designers");
  revalidatePath("/");

  return { success: true, id: data.id, hidden: status === "oculto" };
}

export async function updateDesignerAction(
  _prev: DesignerFormState,
  formData: FormData
): Promise<DesignerFormState> {
  const auth = await requireAuth("designer");
  if (auth.error || !auth.user) {
    return { success: false, fieldErrors: { _form: auth.error ?? "Não autorizado" } };
  }

  const designerId = formData.get("designer_id") as string;
  const existing = await getDesignerByUserId(auth.user.id);
  if (!existing || existing.id !== designerId) {
    return { success: false, fieldErrors: { _form: "Perfil não encontrado" } };
  }

  const raw = parseDesignerFormData(formData);
  const values = formValuesToState(raw);
  const parsed = designerFormSchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, fieldErrors: zodFieldErrors(parsed.error), values };
  }

  let fotoUrl = existing.foto_url;
  const foto = formData.get("foto") as File | null;
  if (foto && foto.size > 0) {
    const upload = await uploadImage(auth.supabase, foto, "avatars", auth.user.id, "avatar");
    if ("error" in upload) {
      return { success: false, fieldErrors: { foto: upload.error }, values };
    }
    fotoUrl = upload.url;
  }

  const portfolioUrls = parsed.data.portfolio_urls.map((u) => u.trim());
  const status = portfolioUrls.length > 0 ? "ativo" : "oculto";

  const { error } = await auth.supabase
    .from("designers")
    .update({
      nome: parsed.data.nome,
      especialidades: parsed.data.especialidades,
      nivel: parsed.data.nivel,
      portfolio_urls: portfolioUrls,
      whatsapp: normalizeWhatsapp(parsed.data.whatsapp),
      linkedin_url: parsed.data.linkedin_url || null,
      foto_url: fotoUrl,
      bio: parsed.data.bio || null,
      localizacao: parsed.data.localizacao || null,
      status,
    })
    .eq("id", designerId);

  if (error) {
    return { success: false, fieldErrors: { _form: "Erro ao atualizar perfil." }, values };
  }

  const tagIds = await upsertTags(auth.supabase, parsed.data.tags ?? []);
  await linkDesignerTags(auth.supabase, designerId, tagIds);

  revalidatePath("/designers");
  revalidatePath(`/designers/${designerId}`);

  return { success: true, id: designerId, hidden: status === "oculto" };
}
