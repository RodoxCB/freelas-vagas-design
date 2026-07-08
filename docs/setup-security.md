# Configuração de segurança — Turnstile (CAPTCHA)

O login e cadastro usam Cloudflare Turnstile quando as chaves estão configuradas.

## 1. Criar widget no Cloudflare

1. Acesse [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile)
2. **Add widget** → modo **Managed**
3. Hostnames:
   - `freelas-vagas-design.vercel.app`
   - `freelas-vagas-design-git-staging-vdveiculos.vercel.app`
   - `localhost`
4. Copie **Site Key** e **Secret Key**

## 2. Configurar na Vercel

```bash
printf 'SUA_SITE_KEY' | vercel env add NEXT_PUBLIC_TURNSTILE_SITE_KEY production --force
printf 'SUA_SITE_KEY' | vercel env add NEXT_PUBLIC_TURNSTILE_SITE_KEY preview --force
printf 'SUA_SITE_KEY' | vercel env add NEXT_PUBLIC_TURNSTILE_SITE_KEY development --force

printf 'SUA_SECRET_KEY' | vercel env add TURNSTILE_SECRET_KEY production --force --sensitive
printf 'SUA_SECRET_KEY' | vercel env add TURNSTILE_SECRET_KEY preview --force --sensitive
printf 'SUA_SECRET_KEY' | vercel env add TURNSTILE_SECRET_KEY development --force --sensitive
```

## 3. (Opcional) CAPTCHA no Supabase Auth

Dashboard → Authentication → Bot and Abuse Protection → Turnstile → mesma Secret Key.

## 4. Redeploy

Após adicionar as chaves, faça redeploy na Vercel para ativar o widget.
