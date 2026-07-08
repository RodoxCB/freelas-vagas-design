import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/admin";

async function deleteUserStorage(userId: string) {
  const supabase = createServiceClient();

  for (const bucket of ["avatars", "vagas"] as const) {
    const { data: files } = await supabase.storage.from(bucket).list(userId);
    if (!files?.length) continue;

    const paths = files.map((file) => `${userId}/${file.name}`);
    await supabase.storage.from(bucket).remove(paths);
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  const { data: anonymized, error: anonError } = await supabase.rpc(
    "anonymize_expired_vagas"
  );

  if (anonError) {
    return NextResponse.json({ error: anonError.message }, { status: 500 });
  }

  const { data: inactiveUsers, error: inactiveError } = await supabase.rpc(
    "get_inactive_users_for_deletion"
  );

  if (inactiveError) {
    return NextResponse.json({ error: inactiveError.message }, { status: 500 });
  }

  let deletedUsers = 0;
  const userIds = (inactiveUsers ?? []) as { user_id: string }[];

  for (const row of userIds) {
    const userId = row.user_id;
    await deleteUserStorage(userId);
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (!error) deletedUsers += 1;
  }

  return NextResponse.json({
    anonymized_vagas: anonymized ?? 0,
    inactive_users_deleted: deletedUsers,
  });
}
