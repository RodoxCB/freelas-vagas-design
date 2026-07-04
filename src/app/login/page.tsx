import Link from "next/link";
import { LoginForm } from "@/components/auth/auth-forms";

export const metadata = {
  title: "Entrar — Freelas e Vagas de Design",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-semibold text-zinc-900">Entrar</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Acesse sua conta para criar ou gerenciar perfis e vagas.
      </p>
      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
        <LoginForm redirect={params.redirect} />
      </div>
      <p className="mt-4 text-center text-sm text-zinc-600">
        Não tem conta?{" "}
        <Link href="/cadastro" className="text-indigo-600 hover:text-indigo-700">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
