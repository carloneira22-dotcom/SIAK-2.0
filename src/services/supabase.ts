import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ayvzqzlcgfaqtkxaysbj.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5dnpxemxjZ2ZhcXRreGF5c2JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0Nzg2MTEsImV4cCI6MjA4ODA1NDYxMX0.r6j0s9XNsx2AWmPvWCdXjOYqsbeSydgnnUuBGoC_s-U';

export const supabase = createClient(supabaseUrl, supabaseKey);
