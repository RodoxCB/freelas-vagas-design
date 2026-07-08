"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/admin";
import { deleteAuthUser } from "@/lib/admin/user-lifecycle";
import { requireAdmin } from "@/lib/auth/session";
import {
  SITE_CONTENT_DEFAULTS,
  SITE_CONTENT_FIELD_META,
  SITE_CONTENT_GROUPS,
} from "@/lib/site-content/defaults";
import {
  isValidContentUrl,
  normalizeHexColor,
} from "@/lib/site-content/theme";
import type { Designer, Profile, Vaga } from "@/types/database";

export type AdminUserRow = {
  id: string;
  email: string;
  nome: string | null;
  tipo: Profile["tipo"];
  is_admin: boolean;
  created_at: string;
  last_seen_at: string | null;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
  designer_id: string | null;
  designer_foto_url: string | null;
  designer_status: Designer["status"] | null;
  vagas_count: number;
};

export type AdminUserDetail = {
  id: string;
  email: string;
  nome: string | null;
  tipo: Profile["tipo"];
  is_admin: boolean;
  created_at: string;
  last_seen_at: string | null;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
  designer: Designer | null;
  vagas: Vaga[];
  images: { url: string; label: string }[];
};

export type AdminStats = {
  users: number;
  designers: number;
  vagas: number;
  vagasAtivas: number;
};

export async function getAdminStats(): Promise<AdminStats | null> {
  const auth = await requireAdmin();
  if (auth.error) return null;

  const service = createServiceClient();
  const [profilesRes, designersRes, vagasRes, ativasRes] = await Promise.all([
    service.from("profiles").select("*", { count: "exact", head: true }),
    service.from("designers").select("*", { count: "exact", head: true }),
    service.from("vagas").select("*", { count: "exact", head: true }),
    service.from("vagas").select("*", { count: "exact", head: true }).eq("status", "ativa"),
  ]);

  return {
    users: profilesRes.count ?? 0,
    designers: designersRes.count ?? 0,
    vagas: vagasRes.count ?? 0,
    vagasAtivas: ativasRes.count ?? 0,
  };
}

export async function listUsersAdmin(): Promise<AdminUserRow[]> {
  const auth = await requireAdmin();
  if (auth.error) return [];

  const service = createServiceClient();
  const { data: usersData } = await service.auth.admin.listUsers({ perPage: 1000 });
  const users = usersData.users ?? [];

  const ids = users.map((u) => u.id);
  if (ids.length === 0) return [];

  const [{ data: profiles }, { data: designers }, { data: vagas }] = await Promise.all([
    service.from("profiles").select("*").in("id", ids),
    service.from("designers").select("id, user_id, foto_url, status").in("user_id", ids),
    service.from("vagas").select("user_id").in("user_id", ids),
  ]);

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));
  const designerByUser = new Map((designers ?? []).map((d) => [d.user_id, d]));
  const vagasCountByUser = new Map<string, number>();
  for (const vaga of vagas ?? []) {
    vagasCountByUser.set(vaga.user_id, (vagasCountByUser.get(vaga.user_id) ?? 0) + 1);
  }

  return users
    .map((u) => {
      const profile = profileById.get(u.id);
      const designer = designerByUser.get(u.id);
      return {
        id: u.id,
        email: u.email ?? "—",
        nome: profile?.nome ?? null,
        tipo: profile?.tipo ?? "designer",
        is_admin: profile?.is_admin ?? false,
        created_at: u.created_at,
        last_seen_at: profile?.last_seen_at ?? null,
        email_confirmed_at: u.email_confirmed_at ?? null,
        last_sign_in_at: u.last_sign_in_at ?? null,
        designer_id: designer?.id ?? null,
        designer_foto_url: designer?.foto_url ?? null,
        designer_status: designer?.status ?? null,
        vagas_count: vagasCountByUser.get(u.id) ?? 0,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
}

export async function getUserDetailAdmin(
  userId: string
): Promise<AdminUserDetail | null> {
  const auth = await requireAdmin();
  if (auth.error) return null;

  const service = createServiceClient();
  const { data: userData, error: userError } =
    await service.auth.admin.getUserById(userId);
  if (userError || !userData.user) return null;

  const user = userData.user;
  const [{ data: profile }, { data: designer }, { data: vagas }] = await Promise.all([
    service.from("profiles").select("*").eq("id", userId).maybeSingle(),
    service.from("designers").select("*").eq("user_id", userId).maybeSingle(),
    service.from("vagas").select("*").eq("user_id", userId).order("created_at", {
      ascending: false,
    }),
  ]);

  const images: { url: string; label: string }[] = [];
  if (designer?.foto_url) {
    images.push({ url: designer.foto_url, label: "Foto do perfil de designer" });
  }
  for (const vaga of vagas ?? []) {
    if (vaga.imagem_url) {
      images.push({ url: vaga.imagem_url, label: `Vaga: ${vaga.titulo}` });
    }
  }

  return {
    id: user.id,
    email: user.email ?? "—",
    nome: profile?.nome ?? null,
    tipo: profile?.tipo ?? "designer",
    is_admin: profile?.is_admin ?? false,
    created_at: user.created_at,
    last_seen_at: profile?.last_seen_at ?? null,
    email_confirmed_at: user.email_confirmed_at ?? null,
    last_sign_in_at: user.last_sign_in_at ?? null,
    designer: designer ?? null,
    vagas: vagas ?? [],
    images,
  };
}

export async function listDesignersAdmin(): Promise<Designer[]> {
  const auth = await requireAdmin();
  if (auth.error) return [];

  const { data } = await auth.supabase
    .from("designers")
    .select("*")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function listVagasAdmin(): Promise<Vaga[]> {
  const auth = await requireAdmin();
  if (auth.error) return [];

  const { data } = await auth.supabase
    .from("vagas")
    .select("*")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function deleteUserAdminAction(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const auth = await requireAdmin();
  if (auth.error || !auth.user) return { success: false, error: auth.error ?? "Não autorizado" };

  if (userId === auth.user.id) {
    return { success: false, error: "Você não pode excluir sua própria conta por aqui." };
  }

  const err = await deleteAuthUser(userId);
  if (err) return { success: false, error: err };

  revalidateAdminPaths();
  return { success: true };
}

export async function deleteDesignerAdminAction(
  designerId: string
): Promise<{ success: boolean; error?: string }> {
  const auth = await requireAdmin();
  if (auth.error) return { success: false, error: auth.error };

  const { error } = await auth.supabase.from("designers").delete().eq("id", designerId);
  if (error) return { success: false, error: "Erro ao excluir perfil." };

  revalidateAdminPaths();
  return { success: true };
}

export async function deleteVagaAdminAction(
  vagaId: string
): Promise<{ success: boolean; error?: string }> {
  const auth = await requireAdmin();
  if (auth.error) return { success: false, error: auth.error };

  const { error } = await auth.supabase.from("vagas").delete().eq("id", vagaId);
  if (error) return { success: false, error: "Erro ao excluir vaga." };

  revalidateAdminPaths();
  return { success: true };
}

export async function hideDesignerAdminAction(
  designerId: string
): Promise<{ success: boolean; error?: string }> {
  const auth = await requireAdmin();
  if (auth.error) return { success: false, error: auth.error };

  const { error } = await auth.supabase
    .from("designers")
    .update({ status: "oculto", consentimento_publicacao_at: null })
    .eq("id", designerId);

  if (error) return { success: false, error: "Erro ao ocultar perfil." };

  revalidateAdminPaths();
  return { success: true };
}

export async function toggleAdminAction(
  userId: string,
  makeAdmin: boolean
): Promise<{ success: boolean; error?: string }> {
  const auth = await requireAdmin();
  if (auth.error || !auth.user) return { success: false, error: auth.error ?? "Não autorizado" };

  if (userId === auth.user.id && !makeAdmin) {
    return { success: false, error: "Você não pode remover seu próprio acesso admin." };
  }

  const service = createServiceClient();
  const { error } = await service
    .from("profiles")
    .update({ is_admin: makeAdmin })
    .eq("id", userId);

  if (error) return { success: false, error: "Erro ao atualizar permissão." };

  revalidatePath("/admin/usuarios");
  return { success: true };
}

export async function makeAdminAction(formData: FormData): Promise<void> {
  const userId = formData.get("user_id") as string;
  await toggleAdminAction(userId, true);
}

export async function removeAdminAction(formData: FormData): Promise<void> {
  const userId = formData.get("user_id") as string;
  await toggleAdminAction(userId, false);
}

export type SiteContentFormState = {
  success?: boolean;
  error?: string;
};

function validateContentValue(
  key: string,
  raw: string
): { value: string } | { error: string } {
  const trimmed = raw.trim();
  const fieldType = SITE_CONTENT_FIELD_META[key]?.type;

  if (fieldType === "color") {
    if (!trimmed) {
      return { value: SITE_CONTENT_DEFAULTS[key] ?? "" };
    }
    const normalized = normalizeHexColor(trimmed);
    if (!normalized) {
      return { error: `Cor inválida em "${key}". Use formato #RRGGBB.` };
    }
    return { value: normalized };
  }

  if (fieldType === "url" && trimmed && !isValidContentUrl(trimmed)) {
    return { error: `URL inválida em "${key}".` };
  }

  return { value: trimmed };
}

export async function updateSiteContentSectionAction(
  _prev: SiteContentFormState,
  formData: FormData
): Promise<SiteContentFormState> {
  const auth = await requireAdmin();
  if (auth.error || !auth.user) {
    return { error: auth.error ?? "Não autorizado" };
  }

  const sectionId = (formData.get("section_id") as string) ?? "";
  const group = SITE_CONTENT_GROUPS.find((g) => g.id === sectionId);
  if (!group) {
    return { error: "Seção inválida." };
  }

  const rows: { key: string; value: { text: string }; updated_by: string }[] = [];

  for (const key of group.keys) {
    const raw = formData.get(key);
    if (typeof raw !== "string") continue;

    const validated = validateContentValue(key, raw);
    if ("error" in validated) {
      return { error: validated.error };
    }

    const defaultVal = SITE_CONTENT_DEFAULTS[key] ?? "";

    if (validated.value === defaultVal) {
      await auth.supabase.from("site_content").delete().eq("key", key);
      continue;
    }

    rows.push({
      key,
      value: { text: validated.value },
      updated_by: auth.user.id,
    });
  }

  if (rows.length > 0) {
    const { error } = await auth.supabase.from("site_content").upsert(
      rows.map((r) => ({
        key: r.key,
        value: r.value,
        updated_by: r.updated_by,
        updated_at: new Date().toISOString(),
      })),
      { onConflict: "key" }
    );

    if (error) {
      console.error("updateSiteContentSection:", error);
      return { error: "Erro ao salvar conteúdo." };
    }
  }

  revalidatePath("/", "layout");
  revalidatePath("/apoiar");
  revalidatePath("/comunidade");
  revalidatePath("/admin/conteudo");

  return { success: true };
}

/** @deprecated Use updateSiteContentSectionAction */
export async function updateSiteContentAction(
  _prev: SiteContentFormState,
  formData: FormData
): Promise<SiteContentFormState> {
  const auth = await requireAdmin();
  if (auth.error || !auth.user) {
    return { error: auth.error ?? "Não autorizado" };
  }

  const keys = SITE_CONTENT_GROUPS.flatMap((g) => g.keys);
  const rows: { key: string; value: { text: string }; updated_by: string }[] = [];

  for (const key of keys) {
    const raw = formData.get(key);
    if (typeof raw !== "string") continue;
    const trimmed = raw.trim();
    const defaultVal = SITE_CONTENT_DEFAULTS[key] ?? "";

    if (trimmed === defaultVal) {
      await auth.supabase.from("site_content").delete().eq("key", key);
      continue;
    }

    rows.push({
      key,
      value: { text: trimmed },
      updated_by: auth.user.id,
    });
  }

  if (rows.length > 0) {
    const { error } = await auth.supabase.from("site_content").upsert(
      rows.map((r) => ({
        key: r.key,
        value: r.value,
        updated_by: r.updated_by,
        updated_at: new Date().toISOString(),
      })),
      { onConflict: "key" }
    );

    if (error) {
      console.error("updateSiteContent:", error);
      return { error: "Erro ao salvar conteúdo." };
    }
  }

  revalidatePath("/", "layout");
  revalidatePath("/apoiar");
  revalidatePath("/comunidade");
  revalidatePath("/admin/conteudo");

  return { success: true };
}

function revalidateAdminPaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/usuarios");
  revalidatePath("/admin/designers");
  revalidatePath("/admin/vagas");
  revalidatePath("/designers");
  revalidatePath("/vagas");
  revalidatePath("/", "layout");
}
