"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  forgotPasswordAction,
  signInAction,
  signUpAction,
  updatePasswordAction,
  type AuthFormState,
} from "@/actions/auth";
import { Button, Input, Select } from "@/components/ui";
import { USER_TIPO_LABELS } from "@/lib/constants";

export function LoginForm({ redirect }: { redirect?: string }) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    signInAction,
    {}
  );
  const values = state.values ?? {};
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-4">
      {redirect && <input type="hidden" name="redirect" value={redirect} />}
      {errors._form && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors._form}
        </div>
      )}
      <Input
        label="Email"
        name="email"
        type="email"
        required
        defaultValue={values.email ?? ""}
        error={errors.email}
      />
      <Input
        label="Senha"
        name="password"
        type="password"
        required
        defaultValue={values.password ?? ""}
        error={errors.password}
      />
      <div className="text-right">
        <Link href="/esqueci-senha" className="text-sm text-indigo-600 hover:text-indigo-700">
          Esqueci minha senha
        </Link>
      </div>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}

export function SignUpForm() {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    signUpAction,
    {}
  );
  const values = state.values ?? {};
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-4">
      {errors._form && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors._form}
        </div>
      )}
      <Input
        label="Nome"
        name="nome"
        required
        defaultValue={values.nome ?? ""}
        error={errors.nome}
      />
      <Input
        label="Email"
        name="email"
        type="email"
        required
        defaultValue={values.email ?? ""}
        error={errors.email}
      />
      <Input
        label="Senha"
        name="password"
        type="password"
        required
        defaultValue={values.password ?? ""}
        error={errors.password}
        placeholder="Mínimo 6 caracteres"
      />
      <Select
        label="Eu sou..."
        name="tipo"
        required
        defaultValue={values.tipo ?? "designer"}
        error={errors.tipo}
      >
        {Object.entries(USER_TIPO_LABELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </Select>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Criando conta..." : "Criar conta"}
      </Button>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    forgotPasswordAction,
    {}
  );
  const values = state.values ?? {};
  const errors = state.fieldErrors ?? {};

  if (state.success) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        {state.message}
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <p className="text-sm text-zinc-600">
        Informe seu email e enviaremos instruções para redefinir sua senha.
      </p>
      <Input
        label="Email"
        name="email"
        type="email"
        required
        defaultValue={values.email ?? ""}
        error={errors.email}
      />
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Enviando..." : "Enviar instruções"}
      </Button>
    </form>
  );
}

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    updatePasswordAction,
    {}
  );
  const values = state.values ?? {};
  const errors = state.fieldErrors ?? {};

  if (state.success) {
    return (
      <div className="space-y-4 text-center">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {state.message}
        </div>
        <Button href="/login">Ir para login</Button>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      {errors._form && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors._form}
        </div>
      )}
      <Input
        label="Nova senha"
        name="password"
        type="password"
        required
        defaultValue={values.password ?? ""}
        error={errors.password}
        placeholder="Mínimo 6 caracteres"
      />
      <Input
        label="Confirmar senha"
        name="confirmPassword"
        type="password"
        required
        defaultValue={values.confirmPassword ?? ""}
        error={errors.confirmPassword}
      />
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Salvando..." : "Redefinir senha"}
      </Button>
    </form>
  );
}
