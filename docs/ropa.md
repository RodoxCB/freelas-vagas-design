# Registro de Operações de Tratamento (ROPA) — Interno

> Documento interno. Não publicar na web.

## Controlador

- **Nome:** Configurável via `NEXT_PUBLIC_LGPD_CONTROLLER_NAME`
- **Canal LGPD:** `NEXT_PUBLIC_LGPD_CONTACT_EMAIL`
- **Plataforma:** Freelas e Vagas de Design (projeto comunitário)

## Operações de tratamento

| Operação | Finalidade | Categorias de dados | Base legal | Retenção | Compartilhamento |
|----------|------------|---------------------|------------|----------|------------------|
| Cadastro e autenticação | Criar conta e proteger acesso | Email, senha (hash), nome, tipo de conta | Execução de contrato / legítimo interesse | Enquanto conta ativa | Supabase Auth (sa-east-1) |
| Perfil de designer | Exibir profissionais na busca | Nome, WhatsApp, bio, foto, links, tags, localização | Consentimento (Art. 7º, I) | Enquanto perfil ativo; oculto inativo 12 meses → exclusão | Supabase DB + Storage (avatars) |
| Publicação de vagas | Exibir oportunidades | Título, descrição, contatos, imagem | Consentimento (Art. 7º, I) | 45 dias listagem; contato anonimizado +90 dias após expiração | Supabase DB + Storage (vagas) |
| Logs e segurança | Anti-abuso, auditoria | IP, timestamps de auth (Supabase) | Legítimo interesse / segurança | Padrão Supabase | Supabase, Vercel |

## Medidas de segurança

- Row Level Security (RLS) em todas as tabelas principais
- Autenticação Supabase; service role apenas no servidor
- Rate limiting (5 ações/hora por usuário em criação de perfil/vaga)
- Cloudflare Turnstile no login/cadastro (quando configurado)
- Headers HTTP de segurança (X-Frame-Options, nosniff, etc.)
- Cron diário de anonimização e limpeza de contas inativas
- Secrets em variáveis de ambiente (nunca no repositório)

## Suboperadores

| Provedor | Serviço | Região | DPA |
|----------|---------|--------|-----|
| Supabase | Postgres, Auth, Storage | sa-east-1 (Brasil) | [Supabase DPA](https://supabase.com/legal/dpa) |
| Vercel | Hospedagem, Cron | Global (edge) | [Vercel DPA](https://vercel.com/legal/dpa) |
| Cloudflare | Turnstile CAPTCHA | Global | [Cloudflare DPA](https://www.cloudflare.com/trust-hub/gdpr/) |

## Direitos dos titulares

Implementados em `/conta/dados`: exportação JSON, revogação de consentimento, exclusão de conta.

## Revisão

Revisar este documento a cada alteração relevante de schema, provedor ou finalidade de tratamento.
