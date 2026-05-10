/**
 * Supabase client configuration.
 * Uses environment variables for connection.
 *
 * Required env vars:
 *   NEXT_PUBLIC_SUPABASE_URL - Your Supabase project URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY - Your Supabase anon/public key
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
