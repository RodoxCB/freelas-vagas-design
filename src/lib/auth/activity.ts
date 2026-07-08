import { createServiceClient } from "@/lib/supabase/admin";

export async function touchLastSeen(userId: string) {
  try {
    const supabase = createServiceClient();
    await supabase
      .from("profiles")
      .update({ last_seen_at: new Date().toISOString() })
      .eq("id", userId);
  } catch {
    // Non-critical
  }
}
