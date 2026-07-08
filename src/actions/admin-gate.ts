"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_GATE_COOKIE,
  adminGateToken,
  verifyAdminPassword,
} from "@/lib/admin/gate";
import { requireAdmin } from "@/lib/auth/session";

export type AdminGateState = {
  error?: string;
};

export async function verifyAdminGateAction(
  _prev: AdminGateState,
  formData: FormData
): Promise<AdminGateState> {
  const auth = await requireAdmin();
  if (auth.error || !auth.user) {
    return { error: "Faça login com uma conta admin." };
  }

  const password = (formData.get("password") as string) ?? "";
  const redirectTo = (formData.get("redirect") as string) || "/admin";

  if (!verifyAdminPassword(password)) {
    return { error: "Senha de administração incorreta." };
  }

  const token = await adminGateToken();
  if (!token) {
    return { error: "ADMIN_PASSWORD não configurada no servidor." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_GATE_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  redirect(redirectTo.startsWith("/admin") ? redirectTo : "/admin");
}
