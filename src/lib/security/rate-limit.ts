import { createServiceClient } from "@/lib/supabase/admin";

export async function checkRateLimit(
  userId: string,
  action: string,
  maxPerHour = 5
): Promise<string | null> {
  const supabase = createServiceClient();
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from("rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("action", action)
    .gte("created_at", oneHourAgo);

  if (error) {
    console.error("rate limit check error:", error);
    return null;
  }

  if ((count ?? 0) >= maxPerHour) {
    return "Muitas tentativas. Aguarde uma hora e tente novamente.";
  }

  await supabase.from("rate_limits").insert({ user_id: userId, action });
  return null;
}
