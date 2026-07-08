# Runbook Operacional — Freelas e Vagas de Design

## Infraestrutura

| Componente | Onde | URL / Ref |
|------------|------|-----------|
| App (prod) | Vercel | https://freelas-vagas-design.vercel.app |
| App (staging) | Vercel Preview | branch `staging` |
| Banco + Auth + Storage | Supabase | ref `kxtlcbpvoxgxpmffpiba`, região `sa-east-1` |
| Repositório | GitHub | RodoxCB/freelas-vagas-design |
| Cron de retenção | Vercel Cron | `GET /api/cron/cleanup` — diário 04:00 UTC |

## Variáveis de ambiente críticas

| Variável | Unde | Uso |
|----------|------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel | Cliente Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel | Cliente Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel (server only) | Exclusão de conta, cron, rate limit |
| `CRON_SECRET` | Vercel | Autenticação do cron |
| `TURNSTILE_SECRET_KEY` | Vercel | CAPTCHA (opcional) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Vercel | CAPTCHA (opcional) |
| `NEXT_PUBLIC_SENTRY_DSN` | Vercel | Monitoramento de erros (opcional) |
| `NEXT_PUBLIC_LGPD_CONTACT_EMAIL` | Vercel | Política de privacidade |
| `NEXT_PUBLIC_LGPD_CONTROLLER_NAME` | Vercel | Política de privacidade |

## Backups e restore (Supabase)

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard) → projeto `freelas-vagas-design`
2. **Settings → Database → Backups** — verificar plano (PITR diário em planos pagos)
3. **Restore:** Settings → Database → Restore — selecionar ponto no tempo ou backup
4. Após restore, regerar types: `supabase gen types typescript --linked > src/types/database.ts`
5. Validar RLS e Storage policies no ambiente restaurado

## Deploy

- Push em `main` → produção automática (Vercel)
- Push em `staging` → preview/staging
- Migrations: `supabase db push` (local CLI linkado ao projeto remoto)

## Cron de retenção

Endpoint: `GET /api/cron/cleanup` com header `Authorization: Bearer $CRON_SECRET`

Ações:
1. `anonymize_expired_vagas()` — anonimiza contatos 90 dias após expiração
2. `get_inactive_users_for_deletion()` — remove contas inativas 12+ meses (sem vagas ativas, perfil oculto ou inexistente)

Testar localmente:
```bash
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/cleanup
```

## Incidente de vazamento de dados

1. **Conter:** rotacionar `SUPABASE_SERVICE_ROLE_KEY` e `anon key` se comprometidas; revisar logs Supabase/Vercel
2. **Avaliar impacto:** quais titulares, quais categorias de dados, risco ao titular
3. **Notificar ANPD** em até 72h se houver risco relevante (Art. 48 LGPD)
4. **Comunicar titulares** afetados quando aplicável
5. **Documentar** timeline, causa raiz e ações corretivas

Contatos:
- Supabase Support: dashboard → Support
- Vercel Support: vercel.com/support
- LGPD interno: `NEXT_PUBLIC_LGPD_CONTACT_EMAIL`

## Moderação de conteúdo

1. Identificar perfil/vaga abusiva (report da comunidade ou revisão manual)
2. Supabase Dashboard → Table Editor → `designers` ou `vagas`
3. Encerrar vaga (`status = encerrada'`) ou ocultar designer (`status = 'oculto'`)
4. Casos graves: excluir usuário via Auth → Users ou acionar exclusão de conta

## Monitoramento

- **Sentry** (se `NEXT_PUBLIC_SENTRY_DSN` configurado): erros de runtime e auth
- **Vercel Analytics / Logs:** falhas de deploy e 5xx
- **Supabase Logs:** auth failures, queries anômalas

## Manutenção de dependências

- Dependabot configurado em `.github/dependabot.yml`
- Revisar PRs de segurança semanalmente
- Após migration: `supabase gen types` + CI build

## Checklist pós-incidente / release de segurança

- [ ] Migration aplicada em prod
- [ ] Env vars atualizadas na Vercel
- [ ] Cron respondendo 200
- [ ] Login/cadastro funcionando
- [ ] Exclusão de conta testada em staging
- [ ] Política de privacidade reflete controlador/contato corretos
