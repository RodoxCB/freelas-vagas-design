#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

SERVICE_ROLE=$(supabase projects api-keys --project-ref kxtlcbpvoxgxpmffpiba 2>/dev/null | node -e "
const d=JSON.parse(require('fs').readFileSync(0,'utf8'));
const k=d.keys?.find(x=>x.id==='service_role');
if(!k) process.exit(1);
console.log(k.api_key);
")

CRON_SECRET=$(openssl rand -base64 32)

add_env() {
  local name="$1"
  local value="$2"
  local env="$3"
  if [[ "$env" == "development" ]]; then
    printf '%s' "$value" | vercel env add "$name" "$env" --force
  else
    printf '%s' "$value" | vercel env add "$name" "$env" --force --sensitive 2>/dev/null || \
    printf '%s' "$value" | vercel env add "$name" "$env" --force
  fi
}

echo "Configurando variáveis na Vercel..."

for env in production preview development; do
  add_env "SUPABASE_SERVICE_ROLE_KEY" "$SERVICE_ROLE" "$env"
  add_env "CRON_SECRET" "$CRON_SECRET" "$env"
  add_env "NEXT_PUBLIC_LGPD_CONTROLLER_NAME" "Rodolfo Cristan Behr — Freelas e Vagas de Design" "$env"
  add_env "NEXT_PUBLIC_LGPD_CONTACT_EMAIL" "rodolfo.cristanbehr@gmail.com" "$env"
done

add_env "NEXT_PUBLIC_SITE_URL" "https://freelas-vagas-design.vercel.app" "production"
add_env "NEXT_PUBLIC_SITE_URL" "https://freelas-vagas-design-git-staging-vdveiculos.vercel.app" "preview"
  add_env "NEXT_PUBLIC_SITE_URL" "http://localhost:3000" "development"

ADMIN_PASSWORD=$(openssl rand -base64 24)
for env in production preview development; do
  add_env "ADMIN_PASSWORD" "$ADMIN_PASSWORD" "$env"
done

echo "CRON_SECRET (guarde em local seguro): $CRON_SECRET"
echo "ADMIN_PASSWORD (painel /admin): $ADMIN_PASSWORD"
echo "Concluído."
