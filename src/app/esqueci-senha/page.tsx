import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/auth-forms";

export const metadata = {
  title: "Esqueci minha senha — Freelas e Vagas de Design",
};

export default function EsqueciSenhaPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-semibold text-zinc-900">Esqueci minha senha</h1>
      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
        <ForgotPasswordForm />
      </div>
      <p className="mt-4 text-center text-sm text-zinc-600">
        <Link href="/login" className="text-indigo-600 hover:text-indigo-700">
          Voltar para login
        </Link>
      </p>
    </div>
  );
}
