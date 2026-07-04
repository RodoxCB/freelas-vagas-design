"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const signUpSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  tipo: z.enum(["designer", "anunciante"]),
});

const signInSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Informe sua senha"),
});

const resetSchema = z.object({
  email: z.string().email("Email inválido"),
});

const updatePasswordSchema = z
  .object({
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type AuthFormState = {
  success?: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
};

function fieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0]?.toString() ?? "_form";
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

export async function signUpAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const values = {
    nome: (formData.get("nome") as string) ?? "",
    email: (formData.get("email") as string) ?? "",
    password: (formData.get("password") as string) ?? "",
    tipo: (formData.get("tipo") as string) ?? "designer",
  };

  const parsed = signUpSchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error), values };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { nome: parsed.data.nome, tipo: parsed.data.tipo },
    },
  });

  if (error) {
    return {
      fieldErrors: { _form: "Não foi possível criar a conta. Tente novamente." },
      values,
    };
  }

  if (parsed.data.tipo === "designer") redirect("/designers/novo");
  redirect("/vagas/nova");
}

export async function signInAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const values = {
    email: (formData.get("email") as string) ?? "",
    password: (formData.get("password") as string) ?? "",
    redirect: (formData.get("redirect") as string) ?? "",
  };

  const parsed = signInSchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error), values };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: values.password,
  });

  if (error) {
    return {
      fieldErrors: { _form: "Email ou senha incorretos" },
      values,
    };
  }

  redirect(values.redirect || "/");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function forgotPasswordAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const values = { email: (formData.get("email") as string) ?? "" };
  const parsed = resetSchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error), values };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/auth/callback?next=/redefinir-senha`,
  });

  return {
    success: true,
    message:
      "Se o email existir, você receberá instruções para redefinir sua senha",
    values,
  };
}

export async function updatePasswordAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const values = {
    password: (formData.get("password") as string) ?? "",
    confirmPassword: (formData.get("confirmPassword") as string) ?? "",
  };

  const parsed = updatePasswordSchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error), values };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return {
      fieldErrors: { _form: "Não foi possível atualizar a senha. Tente novamente." },
      values,
    };
  }

  return { success: true, message: "Senha atualizada com sucesso" };
}
