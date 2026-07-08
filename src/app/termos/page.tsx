import Link from "next/link";
import { LGPD_CONTACT_EMAIL } from "@/lib/constants/lgpd";

export const metadata = {
  title: "Termos de Uso — Freelas e Vagas de Design",
};

export default function TermosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-zinc-900">Termos de Uso</h1>
      <p className="mt-2 text-sm text-zinc-500">Última atualização: julho de 2026</p>

      <div className="prose prose-zinc mt-8 max-w-none space-y-6 text-sm leading-relaxed text-zinc-700">
        <section>
          <h2 className="text-lg font-semibold text-zinc-900">1. Sobre a plataforma</h2>
          <p>
            Freelas e Vagas de Design é um projeto comunitário gratuito para conectar
            designers e oportunidades. A plataforma não intermedia pagamentos, contratos
            ou comunicações — o contato é direto entre as partes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900">2. Cadastro e conta</h2>
          <p>
            Ao criar uma conta, você declara que as informações fornecidas são verdadeiras
            e que aceita estes Termos e a{" "}
            <Link href="/privacidade" className="text-indigo-600">
              Política de Privacidade
            </Link>
            . Você é responsável por manter sua senha segura e por atividades realizadas
            em sua conta.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900">3. Conteúdo publicado</h2>
          <p>
            Você é responsável pelo conteúdo de perfis, vagas e imagens que publicar.
            É proibido publicar conteúdo ilegal, discriminatório, enganoso ou que viole
            direitos de terceiros. Reservamo-nos o direito de remover conteúdo abusivo
            e encerrar contas que violem estes termos.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900">4. Limitação de responsabilidade</h2>
          <p>
            A plataforma é oferecida &quot;como está&quot;, sem garantias de disponibilidade
            contínua ou de resultados de contratação. Não nos responsabilizamos por acordos,
            pagamentos ou disputas entre usuários.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900">5. Alterações</h2>
          <p>
            Estes termos podem ser atualizados. Alterações relevantes serão comunicadas
            na plataforma. O uso continuado após mudanças implica aceite da versão vigente.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900">6. Contato</h2>
          <p>
            Dúvidas sobre estes termos:{" "}
            <a href={`mailto:${LGPD_CONTACT_EMAIL}`} className="text-indigo-600">
              {LGPD_CONTACT_EMAIL}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
