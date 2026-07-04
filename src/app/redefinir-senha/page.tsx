import { ResetPasswordForm } from "@/components/auth/auth-forms";

export const metadata = {
  title: "Redefinir senha — Freelas e Vagas de Design",
};

export default function RedefinirSenhaPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-semibold text-zinc-900">Redefinir senha</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Escolha uma nova senha para sua conta.
      </p>
      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
