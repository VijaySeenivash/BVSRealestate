import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export interface AdminUserRecord {
  id: string;
  user_id: string;
  email: string | null;
  role: string;
}

/**
 * Verifies if a user ID is registered in the public.admin_users table.
 */
export async function checkIsAdmin(userId: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { data, error } = await supabase
      .from("admin_users")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.warn("[Auth] Error checking admin authorization:", error.message);
      return false;
    }
    return Boolean(data);
  } catch (err) {
    console.error("[Auth] Unexpected error checking admin status:", err);
    return false;
  }
}

/**
 * Signs in an administrator using email & password.
 * Strictly verifies that the authenticated account is registered in public.admin_users.
 */
export async function signInAdmin(email: string, password: string) {
  if (!supabase) {
    throw new Error("Supabase is not configured. Please check your .env.local file.");
  }

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    throw authError;
  }

  if (!authData.user) {
    throw new Error("Login failed: User record not found.");
  }

  // Check authorization in admin_users table
  const isAdmin = await checkIsAdmin(authData.user.id);
  if (!isAdmin) {
    // If not an admin, immediately sign them out and reject
    await supabase.auth.signOut();
    throw new Error(
      "Access Denied: Your account is not authorized as an administrator. Please contact the administrator."
    );
  }

  return authData;
}

/**
 * Signs out the administrator.
 */
export async function signOutAdmin() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

/**
 * Retrieves the current session and verifies admin status.
 */
export async function getCurrentAdmin() {
  if (!supabase) return null;
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) return null;

    const isAdmin = await checkIsAdmin(session.user.id);
    if (!isAdmin) return null;

    return session.user;
  } catch (err) {
    return null;
  }
}

/**
 * Uploads an image file to the Supabase Storage 'property-images' bucket.
 */
export async function uploadPropertyImage(file: File): Promise<string> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `properties/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("property-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("property-images").getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Deletes an image file from the Supabase Storage 'property-images' bucket if it resides there.
 */
export async function deletePropertyImageFile(imageUrl: string): Promise<boolean> {
  if (!supabase || !imageUrl) return false;

  try {
    const marker = "/storage/v1/object/public/property-images/";
    if (!imageUrl.includes(marker)) {
      // Not a Supabase storage URL (e.g. Unsplash stock photo)
      return false;
    }

    const filePath = imageUrl.substring(imageUrl.indexOf(marker) + marker.length);
    if (!filePath) return false;

    const { error } = await supabase.storage
      .from("property-images")
      .remove([decodeURIComponent(filePath)]);

    if (error) {
      console.warn("[Storage] Failed to delete file:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("[Storage] Unexpected error deleting file:", err);
    return false;
  }
}
