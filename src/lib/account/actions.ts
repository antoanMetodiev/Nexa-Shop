"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin-client";

/**
 * Account server actions. None of these throw: a thrown Server Action error
 * surfaces on the client as an opaque "Minified React error #441" in
 * production (the real message is redacted), so every failure is returned
 * as { error } and logged server-side instead.
 */

export async function uploadAvatar(
  formData: FormData,
): Promise<{ url: string } | { error: string }> {
  try {
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

    // Service-role client: bypasses storage RLS. The user's identity was
    // verified above via their session, same pattern as admin actions.
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
  } catch (error) {
    // Most likely cause in production: SUPABASE_SERVICE_ROLE_KEY missing
    // from the Worker's secrets (admin-client.ts throws on init).
    console.error("uploadAvatar crashed:", error);
    return { error: "Upload failed" };
  }
}

export async function updateProfile(input: {
  full_name: string;
  phone: string;
  avatar_url: string | null;
}): Promise<{ error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Not authenticated" };
    }

    // Written through the user's own session client, so the
    // "Users can update their own profile" RLS policy is what authorizes it.
    const { error } = await supabase
      .from("users")
      .update({
        full_name: input.full_name.trim() || null,
        phone: input.phone.trim() || null,
        avatar_url: input.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("updateProfile failed:", error.message);
      return { error: "Update failed" };
    }
    return {};
  } catch (error) {
    console.error("updateProfile crashed:", error);
    return { error: "Update failed" };
  }
}
