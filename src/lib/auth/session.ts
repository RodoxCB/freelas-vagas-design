import { createClient } from "@/lib/supabase/server";
import { processImage, validateImageFile } from "@/lib/images/process";
import { normalizeTagName } from "@/lib/security/sanitize";
import { touchLastSeen } from "@/lib/auth/activity";
import type { Profile } from "@/types/database";

export async function getSession() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function getProfile(): Promise<Profile | null> {
  const { supabase, user } = await getSession();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

export async function requireAuth(tipo?: "designer" | "anunciante") {
  const { supabase, user } = await getSession();
  if (!user) return { error: "Faça login para continuar", supabase, user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) return { error: "Perfil não encontrado", supabase, user, profile: null };
  if (tipo && profile.tipo !== tipo) {
    return {
      error: tipo === "designer"
        ? "Esta ação é apenas para designers"
        : "Esta ação é apenas para anunciantes",
      supabase,
      user,
      profile,
    };
  }

  void touchLastSeen(user.id);

  return { error: null, supabase, user, profile };
}

export async function requireAdmin() {
  const auth = await requireAuth();
  if (auth.error || !auth.user || !auth.profile) return auth;
  if (!auth.profile.is_admin) {
    return {
      ...auth,
      error: "Acesso restrito a administradores",
    };
  }
  return { ...auth, error: null };
}

export async function uploadImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File,
  bucket: "avatars" | "vagas",
  userId: string,
  prefix: string
): Promise<{ url: string } | { error: string }> {
  const validationError = validateImageFile(file);
  if (validationError) return { error: validationError };

  const arrayBuffer = await file.arrayBuffer();
  const processed = await processImage(Buffer.from(arrayBuffer));
  const path = `${userId}/${prefix}-${Date.now()}.${processed.extension}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, processed.buffer, {
      contentType: processed.contentType,
      upsert: true,
    });

  if (error) return { error: "Erro ao enviar imagem. Tente novamente." };

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl };
}

export async function upsertTags(
  supabase: Awaited<ReturnType<typeof createClient>>,
  tagNames: string[]
): Promise<string[]> {
  const ids: string[] = [];
  const unique = [...new Set(tagNames.map((n) => normalizeTagName(n)).filter(Boolean))].slice(
    0,
    15
  ) as string[];

  for (const trimmed of unique) {
    const { data: existing } = await supabase
      .from("tags")
      .select("id")
      .ilike("nome", trimmed)
      .maybeSingle();

    if (existing) {
      ids.push(existing.id);
      continue;
    }

    const { data: created, error } = await supabase
      .from("tags")
      .insert({ nome: trimmed })
      .select("id")
      .single();

    if (!error && created) ids.push(created.id);
  }
  return ids;
}

export async function linkDesignerTags(
  supabase: Awaited<ReturnType<typeof createClient>>,
  designerId: string,
  tagIds: string[]
) {
  await supabase.from("designer_tags").delete().eq("designer_id", designerId);
  if (tagIds.length === 0) return;

  await supabase.from("designer_tags").insert(
    tagIds.map((tag_id) => ({ designer_id: designerId, tag_id }))
  );
}
