import { createClient } from "@supabase/supabase-js";

/**
 * Supabase browser client untuk auth + profil.
 *
 * Butuh env var publik:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * Fallback placeholder dipakai agar build tidak gagal saat env belum diset;
 * di produksi (Vercel) nilai asli di-inline ketika build.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // Implicit flow: OAuth (Google) kembali dengan token di hash URL sehingga
    // redirect langsung ke /profil bekerja tanpa route callback terpisah.
    flowType: "implicit",
  },
});

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
};
