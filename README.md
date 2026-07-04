# Freelas e Vagas de Design

Plataforma comunitária para conectar designers e oportunidades de trabalho.

## Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- Supabase (Postgres + RLS)
- Zod

## Setup

1. Copie as variáveis de ambiente:

```bash
cp .env.local.example .env.local
```

2. Crie um projeto no [Supabase](https://supabase.com/dashboard) e preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

3. Rode a migration:

```bash
# Via Supabase CLI (com projeto linkado)
supabase db push

# Ou execute o SQL em supabase/migrations/001_initial_schema.sql no SQL Editor do Supabase
```

4. (Opcional) Seed de desenvolvimento:

```bash
# Execute supabase/seed.sql no SQL Editor
```

5. Inicie o servidor:

```bash
npm run dev
```

## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anon do Supabase |
| `NEXT_PUBLIC_COMUNIDADE_URL` | Link do grupo (WhatsApp, etc.) |
| `NEXT_PUBLIC_SITE_URL` | URL do site |

## Deploy (Vercel)

1. Importe o repositório na Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

## Páginas

- `/` — Home
- `/designers` — Buscar designers
- `/designers/novo` — Cadastro de designer
- `/designers/[id]` — Perfil do designer
- `/vagas` — Lista de vagas
- `/vagas/nova` — Publicar vaga
- `/vagas/[id]` — Detalhe da vaga
- `/comunidade` — Sobre a comunidade
- `/apoiar` — Página de apoio
