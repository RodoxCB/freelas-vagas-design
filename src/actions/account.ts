"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteAuthUser } from "@/lib/admin/user-lifecycle";
import { requireAuth } from "@/lib/auth/session";
import type { Designer, Profile, Vaga } from "@/types/database";

export type AccountDataExport = {
  exported_at: string;
  profile: Profile | null;
  email: string | undefined;
  designer: Designer | null;
  vagas: Vaga[];
};

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
    const err = await deleteAuthUser(auth.user.id);
    if (err) {
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
