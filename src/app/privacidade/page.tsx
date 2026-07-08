import Link from "next/link";
import { LGPD_CONTACT_EMAIL, LGPD_CONTROLLER_NAME } from "@/lib/constants/lgpd";

export const metadata = {
  title: "Política de Privacidade — Freelas e Vagas de Design",
};

export default function PrivacidadePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-zinc-900">Política de Privacidade</h1>
      <p className="mt-2 text-sm text-zinc-500">Última atualização: julho de 2026</p>

      <div className="prose prose-zinc mt-8 max-w-none space-y-6 text-sm leading-relaxed text-zinc-700">
        <section>
          <h2 className="text-lg font-semibold text-zinc-900">1. Controlador</h2>
          <p>
            O controlador dos dados pessoais tratados nesta plataforma é{" "}
            <strong>{LGPD_CONTROLLER_NAME}</strong>. Para exercer seus direitos ou
            esclarecer dúvidas sobre privacidade, entre em contato pelo email{" "}
            <a href={`mailto:${LGPD_CONTACT_EMAIL}`} className="text-indigo-600">
              {LGPD_CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900">2. Dados coletados</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Conta: nome, email e senha (armazenada de forma criptografada pelo Supabase Auth)</li>
            <li>Perfil de designer: nome, WhatsApp, bio, localização, foto, links de portfólio, tags e especialidades</li>
            <li>Vagas: título, descrição, requisitos, email e telefone de contato, imagem opcional</li>
            <li>Dados técnicos: logs de acesso e autenticação mantidos pelo provedor de infraestrutura</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900">3. Finalidade e base legal</h2>
          <p>
            Os dados são tratados para operar a plataforma comunitária, permitir contato
            direto entre designers e anunciantes e garantir segurança. A exibição pública
            de dados de contato em perfis e vagas ocorre com base no seu{" "}
            <strong>consentimento explícito</strong> (Art. 7º, I, LGPD), registrado no
            momento da publicação.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900">4. Compartilhamento</h2>
          <p>
            Utilizamos Supabase (região sa-east-1, Brasil) para banco de dados, autenticação
            e armazenamento de imagens, e Vercel para hospedagem da aplicação. Não vendemos
            nem compartilhamos dados com terceiros para marketing.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900">5. Retenção</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Vagas ativas: até 45 dias na listagem pública</li>
            <li>Vagas expiradas ou encerradas: dados de contato anonimizados após 90 dias</li>
            <li>Perfis ocultos inativos por 12 meses: podem ser excluídos automaticamente</li>
            <li>Conta excluída: remoção dos dados pessoais associados</li>
          </ul>
        </section>

        <section id="contato">
          <h2 className="text-lg font-semibold text-zinc-900">6. Seus direitos (Art. 18 LGPD)</h2>
          <p>Você pode, a qualquer momento:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Acessar e exportar seus dados em <Link href="/conta/dados" className="text-indigo-600">Minha conta → Dados</Link></li>
            <li>Corrigir informações nos formulários de edição</li>
            <li>Revogar consentimento e ocultar seu perfil público</li>
            <li>Solicitar exclusão da conta e dos dados associados</li>
          </ul>
          <p className="mt-3">
            Solicitações também podem ser enviadas para{" "}
            <a href={`mailto:${LGPD_CONTACT_EMAIL}`} className="text-indigo-600">
              {LGPD_CONTACT_EMAIL}
            </a>
            . Responderemos em prazo razoável conforme a LGPD.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900">7. Segurança</h2>
          <p>
            Adotamos controle de acesso por usuário (RLS), autenticação segura, limites
            de taxa, verificação anti-bot e headers de segurança HTTP. Em caso de incidente
            com risco relevante aos titulares, a ANPD será comunicada conforme Art. 48 da LGPD.
          </p>
        </section>
      </div>
    </div>
  );
}
