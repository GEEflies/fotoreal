import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const FALLBACK_URL = "https://tvnvinawrzwutpmftqxi.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bnZpbmF3cnp3dXRwbWZ0cXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NjgyOTgsImV4cCI6MjA4OTM0NDI5OH0.zEOuhFQvHIL1_1u0tGGxB_ZzJUoedcCwE4oEKsYMshg";

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const SUPABASE_URL = envUrl || FALLBACK_URL;
const SUPABASE_ANON_KEY = envKey || FALLBACK_KEY;

console.log('[supabase-wrapper] VITE_SUPABASE_URL from env:', envUrl ? `"${envUrl.slice(0, 30)}..."` : 'MISSING — using fallback');
console.log('[supabase-wrapper] VITE_SUPABASE_PUBLISHABLE_KEY from env:', envKey ? 'SET' : 'MISSING — using fallback');
console.log('[supabase-wrapper] Final URL:', SUPABASE_URL.slice(0, 30) + '...');

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
