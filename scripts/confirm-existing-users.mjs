/**
 * Confirma emails de usuários existentes após habilitar enable_confirmations.
 * Uso: node scripts/confirm-existing-users.mjs
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1000 });
if (error) {
  console.error("listUsers:", error.message);
  process.exit(1);
}

let confirmed = 0;
for (const user of data.users) {
  if (user.email_confirmed_at) continue;
  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
    email_confirm: true,
  });
  if (updateError) {
    console.error(`Falha ${user.email}:`, updateError.message);
  } else {
    confirmed += 1;
    console.log(`Confirmado: ${user.email}`);
  }
}

console.log(`Total confirmados: ${confirmed}`);
