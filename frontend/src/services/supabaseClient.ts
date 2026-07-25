import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Read Supabase credentials from environment variables or fallback
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key";

export const isSupabaseConfigured = (): boolean => {
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(key) && key !== "your-supabase-anon-key" && key !== "your-anon-key";
};

// Singleton Supabase Client instance
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Helper diagnostic method to check real-time connection status
export const checkSupabaseConnection = async (): Promise<{
  connected: boolean;
  configured: boolean;
  url: string;
  error?: string;
}> => {
  const configured = isSupabaseConfigured();
  if (!configured) {
    return {
      connected: false,
      configured: false,
      url: SUPABASE_URL,
      error: "Supabase environment variables (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY) not provided in .env",
    };
  }

  try {
    // Attempt a light check query to test connectivity
    const { error } = await supabase.from("_health_check").select("count").limit(1);
    // Even if table doesn't exist, a 42P01 error code or clean response means Supabase REST endpoint is reachable!
    if (error && error.code !== "PGRST301" && error.code !== "42P01") {
      return {
        connected: false,
        configured: true,
        url: SUPABASE_URL,
        error: error.message,
      };
    }

    return {
      connected: true,
      configured: true,
      url: SUPABASE_URL,
    };
  } catch (err: any) {
    return {
      connected: false,
      configured: true,
      url: SUPABASE_URL,
      error: err.message || "Network error reaching Supabase host.",
    };
  }
};

// Query table "eco verzz" directly
export const getEcoVerzzData = async (): Promise<{ data: any[] | null; error: any }> => {
  const { data, error } = await supabase.from("eco verzz").select("*");
  return { data, error };
};

/**
 * Automatically uploads/syncs user profile and authentication data into Supabase
 * without throwing errors, ensuring smooth login and registration.
 */
export const syncUserToSupabase = async (
  profile: {
    username: string;
    email: string;
    ecoPoints?: number;
    scannedItemsCount?: number;
    rank?: string;
    joinedAt?: string;
  },
  password?: string
): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase credentials pending in .env" };
  }

  try {
    // 1. If email & password present, sync with Supabase Auth
    if (password && profile.email && profile.email.includes("@")) {
      try {
        const { error: authError } = await supabase.auth.signUp({
          email: profile.email,
          password: password,
          options: {
            data: {
              username: profile.username,
              rank: profile.rank || "Citizen",
            },
          },
        });

        // If user is already registered in Supabase auth, perform sign in
        if (authError && authError.message.toLowerCase().includes("already registered")) {
          await supabase.auth.signInWithPassword({
            email: profile.email,
            password: password,
          });
        }
      } catch (authErr) {
        console.warn("Supabase auth sync notice:", authErr);
      }
    }

    // 2. Insert/Upsert user profile info into "eco verzz" table
    const payload = {
      username: profile.username,
      email: profile.email,
      eco_points: profile.ecoPoints ?? 480,
      scanned_items_count: profile.scannedItemsCount ?? 65,
      rank: profile.rank || "Citizen",
      joined_at: profile.joinedAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error: dbError } = await supabase.from("eco verzz").upsert([payload], {
      onConflict: "username",
      ignoreDuplicates: false,
    });

    if (dbError) {
      // Fallback to standard insert
      const { error: insertError } = await supabase.from("eco verzz").insert([payload]);
      if (insertError) {
        console.warn("Supabase table insert notice:", insertError.message);
        return { success: false, error: insertError.message };
      }
    }

    console.log("✅ User profile & authentication automatically uploaded to Supabase!");
    return { success: true };
  } catch (err: any) {
    console.warn("Supabase user upload fallback:", err);
    return { success: false, error: err.message || "Sync error" };
  }
};

/**
 * Automatically uploads any user submission (waste reports, food donations, community posts)
 * to Supabase cloud tables.
 */
export const uploadDataToSupabase = async (
  tableName: string,
  payload: Record<string, any>
): Promise<{ success: boolean; data?: any; error?: string }> => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase not configured in .env" };
  }

  try {
    const { data, error } = await supabase.from(tableName).insert([payload]).select();
    if (error) {
      console.warn(`Supabase upload notice for table '${tableName}':`, error.message);
      return { success: false, error: error.message };
    }
    console.log(`✅ Data automatically uploaded to Supabase table '${tableName}'!`);
    return { success: true, data };
  } catch (err: any) {
    console.warn(`Supabase upload error for table '${tableName}':`, err);
    return { success: false, error: err.message || "Upload failed" };
  }
};
