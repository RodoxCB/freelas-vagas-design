import { getSiteContent } from "@/lib/site-content";
import { SiteContentForm } from "@/components/admin/site-content-form";

export const metadata = { title: "Admin — Conteúdo do site" };

export default async function AdminConteudoPage() {
  const content = await getSiteContent();

  return (
    <div>
      <p className="mb-6 text-sm text-zinc-600">
        Edite textos, links e cores do site por seção. A pré-visualização atualiza em
        tempo real. Valores iguais ao padrão não são gravados no banco.
      </p>
      <SiteContentForm content={content} />
    </div>
  );
}
