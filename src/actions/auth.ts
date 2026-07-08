"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { touchLastSeen } from "@/lib/auth/activity";
import { verifyTurnstile } from "@/lib/security/captcha";
import { passwordSchema } from "@/lib/security/password";
import { z } from "zod";

const signUpSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: passwordSchema,
  tipo: z.enum(["designer", "anunciante"]),
  aceite_termos: z.literal(true, {
    message: "É necessário aceitar os Termos e a Política de Privacidade",
  }),
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
    password: passwordSchema,
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

function authErrorMessage(error: { message: string; code?: string }) {
  const msg = error.message.toLowerCase();
  if (msg.includes("email not confirmed") || error.code === "email_not_confirmed") {
    return "Confirme seu email antes de entrar. Verifique sua caixa de entrada.";
  }
  if (msg.includes("invalid login credentials") || error.code === "invalid_credentials") {
    return "Email ou senha incorretos";
  }
  return "Não foi possível completar a operação. Tente novamente.";
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
    aceite_termos: formData.get("aceite_termos") === "on",
  };
  const { aceite_termos: _, ...formValues } = values;

  const parsed = signUpSchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error), values: formValues };
  }

  const captchaToken = formData.get("cf-turnstile-response") as string | null;
  if (!(await verifyTurnstile(captchaToken))) {
    return {
      fieldErrors: { _form: "Verificação de segurança falhou. Tente novamente." },
      values: formValues,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { nome: parsed.data.nome, tipo: parsed.data.tipo },
    },
  });

  if (error) {
    return {
      fieldErrors: { _form: authErrorMessage(error) },
      values: formValues,
    };
  }

  // Sem sessão = confirmação de email ainda exigida pelo Supabase
  if (!data.session) {
    return {
      success: true,
      message:
        "Conta criada! Verifique seu email para confirmar o cadastro antes de entrar.",
      values: formValues,
    };
  }

  revalidatePath("/", "layout");

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

  const captchaToken = formData.get("cf-turnstile-response") as string | null;
  if (!(await verifyTurnstile(captchaToken))) {
    return {
      fieldErrors: { _form: "Verificação de segurança falhou. Tente novamente." },
      values,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: values.password,
  });

  if (error) {
    return {
      fieldErrors: { _form: authErrorMessage(error) },
      values,
    };
  }

  if (data.user) void touchLastSeen(data.user.id);

  revalidatePath("/", "layout");
  redirect(values.redirect || "/");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
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
