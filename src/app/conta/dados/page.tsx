import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { AccountDataPanel } from "@/components/account/account-data-panel";

export const metadata = {
  title: "Meus dados — Freelas e Vagas de Design",
};

export default async function ContaDadosPage() {
  const { user } = await getSession();
  if (!user) redirect("/login?redirect=/conta/dados");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-semibold text-zinc-900">Meus dados</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Exercite seus direitos previstos na LGPD: acesso, portabilidade, revogação
        de consentimento e exclusão de conta.
      </p>
      <div className="mt-8">
        <AccountDataPanel />
      </div>
    </div>
  );
}
