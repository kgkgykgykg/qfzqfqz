import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://vkhqguzyxotdxpxbqvfn.supabase.co';
export const supabaseAnonKey = 'sb_publishable_7qTX3c-EGr0fG188eYEs8A_mOaPY4_m';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
