"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/auth/session";
import type { Designer, Profile, Vaga } from "@/types/database";

export type AccountDataExport = {
  exported_at: string;
  profile: Profile | null;
  email: string | undefined;
  designer: Designer | null;
  vagas: Vaga[];
};

async function deleteUserStorage(userId: string) {
  const supabase = createServiceClient();

  for (const bucket of ["avatars", "vagas"] as const) {
    const { data: files } = await supabase.storage.from(bucket).list(userId);
    if (!files?.length) continue;

    const paths = files.map((file) => `${userId}/${file.name}`);
    await supabase.storage.from(bucket).remove(paths);
  }
}

export async function exportUserDataAction(): Promise<AccountDataExport | null> {
  const auth = await requireAuth();
  if (!auth.user) return null;

  const { data: designer } = await auth.supabase
    .from("designers")
    .select("*")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  const { data: vagas } = await auth.supabase
    .from("vagas")
    .select("*")
    .eq("user_id", auth.user.id);

  return {
    exported_at: new Date().toISOString(),
    profile: auth.profile,
    email: auth.user.email,
    designer: designer ?? null,
    vagas: vagas ?? [],
  };
}

export async function revokeConsentAction(): Promise<{ success: boolean; error?: string }> {
  const auth = await requireAuth();
  if (!auth.user) return { success: false, error: "Faça login para continuar" };

  const { data: designer } = await auth.supabase
    .from("designers")
    .select("id")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (designer) {
    const { error } = await auth.supabase
      .from("designers")
      .update({
        status: "oculto",
        consentimento_publicacao_at: null,
      })
      .eq("id", designer.id);

    if (error) return { success: false, error: "Não foi possível revogar o consentimento." };
  }

  revalidatePath("/designers");
  revalidatePath("/conta/dados");
  return { success: true };
}

export async function deleteAccountAction(): Promise<{ success: boolean; error?: string }> {
  const auth = await requireAuth();
  if (!auth.user) return { success: false, error: "Faça login para continuar" };

  const confirm = auth.user.email;
  if (!confirm) return { success: false, error: "Conta inválida." };

  try {
    await deleteUserStorage(auth.user.id);

    const service = createServiceClient();
    const { error } = await service.auth.admin.deleteUser(auth.user.id);

    if (error) {
      console.error("deleteUser error:", error);
      return { success: false, error: "Não foi possível excluir a conta. Tente novamente." };
    }
  } catch (err) {
    console.error("deleteAccount error:", err);
    return {
      success: false,
      error: "Serviço indisponível. Verifique SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/?conta-excluida=1");
}
