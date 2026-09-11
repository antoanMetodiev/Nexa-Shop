"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin-client";

/**
 * Uploads the signed-in user's avatar through the service-role client
 * (bypasses storage RLS) instead of the browser doing it directly — the
 * user's identity is still independently verified here via their session
 * before anything is written, same pattern as admin server actions. Avoids
 * depending on storage.objects RLS policies, which are hard to debug
 * without direct SQL access and weren't taking effect reliably.
 */
export async function uploadAvatar(
  formData: FormData,
): Promise<{ url: string } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { error: "No file provided" };
  }

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${user.id}/avatar.${ext}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    console.error("uploadAvatar failed:", uploadError.message);
    return { error: "Upload failed" };
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from("avatars").getPublicUrl(path);

  return { url: `${publicUrl}?t=${Date.now()}` };
}
