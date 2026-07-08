import { getSiteContent } from "@/lib/site-content";
import { SiteContentForm } from "@/components/admin/site-content-form";

export const metadata = { title: "Admin — Conteúdo do site" };

export default async function AdminConteudoPage() {
  const content = await getSiteContent();

  return (
    <div>
      <p className="mb-6 text-sm text-zinc-600">
        Edite textos e links do site. Valores iguais ao padrão não são gravados no banco.
        Alterações entram em vigor imediatamente, sem novo deploy.
      </p>
      <SiteContentForm content={content} />
    </div>
  );
}
