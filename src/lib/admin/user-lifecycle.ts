import { createServiceClient } from "@/lib/supabase/admin";

export async function deleteUserStorage(userId: string) {
  const supabase = createServiceClient();

  for (const bucket of ["avatars", "vagas"] as const) {
    const { data: files } = await supabase.storage.from(bucket).list(userId);
    if (!files?.length) continue;

    const paths = files.map((file) => `${userId}/${file.name}`);
    await supabase.storage.from(bucket).remove(paths);
  }
}

export async function deleteAuthUser(userId: string): Promise<string | null> {
  await deleteUserStorage(userId);
  const supabase = createServiceClient();
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) return error.message;
  return null;
}
