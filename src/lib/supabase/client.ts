import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Checks if real Supabase environment variables are provided and configured.
 */
export function isSupabaseConfigured(): boolean {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    supabaseUrl !== "https://your-project-id.supabase.co" &&
    supabaseAnonKey !== "your-anon-public-key-here" &&
    supabaseUrl!.startsWith("http")
  );
}

/**
 * Creates and returns the Supabase client instance.
 * Enables session persistence for authenticated administrative users.
 */
export function getSupabaseClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }
  return createSupabaseClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

// Default singleton client instance for convenient client-side usage
export const supabase = isSupabaseConfigured()
  ? createSupabaseClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
