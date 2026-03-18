import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://tvnvinawrzwutpmftqxi.supabase.co";

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bnZpbmF3cnp3dXRwbWZ0cXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NjgyOTgsImV4cCI6MjA4OTM0NDI5OH0.zEOuhFQvHIL1_1u0tGGxB_ZzJUoedcCwE4oEKsYMshg";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
