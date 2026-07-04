import Link from "next/link";
import { SignUpForm } from "@/components/auth/auth-forms";

export const metadata = {
  title: "Criar conta — Freelas e Vagas de Design",
};

export default function CadastroPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-semibold text-zinc-900">Criar conta</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Escolha se você é designer ou anunciante para começar.
      </p>
      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
        <SignUpForm />
      </div>
      <p className="mt-4 text-center text-sm text-zinc-600">
        Já tem conta?{" "}
        <Link href="/login" className="text-indigo-600 hover:text-indigo-700">
          Entrar
        </Link>
      </p>
    </div>
  );
}
